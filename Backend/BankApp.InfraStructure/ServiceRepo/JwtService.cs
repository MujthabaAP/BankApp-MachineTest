using BankApp.Core.Entities;
using BankApp.Core.ServiceContract;
using BankApp.InfraStructure.AppDbContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BankApp.InfraStructure.ServiceRepo
{
    public class JwtService : IJwtService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly BankAppDbContext _context;
        private readonly IConfiguration _configuration;

        public JwtService(
            UserManager<IdentityUser> userManager,
            BankAppDbContext context,
            IConfiguration configuration
            )
        {
            _userManager = userManager;
            _context = context;
            _configuration = configuration;
        }
        public async Task<string> GenerateJwtToken(IdentityUser user)
        {
            if (string.IsNullOrEmpty(user.UserName))
                throw new InvalidOperationException("User does not have a valid username.");

            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var secret = _configuration["Jwt:Secret"];
            if (string.IsNullOrEmpty(secret))
                throw new InvalidOperationException("JWT Secret is not configured in the appsettings.");

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

            double.TryParse(_configuration["Jwt:AccessTokenExpiryInMinutes"], out double expiryInMinutes);
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddMinutes(expiryInMinutes), // Set short expiration
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> GenerateRefreshToken(IdentityUser user)
        {
            double.TryParse(_configuration["Jwt:RefreshTokenExpiryInDays"], out double expiryInDays);
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                Expires = DateTime.UtcNow.AddDays(expiryInDays),
                Created = DateTime.UtcNow,
                UserId = user.Id
            };

            // Save the refresh token to the database
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return refreshToken.Token;
        }
    }
}
