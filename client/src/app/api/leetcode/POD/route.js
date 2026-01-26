
import {redis} from "@/lib/redis"; // Adjust based on your project setup
import { NextResponse } from 'next/server';

// Helper to get TTL until next midnight UTC
function getSecondsUntilNextUTCMidnight() {
  const now = new Date();
  const nextMidnightUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  ));
  return Math.floor((nextMidnightUTC.getTime() - now.getTime()) / 1000);
}

export async function POST(req) {
  console.log("Request received for POD");

  const todayUTC = new Date().toISOString().split("T")[0]; 
  // const cacheKey = `leetcodePOD:${todayUTC}`;

  try {
    // const cached = await redis.get(cacheKey); 

    // if (cached) {
    //   console.log("Serving POD from cache");
    //   let dataToReturn;

    
    //   if (typeof cached === 'object' && cached !== null) {
    //     dataToReturn = cached; // Use the object directly
    //   } else if (typeof cached === 'string') {
    //     try {
    //       dataToReturn = JSON.parse(cached);
    //     } catch (parseError) {
    //       console.error("Failed to parse cached string as JSON:", parseError);
    //       dataToReturn = null;
    //     }
    //   } else {
    
    //     console.warn("Unexpected type for cached data:", typeof cached);
    //     dataToReturn = null;
    //   }

    //   if (dataToReturn) {
    //     return NextResponse.json(dataToReturn, { status: 200 });
    //   }
    // }

    const query = {
      query: `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
              acRate
              difficulty
              freqBar
              questionFrontendId
              isFavor
              isPaidOnly
              status
              title
              titleSlug
              hasVideoSolution
              hasSolution
              topicTags {
                name
                id
                slug
              }
            }
          }
        }
      `,
    };

    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    const data = await res.json(); 

   
    // const dataToCache = JSON.stringify(data);

    // const ttl = getSecondsUntilNextUTCMidnight();
    // await redis.set(cacheKey, dataToCache, { ex: ttl });

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error fetching POD:", error);
    // Ensure error responses are also valid JSON
    return NextResponse.json(
      { error: error.message || "Failed to fetch POD" },
      { status: 500 }
    );
  }
}