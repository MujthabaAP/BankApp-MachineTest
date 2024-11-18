import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/AuthService';
import { CustomerService } from '../../Services/Customer/CustomerService';
import { Customer, CustomerCount } from '../../Models/Customer';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CustomersComponent } from '../customers/customers.component';

@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.css']
})

export class DashboardCardsComponent {
  dashBoardModel: CustomerCount = new CustomerCount();
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getDashBoardData();
  }

  getDashBoardData() {
    try {
      this.isLoading = true;
      this.customerService.getCustomerCount().subscribe({
        next: (data: CustomerCount) => {
          this.dashBoardModel = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error(error)
        },
        complete: () => console.info('complete')
      })
    } catch (error) {
      this.isLoading = false;
      console.error(error)
    }
  }
}
