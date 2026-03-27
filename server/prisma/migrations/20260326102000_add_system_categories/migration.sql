-- AlterTable
ALTER TABLE "categories"
  ADD COLUMN "isSystem" BOOLEAN NOT NULL DEFAULT false,
  ALTER COLUMN "ownerUserId" DROP NOT NULL;

-- AddIndex
CREATE INDEX "categories_isSystem_idx" ON "categories"("isSystem");

-- Seed predefined system expense categories
INSERT INTO "categories" ("id", "ownerUserId", "name", "type", "isSystem", "createdAt", "updatedAt") VALUES
  ('sys_expense_food', NULL, 'Food', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_groceries', NULL, 'Groceries', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_rent', NULL, 'Rent', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_utilities', NULL, 'Utilities', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_transportation', NULL, 'Transportation', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_fuel', NULL, 'Fuel', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_healthcare', NULL, 'Healthcare', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_insurance', NULL, 'Insurance', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_education', NULL, 'Education', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_entertainment', NULL, 'Entertainment', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_dining_out', NULL, 'Dining Out', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_shopping', NULL, 'Shopping', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_personal_care', NULL, 'Personal Care', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_travel', NULL, 'Travel', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sys_expense_subscriptions', NULL, 'Subscriptions', 'EXPENSE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
