
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    photoURL: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bookmarks: {
      type: [String],
      default: [],
    },
    leetcode: String,
    github: String,
    credits:{type: Number , default: 0},

   // Payment 
   processedPayments: {
    type:[String],  // razorpay payment_id
    default: []
   },

    recommendationHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recommendation",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
