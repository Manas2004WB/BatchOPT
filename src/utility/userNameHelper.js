import { getUserNameById } from "../services/userService";

/**
 * Given an array of objects containing userId fields,
 * returns a map of { userId: username }
 */
export const fetchUsernames = async (userIds) => {
  const uniqueIds = [...new Set(userIds.filter(Boolean))]; // remove nulls/dupes
  const userMap = {};

  await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const name = await getUserNameById(id);
        userMap[id] = name;
      } catch (err) {
        console.error(`Failed to fetch username for id ${id}:`, err);
        userMap[id] = "Unknown"; // fallback
      }
    })
  );

  return userMap;
};
