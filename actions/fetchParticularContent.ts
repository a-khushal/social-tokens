"use server"

import db from "@/app/db"

export async function fetchParticularContent({ creatorPublicKey }: {
    creatorPublicKey: string,
}) {
    try {
        const res = await db.uploadedMetadata.findMany({
            where: {
                creatorPublicKey
            }
        })

        return res
    } catch(e) {
        console.log(e)
    }
}