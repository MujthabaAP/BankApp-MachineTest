using Microsoft.AspNetCore.Identity;

namespace BankApp.Core.ServiceContract
{
    public interface IJwtService
    {
        Task<string> GenerateRefreshToken(IdentityUser user);

        Task<string> GenerateJwtToken(IdentityUser user);
    }
}
