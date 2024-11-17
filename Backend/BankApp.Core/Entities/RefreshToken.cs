using Microsoft.AspNetCore.Identity;

namespace BankApp.Core.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; }
        public DateTime? Revoked { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;

        public string UserId { get; set; } = string.Empty;
        public IdentityUser User { get; set; } = default!;
    }
}
