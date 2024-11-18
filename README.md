# BankApp

Please find the backend code in the `Backend` folder. It is developed in `.NET 8` with clean architecture.

You can find the frontend code in the `Frontend` folder, which is developed in `Angular 18`.

Also, please find the diagram `App communication diagram.pdf`.

# BankApp Configuration Guide

## How to Configure Backend (API)

1. Ensure that **.NET 8** is installed on your system.
2. Update the database connection string `ConnectionStrings.DefaultConnection` in the file:  
   `Backend\BankApp.API\appsettings.json`.
3. Run the database migration:  
   - Open the **Package Manager Console** and set the default project to `BankApp.Infrastructure`.
   - Execute the command:  
     ```bash
     update-database
     ```
4. Update the `AllowedOrigin` value in the API if the UI URL is not `http://localhost:4200`.
5. For `http` API URL:  
   Update the `apiUrl` in the Angular project file:  
   `Frontend\src\environments\environment.ts`.  
   For `https`, no changes are required since the default URL is already set.

---

## How to Configure Frontend

1. Ensure you have **Angular framework version 18** installed.
2. Run the following command to install all node module dependencies:  
   ```bash
   npm install
   ```
3. To change the API URL, update it in the file: `Frontend\src\environments\environment.ts.`

---

## Other Important Notes

1. If a user does not have an account, they can click the link:
   `"Don't have an account? Register"`
   This will navigate them to the user registration page.

2. To go to the Sign In page from the User Registration page, the user can click the link:
   `"Already have an account? Login"`, located below the Register button.
3. Customer management is restricted to relationship managers only.

