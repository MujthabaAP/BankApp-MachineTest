using System.ComponentModel.DataAnnotations;

namespace BankApp.Core.DTO
{
    public class RegisterModel
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = string.Empty;
    }

    public class LoginModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class TokenRequestModel
    {
        public required string RefreshToken { get; set; }
    }

    public class AuthResponse
    {
        public string? Message { get; set; }
        public string? Username { get; set; }
        public IList<string>? Role { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }

    }
}
