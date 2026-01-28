import User from "../models/User.js";
import crypto from "crypto"
import Payment from "../models/Payment.js";


export const razorpayWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto.createHmac("sha256", secret).update(req.body).digest("hex");

    if (signature != expectedSignature) {
        return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    if (event.event !== "payment.captured") {
        return res.status(200).send("Ignored");
    }

    const paymentEntity = event.payload.payment.entity;

    const razorpayPaymentId = paymentEntity.id;
    const razorpayOrderId = paymentEntity.order_id;
    const amount = paymentEntity.amount;
    const userId = paymentEntity.notes?.userId;
    
    // Credit mapping
    const CREDIT_MAP = {
        19900: 50,
        49900: 150,
    };

    const creditsToAdd = CREDIT_MAP[amount];
    if (!creditsToAdd || !userId) {
        return res.status(200).send("Invalid payment data");
    }

    // ---------------- IDEMPOTENCY BARRIER ---------------

    try {
        await Payment.create({
            razorpayPaymentId,
            razorpayOrderId,
            userId,
            amount,
            creditsAdded: creditsToAdd,
            status: "captured",
            event: event.event,
            rawEvent: event,
        });


    } catch (err) {
        // DUPLICATE WEBHOOK (already processed)
        if (err.code === 11000) {
            return res.status(200).send("Already processed");
        }
        throw err;
    }

    // ATOMIC CREDIT UPDATE ----------------

    await User.findByIdAndUpdate(
        userId,
        { $inc: { credits: creditsToAdd } },
        { new: true }
    );

    return res.status(200).send("Credit added");


}