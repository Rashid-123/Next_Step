import User from "../models/User.js";

export const protect = async (req, res, next) => {
 console.log("--------- inside the authMiddleware-----")
  const user = await User.findOne({ firebaseUID: req.auth.uid });
  console.log(user)
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  req.user = user;
  next();
  console.log("-----------authMiddleware end -----------")
};


