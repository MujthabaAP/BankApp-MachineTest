import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../../Models/Customer';
import { CustomerServiceEndpoint } from './CustomerServiceEndpoint';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    constructor(private http: HttpClient, private endPoint: CustomerServiceEndpoint) { }

    // Get all customers
    getAllCustomers(): Observable<Customer[]> {
        return this.http.get<Customer[]>(this.endPoint.GetAllURL);
    }

    // Add a new customer
    addCustomer(customer: Customer): Observable<Customer> {
        const body = {
            customerNumber: customer.customerNumber,
            customerName: customer.customerName,
            dateOfBirth: customer.dateOfBirth,
            gender: customer.gender
        }
        return this.http.post<Customer>(this.endPoint.AddURL, body, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        });
    }

    editCustomer(customer: Customer): Observable<Customer> {
        const url = `${this.endPoint.EditURL}/${customer.id}`;
        return this.http.patch<Customer>(url, customer, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        });
    }
}
