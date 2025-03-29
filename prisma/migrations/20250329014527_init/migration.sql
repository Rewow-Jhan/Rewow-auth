-- CreateEnum
CREATE TYPE "petType" AS ENUM ('DOG', 'CAT', 'FISH', 'OTHER');

-- CreateEnum
CREATE TYPE "petSize" AS ENUM ('SMALL', 'MEDIUM', 'BIG');

-- CreateTable
CREATE TABLE "Pet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "petType" NOT NULL,
    "size" "petSize" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);
