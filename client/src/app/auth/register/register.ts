import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-base-200">
      <div class="card bg-base-100 shadow-xl w-full max-w-sm">
        <div class="card-body">
          <h2 class="card-title text-2xl font-bold justify-center mb-4">Register</h2>
          <p class="text-center text-base-content/60">Registration form coming soon.</p>
          <div class="mt-4 text-center text-sm">
            Already have an account? <a routerLink="/login" class="link link-primary">Login</a>
          </div>
          <a routerLink="/" class="btn btn-ghost btn-sm mt-2">&#8592; Back to Home</a>
        </div>
      </div>
    </div>
  `,
})
export class Register {}
