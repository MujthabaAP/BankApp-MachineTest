import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthServiceEndpoint {
    public LoginURL: string = "";
    public RegisterURL: string = "";
    public GenerateTokenByRefreshTokenURL: string = "";
   
    constructor() {
        let apiHostingURL = environment.apiUrl + "/api/Auth/";
        this.LoginURL = apiHostingURL + "login";
        this.RegisterURL = apiHostingURL + "register";
        this.GenerateTokenByRefreshTokenURL = apiHostingURL + "refresh";
    }
}

