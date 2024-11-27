"use server"

import db from "@/app/db"

interface deleteProps {
    mintAddress: string,
    creatorATA: string,
    buyerAccounts: string[]
}

export const deleteFromInterest = async (payload: deleteProps) => {
    try {
        for(let i = 0; i < payload.buyerAccounts.length; i ++) {
            await db.interest.deleteMany({
                where: {
                    mintAddress: payload.mintAddress,
                    creatorATA: payload.creatorATA,
                    userATA: payload.buyerAccounts[i]
                }
            })
        }

        console.log("deleted interest from db")
    } catch (e) {
        console.log(e)
    }
}