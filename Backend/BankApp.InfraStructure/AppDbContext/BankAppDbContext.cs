using BankApp.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BankApp.InfraStructure.AppDbContext
{
    public class BankAppDbContext : IdentityDbContext
    {
        public BankAppDbContext(DbContextOptions<BankAppDbContext> options) : base(options) { }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.CustomerNumber)
                .IsUnique();
        }
    }
}
