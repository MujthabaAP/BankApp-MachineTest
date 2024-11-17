using BankApp.Core.Entities;
using System.ComponentModel.DataAnnotations;

namespace BankApp.Core.DTO
{
    public class CustomerRequestDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        public long CustomerNumber { get; set; }
        [Required]
        public string CustomerName { get; set; } = string.Empty;
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string Gender { get; set; } = string.Empty;
    }

    public class CustomerResponseDTO
    {
        public Guid Id { get; set; }
        public long CustomerNumber { get; set; }
        public string? CustomerName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Gender { get; set; }
    }

    public static class CustomerExtension
    {
        public static Customer ToCustomerEntity(this CustomerRequestDTO request)
        {
            return new Customer()
            {
                CustomerNumber = request.CustomerNumber,
                CustomerName = request.CustomerName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender
            };
        }

        public static CustomerResponseDTO ToCustomerResponse(this Customer request)
        {
            return new CustomerResponseDTO()
            {
                Id = request.Id,
                CustomerNumber = request.CustomerNumber,
                CustomerName = request.CustomerName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender
            };
        }
    }
}
