"use server"

import db from "@/app/db"

export default async function showInterestToDB({ mint, creatorATA, userATA }: {
    mint: string,
    creatorATA: string,
    userATA: string
}) {
    try {
        const existingInterest = await db.interest.findFirst({
            where: {
                mintAddress: mint,
                creatorATA,
                userATA
            }
        });

        if (!existingInterest) {
            await db.interest.create({
                data: {
                    mintAddress: mint,
                    creatorATA,
                    userATA
                }
            });
        }
    } catch (error) {
        console.error('Error interacting with the database:', error);
        throw new Error('Failed to show interest.');
    }
}