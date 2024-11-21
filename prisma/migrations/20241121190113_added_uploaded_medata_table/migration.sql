-- CreateTable
CREATE TABLE "UploadedMetadata" (
    "id" SERIAL NOT NULL,
    "creatorPublicKey" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "mintAddress" TEXT NOT NULL,
    "ataForMint" TEXT NOT NULL,
    "ipfsHash" TEXT NOT NULL,

    CONSTRAINT "UploadedMetadata_pkey" PRIMARY KEY ("id")
);
