import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { BudgetsModule } from './budgets/budgets.module';
import { GoalsModule } from './goals/goals.module';
import { AccountsModule } from './accounts/accounts.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [PrismaModule, AuthModule, TransactionsModule, CategoriesModule, BudgetsModule, GoalsModule, AccountsModule, SettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
