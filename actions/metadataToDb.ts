"use server"

import db from "@/app/db"

interface Metadata {
    tokenName: string,
    tokenSymbol: string,
    description: string,
    mintAddress: string,
    ataForMint: string,
    ipfsHash: string,
    requiredTokens: number
}

export async function UploadMetadataToDB({ creatorPublicKey, metadata }: {
    creatorPublicKey: string,
    metadata: Metadata
}) {
    try {
        console.log(metadata)
        await db.uploadedMetadata.create({
            data: {
                creatorPublicKey,
                tokenName: metadata.tokenName,
                tokenSymbol: metadata.tokenSymbol,
                description: metadata.description,
                mintAddress: metadata.mintAddress,
                ataForMint: metadata.ataForMint,
                ipfsHash: metadata.ipfsHash,
                requiredTokens: metadata.requiredTokens
            }
        })

        console.log('uploaded to db')
    } catch(e) {
        console.log(e)
    }
}