import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/AuthService';
import { CustomerService } from '../../Services/Customer/CustomerService';
import { Customer } from '../../Models/Customer';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CustomersComponent } from '../customers/customers.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  pageName: string = "Dashboard";
  @ViewChild('customerComp') customerComp!: CustomersComponent;
  userName: string = '';
  userRole: string | null = "";
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    let userName = this.authService.getUserName();
    this.userName = userName ?? "";
    this.userRole = this.authService.getUserRole();
  }

  showDashboard() {
    this.pageName = "Dashboard";
  }

  showCustomer() {
    this.pageName = "Customers";
  }

  addNewCustomer() {
    this.customerComp.addNewCustomerInit();
  }

  searchCustomer() {
    this.customerComp.openSearchModal();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
