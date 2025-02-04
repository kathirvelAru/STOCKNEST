-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "exchange" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
