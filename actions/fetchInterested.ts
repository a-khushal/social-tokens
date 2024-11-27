"use server"

import db from "@/app/db"

export default async function fetchInterested() {
  try {
    const interests = await db.interest.groupBy({
      by: ['mintAddress', 'creatorATA'],
      _count: true,
    });

    const groupedData = await Promise.all(
      interests.map(async (group) => {
        const users = await db.interest.findMany({
          where: {
            mintAddress: group.mintAddress,
            creatorATA: group.creatorATA,
          },
          select: {
            userATA: true,
          },
        });

        return {
          mintAddress: group.mintAddress,
          creatorATA: group.creatorATA,
          userATAs: users.map((u) => u.userATA),
        };
      })
    )

    return {
      groupedData
    }
  } catch (error) {
    console.error("Error fetching interests:", error);
    return {
        error: "an error occured"
    }
  }
}
