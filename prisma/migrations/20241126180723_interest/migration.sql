-- CreateTable
CREATE TABLE "Interest" (
    "id" SERIAL NOT NULL,
    "mintAddress" TEXT NOT NULL,
    "creatorATA" TEXT NOT NULL,
    "userATA" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);
