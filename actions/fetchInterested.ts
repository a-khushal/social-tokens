"use server"

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function fetchInterested() {
  try {
    const interests = await prisma.interest.groupBy({
      by: ['mintAddress', 'creatorATA'],
      _count: true,
    });

    const groupedData = await Promise.all(
      interests.map(async (group) => {
        const users = await prisma.interest.findMany({
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
    );

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
