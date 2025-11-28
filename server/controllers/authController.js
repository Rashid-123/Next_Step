
import dotenv from "dotenv";
dotenv.config();
import admin from 'firebase-admin';

import mongoose from 'mongoose';
import User from "../models/User.js" 
import { redis } from "../lib/redis.js"; 

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!privateKey) {
  console.error("🔥 FIREBASE_PRIVATE_KEY is not defined in environment variables");
  throw new Error("FIREBASE_PRIVATE_KEY is missing");
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure newlines are correctly interpreted
    }),
  });
}

const USER_CACHE_TTL_SECONDS = 60 * 15; // Cache user for 15 minutes

const handleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the Firebase ID token (ALWAYS REQUIRED FOR SECURITY)
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken; // 'name' and 'picture' might be undefined for email/password auth

    const cacheKey = `user:${uid}`; // Unique cache key for the user

    let user;

    // --- Try to get user from cache ---
    // try {
    //   const cachedUser = await redis.get(cacheKey);
    //   if (cachedUser) {
    //     console.log(`User ${uid} found in cache.`);
    //     user = JSON.parse(cachedUser); // Parse the cached JSON string back to an object
    //   }
    // } catch (cacheError) {
    //   console.error("Error reading from Redis cache for user:", cacheError);
    //   // Don't block the request, proceed to database if caching fails
    // }


    if (!user) { 
      console.log(`User ${uid} not found in cache, fetching from DB.`);
    
      user = await User.findOne({ firebaseUID: uid });

      if (!user) {
       
        let displayNameToUse = name;

        if (!displayNameToUse && email) {
         
          const emailPrefix = email.split('@')[0];
          displayNameToUse = emailPrefix
            .replace(/[^a-zA-Z0-9]/g, ' ') 
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim(); 

       
          if (!displayNameToUse || /^\d+$/.test(displayNameToUse)) {
              displayNameToUse = 'New User';
          }
        }
    
        if (!displayNameToUse) {
            displayNameToUse = 'New User';
        }

       
        const photoURLToUse = picture || '';


        console.log(`Creating new user for UID: ${uid}`);
        user = new User({
          firebaseUID: uid,
          email,
          displayName: displayNameToUse,
          photoURL: photoURLToUse,
          role: 'user', // Default role
          bookmarked: [],
          credits: 50, // Default credits
          // leetcode: '', // Initialize other fields if necessary
        });
        await user.save();
      }

      // // --- Cache the user object after fetching/creating ---
      // try {
   
      //   await redis.set(cacheKey, JSON.stringify(user.toObject()), { ex: USER_CACHE_TTL_SECONDS });
      //   console.log(`User ${uid} cached successfully.`);
      // } catch (cacheError) {
      //   console.error("Error writing to Redis cache for user:", cacheError);
      //   // Don't block the request if caching fails
      // }
    }

    // Respond with the user data (ensure it's a plain object)
    res.json({
      user: {
        id: user._id, // MongoDB _id
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
        bookmarked: user.bookmarked,
        leetcode: user.leetcode,
        credits: user.credits,
      }
    });

  } catch (error) {
    console.error('Authentication error:', error);
    // More specific error handling for Firebase token verification issues
    if (error.code === 'auth/id-token-expired') {
        res.status(401).json({ error: 'Authentication failed: ID token expired. Please log in again.' });
    } else if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-id-token') {
        res.status(401).json({ error: 'Authentication failed: Invalid ID token.' });
    } else {
        res.status(500).json({ error: 'Authentication failed' });
    }
  }
};

export { handleAuth };