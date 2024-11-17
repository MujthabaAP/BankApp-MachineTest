using System.ComponentModel.DataAnnotations;

namespace BankApp.Core.Entities
{
    public class Customer
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public long CustomerNumber { get; set; }

        [MaxLength(255)]
        public string CustomerName { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        [MaxLength(1)]
        public string Gender { get; set; } = string.Empty;
    }
}
