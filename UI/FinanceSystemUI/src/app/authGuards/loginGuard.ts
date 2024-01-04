import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/AuthService/auth.service";

export function authenticatedGuard(): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        let canActivate = authService.isUserLoggedIn();

        if (!canActivate)
        {
            router.navigate(['authentication']);
        }
        
        return canActivate;
    }
}

export function notAuthenticatedGuard(): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        let canActivate = !authService.isUserLoggedIn();

        if (!canActivate)
        {
            router.navigate(['dashboard']);
        }
        
        return canActivate;
    }
}