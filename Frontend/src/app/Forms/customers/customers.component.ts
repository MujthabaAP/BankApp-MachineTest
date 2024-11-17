import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/AuthService';
import { CustomerService } from '../../Services/Customer/CustomerService';
import { Customer } from '../../Models/Customer';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent {
  userName: string = '';
  customers: Customer[] = []
  newCustomer: Customer = new Customer()
  searchCustomer: Customer = new Customer()
  hasError: boolean = false;
  errorMessage: string = "";
  modalHeading: string = "";
  userRole: string | null = "";
  @ViewChild('customerForm') customerForm!: NgForm;
  isLoading: boolean = false;
  isVisibleCustomerFeature: boolean = false;
  rolesHasPrivelege: string[] = ["RELATIONSHIP_MANAGER"];

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
    if (this.userRole && this.rolesHasPrivelege.includes(this.userRole)) {
      this.getCustomerList();
      this.isVisibleCustomerFeature = true;
    }
  }

  getCustomerList() {
    this.customerService.getAllCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
      },
      error: (error) => {
        this.errorMessage = error.error ?? 'Something went wrong. Please try again.';
        this.toastr.error(this.errorMessage, 'Error');
      },
      complete: () => console.info('complete')
    })
  }

  addNewCustomerInit() {
    this.untouchForm(this.customerForm);
    this.hasError = false;
    this.newCustomer = new Customer();
    this.newCustomer.operation = "ADD";
    this.modalHeading = "Add New Customer";
    this.openModal();
  }

  viewCustomer(customer: any) {
    this.hasError = false;
    this.newCustomer = new Customer();
    this.newCustomer = { ...customer };
    this.newCustomer.dateOfBirth = this.datePipe.transform(customer.dateOfBirth, 'yyyy-MM-dd') || ""
    this.newCustomer.operation = "VIEW";
    this.modalHeading = "Customer Details";
    this.openModal()
  }

  editCustomerInit(customer: Customer) {
    this.hasError = false;
    this.newCustomer = new Customer();
    this.newCustomer = { ...customer };
    this.newCustomer.dateOfBirth = this.datePipe.transform(customer.dateOfBirth, 'yyyy-MM-dd') || ""
    this.newCustomer.operation = "EDIT";
    this.modalHeading = "Edit Customer";
    this.openModal()
  }

  openModal() {
    const modalElement = document.getElementById('addCustomerModal');
    const modal = new bootstrap.Modal(modalElement!, {
      backdrop: 'static',
      keyboard: false
    });
    modal.show();
  }

  async onSubmit(customerForm: any) {
    try {
      // this.isLoading = true;
      this.hasError = false;
      if (customerForm.valid) {
        if (this.newCustomer.operation == "ADD") {
          await this.addNewCustomer()
        } else if (this.newCustomer.operation == "EDIT") {
          await this.editCustomer();
        }
        // this.isLoading = false;
      } else {
        // this.isLoading = false;
        this.hasError = true;
        this.errorMessage = "Please enter valid data.";
      }
    } catch (error) {
      // this.isLoading = false;
      console.error('Error Body:', error);
      this.toastr.error("Operation failed", 'Error');
    }
  }

  async editCustomer() {
    this.isLoading = true;
    this.customerService.editCustomer(this.newCustomer).subscribe({
      next: (data) => {
        this.getCustomerList();
        this.untouchForm(this.customerForm);
        this.closeModal();
        this.toastr.success('The customer details updated successfully!', 'Success');
        this.newCustomer = new Customer();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error ?? 'Something went wrong. Please try again.';
        this.toastr.error(this.errorMessage, 'Error');
        this.isLoading = false;
      },
      complete: () => console.info('complete')
    })
  }

  async addNewCustomer() {
    this.isLoading = true;
    this.customerService.addCustomer(this.newCustomer).subscribe({
      next: (data) => {
        this.getCustomerList();
        this.untouchForm(this.customerForm);
        this.closeModal()
        this.toastr.success('New customer has been added successfully!', 'Success');
        this.newCustomer = new Customer();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message ?? 'Something went wrong. Please try again.';
        this.toastr.error(this.errorMessage, 'Error');
        this.isLoading = false;
      },
      complete: () => console.info('complete')
    })
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCustomerModal'));
    modal.hide();
  }

  untouchForm(form: NgForm) {
    form.form.markAsUntouched();
  }

  onSubmitSearch(customerForm: any) {

  }

  openSearchModal() {
    const modalElement = document.getElementById('searchCustomerModal');
    const modal = new bootstrap.Modal(modalElement!, {
      backdrop: 'static',
      keyboard: false
    });
    modal.show();
  }
}
