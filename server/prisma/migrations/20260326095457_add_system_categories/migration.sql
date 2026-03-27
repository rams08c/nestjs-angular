-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_ownerUserId_fkey";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
