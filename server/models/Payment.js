import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    razorpayPaymentId: {
      type: String,
      required: true,
      unique: true, // Idempotency guarinty 
    },

    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number, 
      required: true,
    },

    creditsAdded: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "captured", "failed"],
      default: "created",
    },

    event: {
      type: String, 
    },

    rawEvent: {
      type: Object, // full webhook payload (for audit/debug)
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
