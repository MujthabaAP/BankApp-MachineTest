using BankApp.Core.DTO;

namespace BankApp.Core.ServiceContract
{
    public interface ICustomerService
    {
        Task<List<CustomerResponseDTO>?> GetAllCustomer(string? name);
        Task<CustomerResponseDTO?> GetCustomerById(Guid Id);
        Task<CustomerResponseDTO?> AddCustomer(CustomerRequestDTO request);
        Task<CustomerResponseDTO?> UpdateCustomer(Guid Id, CustomerRequestDTO request);
        Task<bool> IsCustomerNoExists(long customerNo);
        Task<int> GetCustomersCount();
    }
}
