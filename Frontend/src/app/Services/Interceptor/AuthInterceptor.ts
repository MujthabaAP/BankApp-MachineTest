import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../Auth/AuthService';
import { AppConfigService } from '../app-config.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private appConfig: AppConfigService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token: string | null = null;
        let refreshToken: string | null = null;

        token = this.authService.getAccessToken();
        refreshToken = this.authService.getRefreshToken();

        // URLs to exclude
        const excludedUrls = this.appConfig.URLS_EXCLUDED;

        // Check if the request URL is in the excluded list
        const shouldExclude = excludedUrls.some(url => req.url.includes(url));

        // If the request should be excluded, pass it without modification
        if (shouldExclude) {
            return next.handle(req);
        }

        const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });

        return next.handle(clonedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Token might have expired, try to refresh it
                    return this.authService.refreshAccessToken().pipe(
                        switchMap((newToken: string) => {
                            // Clone the request with the new token
                            const newRequest = req.clone({
                                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
                            });
                            // Retry the request with the new token
                            return next.handle(newRequest);
                        }),
                        catchError(err => {
                            // Handle refresh token failure
                            console.error('Refresh token error', err);
                            return throwError(err);
                        })
                    );
                } else {
                    return throwError(error);
                }
            })
        );
    }
}
