-- AlterTable
ALTER TABLE "registrations" ADD COLUMN     "onChainTxSignature" TEXT,
ADD COLUMN     "verifiedOnChain" BOOLEAN NOT NULL DEFAULT false;
