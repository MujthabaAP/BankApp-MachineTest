using BankApp.Core.ServiceContract;
using BankApp.InfraStructure.AppDbContext;
using BankApp.InfraStructure.ServiceRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure database context
builder.Services.AddDbContext<BankAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<BankAppDbContext>()
    .AddDefaultTokenProviders();

// Configure authentication and authorization
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var secret = builder.Configuration["JWT:Secret"];
    if (string.IsNullOrEmpty(secret))
        throw new InvalidOperationException("JWT Secret is not configured in the appsettings.");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
    };
});

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        var allowedOrigin = builder.Configuration["AllowedOrigin"];
        if (string.IsNullOrEmpty(allowedOrigin))
            throw new InvalidOperationException("Allowed Origin is not configured in the appsettings.");

        policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
