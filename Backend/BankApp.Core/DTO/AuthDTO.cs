namespace BankApp.Core.DTO
{
    public class RegisterModel
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }
    }

    public class LoginModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
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
