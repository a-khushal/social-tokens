"use server"

import axios from "axios";

const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export const fetchFromPinata = async (ipfsHash: string) => {
    const url = `${PINATA_GATEWAY}${ipfsHash}`;

    try {
        const response = await axios.get(url, {
            responseType: "blob", 
        });
        
        return response.data;
    } catch (error) {
        console.error(error)
    }
};
