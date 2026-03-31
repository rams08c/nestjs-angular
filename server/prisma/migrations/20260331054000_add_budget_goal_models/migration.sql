-- CreateTable
CREATE TABLE "budgets" (
  "id" TEXT NOT NULL,
  "ownerUserId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "limitAmount" DECIMAL(12,2) NOT NULL,
  "period" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
  "id" TEXT NOT NULL,
  "ownerUserId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "targetAmount" DECIMAL(12,2) NOT NULL,
  "savedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "targetDate" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "budgets_ownerUserId_categoryId_period_key"
ON "budgets"("ownerUserId", "categoryId", "period");

-- CreateIndex
CREATE INDEX "budgets_ownerUserId_idx" ON "budgets"("ownerUserId");

-- CreateIndex
CREATE INDEX "goals_ownerUserId_idx" ON "goals"("ownerUserId");

-- AddForeignKey
ALTER TABLE "budgets"
ADD CONSTRAINT "budgets_ownerUserId_fkey"
FOREIGN KEY ("ownerUserId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets"
ADD CONSTRAINT "budgets_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "categories"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals"
ADD CONSTRAINT "goals_ownerUserId_fkey"
FOREIGN KEY ("ownerUserId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;