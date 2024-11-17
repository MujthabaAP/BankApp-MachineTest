import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import AppConfig from '../app-config.json';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    URLS_EXCLUDED: string[] = [];
    REFRESH_TOKEN_KEY = "";
    USER_ROLE_KEY = "";
    ACCESS_TOKEN_KEY = "";
    USERNAME_KEY = "";

    constructor(private http: HttpClient) {
        this.URLS_EXCLUDED = AppConfig.excludedUrls.map(urls => environment.apiUrl + urls);
        this.USER_ROLE_KEY = AppConfig.userRolesKey;
        this.ACCESS_TOKEN_KEY = AppConfig.accessTokenKey;
        this.REFRESH_TOKEN_KEY = AppConfig.refreshTokenKey;
        this.USERNAME_KEY = AppConfig.userNameKey;
    }
}
