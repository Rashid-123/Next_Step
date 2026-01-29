import User from '../models/User.js';
import Recommendation from '../models/Recommendation.js';
import recommendProblems from '../utils/recommendProblems.js';
import {redis} from "../lib/redis.js"
export const createRecommendation = async (req, res) => {
    const userId = req.user._id;
    console.log(req.user)
    const { problemNumbers, numRecommendations, Hard, name } = req.body;

    console.log('Controller input:', { problemNumbers, numRecommendations, Hard, name });

    if (!Array.isArray(problemNumbers) || problemNumbers.length !== 20) {
        return res.status(400).json({
            error: 'Please provide exactly 20 problem numbers as an array'
        });
    }

    const convertedProblemNumbers = problemNumbers.map(num => {
        const converted = typeof num === 'string' ? parseInt(num, 10) : num;
        if (isNaN(converted)) {
            return res.status(400).json({
                error: `Invalid problem number: ${num}`
            });
        }
        return converted;
    });

    console.log('Converted problem numbers:', convertedProblemNumbers);

    if (numRecommendations !== 5 && numRecommendations !== 10) {
        return res.status(400).json({
            error: 'Number of recommendations must be either 5 or 10'
        });
    }

    const includeHard = Hard === "true" || Hard === true;

    try {
        // console.log('Calling recommendProblems with:', {
        //     problemNumbers: convertedProblemNumbers,
        //     numRecommendations,
        //     includeHard
        // });

        // ----------- timeout to catch hanging requests --------
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout after 60 seconds')), 60000)
        );

        const recommendationPromise = recommendProblems(convertedProblemNumbers, numRecommendations, includeHard);

        const response = await Promise.race([recommendationPromise, timeoutPromise]);

        console.log('Recommendation service response:', response);

        if (response.error) {
            console.error('Recommendation service error:', response.error);
            return res.status(400).json({
                error: response.error,
                details: response.details
            });
        }

        const { recommendedProblems } = response;

        if (!recommendedProblems || !Array.isArray(recommendedProblems)) {
            console.error('Invalid response format from recommendation service:', response);
            return res.status(500).json({
                error: 'Invalid response from recommendation service'
            });
        }

        const formattedRecommendations = recommendedProblems.map(problem => ({
            recommendedProblemNumber: problem.recommendedProblemNumber,
            title: problem.title,
            titleSlug: problem.titleSlug,
            difficulty: problem.difficulty,
            usedProblemNumbers: problem.usedProblemNumbers,
            message: problem.message
        }));

        // ----------  new recommendation document ------
        const doc = await Recommendation.create({
            userId,
            recommendations: formattedRecommendations,
            name,
            createdAt: new Date(),
        });


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { credits: -numRecommendations } },
            { new: true }
        );

        // --------- REDIS WRITE ---------------- 

        const listKey = `user:${userId}:recommendations:list`;
        const recKey = `recommendation:${doc._id}`

        //  Individual cache
        await redis.set(recKey, JSON.stringify(doc), { EX: 3600 });

        // list cache (prepend newest)
        await redis.lpush(
            listKey,
            JSON.stringify({
                id: doc._id,
                count: doc.recommendations.length,
                name: doc.name,
                date: doc.createdAt,
            })
        )
        await redis.expire(listKey, 3600);


        return res.status(200).json({
            message: 'Recommendation created successfully',
            recommendationId: doc._id,
            recommendations: formattedRecommendations,
            name: name,
            createdAt: doc.createdAt,
            credits: updatedUser.credits
        });

    } catch (error) {
        console.error("Error creating recommendation:", error);


        if (error.message.includes('timeout')) {
            return res.status(408).json({
                error: 'Request timeout - recommendation service took too long'
            });
        }

        if (error.message.includes('PINECONE') || error.message.includes('Pinecone')) {
            return res.status(503).json({
                error: 'Vector database service unavailable'
            });
        }

        if (error.message.includes('OpenAI') || error.message.includes('openai')) {
            return res.status(503).json({
                error: 'AI service unavailable'
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

//----------- Get all recommendations for a user ------------------

export const getAllRecommendations = async (req, res) => {
    console.log("---------Get all recommendations called");
    const userId = req.user._id;
    console.log("User ID:", userId);

    const listKey = `user:${userId}:recommendations:list`

    try {

        const cached = await redis.lrange(listKey, 0, -1);
        console.log(cached)

        if (cached.length) {
            console.log("------ All response from the cache")
            return res.status(200).json({
                message: "Recommendations retrieved successfully from cache",
                  recommendations: cached,
            })
        }

        const docs = await Recommendation.find({ userId })
            .select("_id name createdAt recommendations")
            .sort({ createdAt: -1 });


        const formatted = docs.map(rec => ({
            id: rec._id,
            count: rec.recommendations.length,
            name: rec.name,
            date: rec.createdAt,
        }));

        if (formatted.length) {
            await redis.del(listKey);
            for (const item of formatted) {
                await redis.rpush(listKey, JSON.stringify(item));
            }
            await redis.expire(listKey, 3600);
        }

        return res.status(200).json({
            message: 'Recommendations retrieved successfully',
            recommendations: formatted
        });

    } catch (error) {
        console.error("Error retrieving recommendations:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

//------------- Get a specific recommendation by ID -----------
export const getRecommendation = async (req, res) => {
    console.log("----------- Get individual recommendatoin ")
    const userId = req.user._id;
    const { id } = req.params;
    const recKey = `recommendation:${id}`;


    try {
        const cached = await redis.get(recKey);
        if (cached) {
            console.log("--------- individual response from the cache")
            return res.status(200).json({
                message: "Recommendation retrieved successfully from cache",
                recommendation: cached,
            });
        }

        const recommendation = await Recommendation.findOne({
            _id: id,
            userId,
        });

        if (!recommendation) {
            return res.status(404).json({ error: 'Recommendation not found' });
        }

        await redis.set(recKey, JSON.stringify(recommendation), { EX: 3600 });


        return res.status(200).json({
            message: "Recommendation retrieved successfully",
            recommendation,
        });
    } catch (error) {
        console.error("Error retrieving recommendation:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
