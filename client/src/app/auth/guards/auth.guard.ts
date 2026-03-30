import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataFlowService } from '../../shared-services/data-flow.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const dataFlowService = inject(DataFlowService);
  const router = inject(Router);

  if (dataFlowService.isAuthenticated()) {
    return true;
  }

  // Not authenticated, redirect to login
  router.navigate(['/login']);
  return false;
};
