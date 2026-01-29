import mongoose from "mongoose";

// Schema for each recommended problem inside an event
const RecommendedProblemSchema = new mongoose.Schema({
  recommendedProblemNumber: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleSlug: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  usedProblemNumbers: {
    type: [String],
    required: true,
  },
  message: {
    type: String,
  },
}, { _id: true });

// Schema for the entire recommendation event
const RecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    recommendations: {
      type: [RecommendedProblemSchema],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,    
    },
  }
);

RecommendationSchema.index({ userId: 1, createdAt: -1 }); // compound index


export default mongoose.models.Recommendation ||
  mongoose.model("Recommendation", RecommendationSchema);
