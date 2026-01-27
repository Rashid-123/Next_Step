
import razorpay from "../lib/razorpay.js"
export const create_order = async (req, res) => {
  console.log("in create order")
  try {
    const { amount } = req.body;
    // console.log("amount " , amount)
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes:{
        userId: req.user.id,
      }
    });
     console.log("order : " , order)
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
}

