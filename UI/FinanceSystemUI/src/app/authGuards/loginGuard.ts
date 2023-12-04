import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export function authenticationGuard(): CanActivateFn {
    return () =>
    {
        const router: Router = inject(Router);
        router.navigate(["login"]);
        return false;
    };
  }