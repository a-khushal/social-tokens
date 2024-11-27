"use server"

import db from "@/app/db"

export async function fetchAllContent() {
    try {
        const res = await db.uploadedMetadata.findMany()
        return res
    } catch(e) {
        console.log(e)
    }
}