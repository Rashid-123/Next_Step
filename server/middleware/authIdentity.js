import admin from "firebase-admin";

export const authIdentity = async (req, res, next) => {
    console.log("-------- inside the authidentiry")
    const auth = req.headers.authorization;
   

    if (!auth?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const token = auth.split("Bearer ")[1];
        const decoded = await admin.auth().verifyIdToken(token);

        req.auth = { uid: decoded.uid };
        console.log(req.auth)
      
       console.log("----  auth identity end ")

        next();
 
    } catch {
        return res.status(401).json({ message: "Invalid Token" });
    }
}