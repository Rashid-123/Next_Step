import User from "../models/User.js";
import crypto from "crypto"


export const razorpayWebhook = async (req, res) => {
    console.log("razorpay hit the backend")
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expected = crypto
        .createHmac("sha256", secret)
        .update(req.body) 
        .digest("hex");

    if (signature !== expected) {
        return res.status(400).send("Invalid signature");
    }

const event = JSON.parse(req.body.toString());

    if (event.event !== "payment.captured") {
        return res.status(200).send("Ignored");
    }

    const payment = event.payload.payment.entity;
    const paymentId = payment.id;
    const orderNotes = payment.notes;
    const userId = orderNotes.userId;

    // ---  Credit Mapping  ----
    const CREDIT_MAP = {
        19900: 50,
        49900: 150,
    }

    const creditsToAdd = CREDIT_MAP[payment.amount];
    if (!creditsToAdd) {
        return res.status(200).send("Unknown amount");
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(200).send("User not found");
    }

    //----------- Handling IDEMPOTENCY ------------------
    if (user.processedPayments.includes(paymentId)) {
        return res.status(200).send("Already Processed");
    }

    user.credits += creditsToAdd;
    user.processedPayments.push(paymentId);

    await user.save();

    return res.status(200).send("Credits added");

}