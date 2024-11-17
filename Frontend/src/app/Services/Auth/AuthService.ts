import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthServiceEndpoint } from './AuthServiceEndpoint';
import { UserLogin } from '../../Models/UserLogin';
import { AuthResponse } from '../../Models/AuthResponse';
import { UserRegister } from '../../Models/UserRegister';
import { AppConfigService } from '../app-config.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private endPoint: AuthServiceEndpoint,
        private configService: AppConfigService
    ) { }

    // Register User (Signup)
    signup(registerData: UserRegister): Observable<any> {
        const body = registerData;
        return this.http.post<any>(this.endPoint.RegisterURL, body).pipe(
            map((response: AuthResponse) => {
                if (response) {
                    this.storeInLocalStorage(response);
                }
                return response;
            }),
            catchError((error) => {
                let errorMessage = error.error?.message ?? "User registration failed!"; 
                throw new Error(errorMessage);
            })
        );
    }

    // Login User (with email and password)
    login(loginData: UserLogin): Observable<any> {
        const body = loginData;
        return this.http.post<any>(this.endPoint.LoginURL, body).pipe(
            map((response: AuthResponse) => {
                if (response) {
                    this.storeInLocalStorage(response);
                }
                return response;
            }),
            catchError((error) => {
                let errorMessage = error.error?.message ?? "Login failed!";
                throw new Error(errorMessage);
            })
        );
    }

    // Generate Access Token using Refresh Token
    refreshAccessToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const body = { refreshToken };
        return this.http.post<any>(this.endPoint.GenerateTokenByRefreshTokenURL, body).pipe(
            map((response: AuthResponse) => {
                if (response) {
                    this.storeInLocalStorage(response);
                }
                return response;
            }),
            catchError((error) => {
                throw new Error('Token refresh failed');
            })
        );
    }

    private storeInLocalStorage(response: AuthResponse): void {
        localStorage.setItem(this.configService.ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.configService.REFRESH_TOKEN_KEY, response.refreshToken);
        localStorage.setItem(this.configService.USERNAME_KEY, response.username);
        localStorage.setItem(this.configService.USER_ROLE_KEY, response.role.toString());
    }

    // Get Access Token
    getAccessToken(): string | null {
        return localStorage.getItem(this.configService.ACCESS_TOKEN_KEY);
    }

    // Get Refresh Token
    getRefreshToken(): string | null {
        return localStorage.getItem(this.configService.REFRESH_TOKEN_KEY);
    }

    getUserName(): string | null {
        return localStorage.getItem(this.configService.USERNAME_KEY);
    }

    getUserRole(): string | null {
        return localStorage.getItem(this.configService.USER_ROLE_KEY);
    }

    // Check if User is Authenticated (has valid access token)
    isAuthenticated(): boolean {
        const accessToken = this.getAccessToken();
        return accessToken ? true : false;
    }

    // Logout User (clear tokens from storage)
    logout(): void {
        localStorage.removeItem(this.configService.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.configService.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.configService.USERNAME_KEY);
        localStorage.removeItem(this.configService.USER_ROLE_KEY);
    }
}
