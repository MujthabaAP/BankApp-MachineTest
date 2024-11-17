using BankApp.Core.DTO;
using BankApp.Core.ServiceContract;
using BankApp.InfraStructure.AppDbContext;
using Microsoft.EntityFrameworkCore;

namespace BankApp.InfraStructure.ServiceRepo
{
    public class CustomerService : ICustomerService
    {
        private readonly BankAppDbContext _db;
        public CustomerService(BankAppDbContext dbContext)
        {
            _db = dbContext;
        }
        public async Task<CustomerResponseDTO?> AddCustomer(CustomerRequestDTO request)
        {
            var customer = request.ToCustomerEntity();
            await _db.Customers.AddAsync(customer);
            await _db.SaveChangesAsync();

            return customer.ToCustomerResponse();
        }

        public async Task<List<CustomerResponseDTO>?> GetAllCustomer()
        {
            return await _db.Customers.Select(customer => customer.ToCustomerResponse()).ToListAsync();
        }

        public async Task<CustomerResponseDTO?> GetCustomerById(Guid Id)
        {
            var result = await _db.Customers.Where(customer => customer.Id == Id).FirstOrDefaultAsync();
            return result?.ToCustomerResponse();
        }

        public async Task<CustomerResponseDTO?> UpdateCustomer(Guid Id, CustomerRequestDTO request)
        {
            var customer = await _db.Customers.FindAsync(Id);
            if (customer != null)
            {
                customer.CustomerNumber = request.CustomerNumber;
                customer.CustomerName = request.CustomerName;
                customer.Gender = request.Gender;
                customer.DateOfBirth = request.DateOfBirth;

                await _db.SaveChangesAsync();
            }

            return customer?.ToCustomerResponse();
        }

        public async Task<bool> IsCustomerNoExists(int customerNo)
        {
            var result = await _db.Customers.Where(customer => customer.CustomerNumber == customerNo).FirstOrDefaultAsync();
            return result != null ? true : false;
        }
    }
}
