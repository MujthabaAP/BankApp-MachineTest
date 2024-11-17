import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Forms/login/login.component';
import { RegisterComponent } from './Forms/register/register.component';
import { HomeComponent } from './Forms/home/home.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './Services/Interceptor/AuthInterceptor';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // Required for Toastr
    ToastrModule.forRoot({
      timeOut: 3000, // Toast duration in milliseconds
      positionClass: 'toast-top-right', // Toast position
      preventDuplicates: true, // Prevent duplicate messages
    }),
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
