
import fetch from "node-fetch";
import fs from "fs";
import pLimit from "p-limit";
import striptags from "striptags";

const CONCURRENCY_LIMIT = 5;
const OUTPUT_FILE = "leetcode_problems_2501_to_3535.json";

// Step 1: Get all title slugs using pagination
const getAllTitleSlugs = async () => {
  const allProblems = [];
  const batchSize = 500;
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const query = `
      query getProblemList($limit: Int, $skip: Int) {
        problemsetQuestionListV2(limit: $limit, skip: $skip) {
          questions {
            questionFrontendId
            titleSlug
          }
        }
      }
    `;

    const variables = { limit: batchSize, skip };

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    const questions = data?.data?.problemsetQuestionListV2?.questions || [];

    if (questions.length === 0) {
      hasMore = false;
    } else {
      allProblems.push(...questions);
      skip += batchSize;
    }

    // Safety stop
    if (allProblems.length >= 3535) {
      hasMore = false;
    }
  }

  return allProblems.filter((q) => {
    const id = Number(q.questionFrontendId);
    return id >= 2501 && id <= 3535;
  });
};

// Step 2: Get full problem details
const getProblemDetails = async (titleSlug) => {
  const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionFrontendId
        title
        titleSlug
        content
        difficulty
        topicTags {
          name
          slug
        }
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { titleSlug } }),
  });

  const data = await response.json();
  const q = data?.data?.question;

  if (!q) {
    throw new Error(`Failed to fetch details for ${titleSlug}`);
  }

  const description = striptags(q.content).replace(/\s+/g, ' ').trim();

  return {
    number: Number(q.questionFrontendId),
    title: q.title,
    titleSlug: q.titleSlug,
    difficulty: q.difficulty,
    tags: q.topicTags.map((tag) => tag.name),
    description,
  };
};

// Step 3: Orchestrate everything and save to JSON
(async () => {
  console.log(" Fetching title slugs...");
  const problems = await getAllTitleSlugs();
  console.log(` Fetched ${problems.length} problems between 2501 and 3535`);

  const limit = pLimit(CONCURRENCY_LIMIT);

  const detailedProblems = await Promise.all(
    problems.map((problem) =>
      limit(async () => {
        try {
          const detail = await getProblemDetails(problem.titleSlug);
          return detail.description ? detail : null;
        } catch (err) {
          console.error(` Error for ${problem.titleSlug}: ${err.message}`);
          return null;
        }
      })
    )
  );

  const cleanList = detailedProblems.filter(Boolean);
  const skippedCount = detailedProblems.length - cleanList.length;

  console.log(` Skipped ${skippedCount} problems with empty descriptions`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanList, null, 2), "utf-8");
  console.log(` Save ${cleanList.length} problems to ${OUTPUT_FILE}`);
})();
