-- CreateTable
CREATE TABLE "Stocks" (
    "id" SERIAL NOT NULL,
    "instrumentKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,

    CONSTRAINT "Stocks_pkey" PRIMARY KEY ("id")
);
