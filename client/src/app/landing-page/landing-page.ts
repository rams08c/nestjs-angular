import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../shared/navbar/navbar';
import { Footer } from '../shared/footer/footer';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, Navbar, Footer],
  templateUrl: './landing-page.html',
})
export class LandingPage {
  readonly features = [
    {
      icon: '💸',
      title: 'Expense Tracking',
      description: 'Log every expense instantly and stay on top of your spending in real time.',
    },
    {
      icon: '🗂️',
      title: 'Categories',
      description: 'Organise transactions into smart categories for a clear financial picture.',
    },
    {
      icon: '📊',
      title: 'Reports',
      description: 'Generate visual spending reports by day, week, or month at a glance.',
    },
    {
      icon: '🤝',
      title: 'Group Splitting',
      description: 'Split bills with friends or flatmates fairly and settle up effortlessly.',
    },
  ];

  readonly summaryCards = [
    { label: 'Balance', value: '$4,280.00', color: 'text-success' },
    { label: 'Income', value: '$6,500.00', color: 'text-info' },
    { label: 'Expenses', value: '$2,220.00', color: 'text-error' },
    { label: 'Savings', value: '$1,800.00', color: 'text-warning' },
  ];
}
