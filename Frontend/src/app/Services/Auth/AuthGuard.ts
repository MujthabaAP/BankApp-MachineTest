import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './AuthService';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        const isLoggedIn = this.authService.isAuthenticated();
        if (!isLoggedIn) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
