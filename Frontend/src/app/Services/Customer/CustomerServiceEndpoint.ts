import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomerServiceEndpoint {
    public AddURL: string = "";
    public EditURL: string = "";
    public GetAllURL: string = "";
    public GetOneURL: string = "";
    public GetCustomerCountURL: string = "";
   
    constructor() {
        let apiHostingURL = environment.apiUrl + "/api/customer/";
        this.AddURL = apiHostingURL + "add";
        this.GetAllURL = apiHostingURL + "get-all";
        this.GetOneURL = apiHostingURL + "get-by-id";
        this.EditURL = apiHostingURL + "update";
        this.GetCustomerCountURL = apiHostingURL + "get-customers-count";

    }
}

