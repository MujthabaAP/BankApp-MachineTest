using BankApp.Core.DTO;
using BankApp.Core.ServiceContract;
using BankApp.InfraStructure.AppDbContext;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankApp.API.Controllers
{
    [EnableCors("AllowSpecificOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly BankAppDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(
            RoleManager<IdentityRole> roleManager,
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IConfiguration configuration,
            BankAppDbContext dbContext,
            IJwtService jwtService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = dbContext;
            _jwtService = jwtService;
            _roleManager = roleManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                if (await _userManager.FindByEmailAsync(model.Email) != null)
                    return Unauthorized(new { message = "The given email is already in use." });

                var user = new IdentityUser { UserName = model.Username, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(new { message = result.Errors?.Select(err => err.Description).ToList() });

                // Add the user to a role
                if (!await _roleManager.RoleExistsAsync(model.Role))
                    await _roleManager.CreateAsync(new IdentityRole(model.Role));
                await _userManager.AddToRoleAsync(user, model.Role);

                var accessToken = await _jwtService.GenerateJwtToken(user);
                var refreshToken = await _jwtService.GenerateRefreshToken(user);
                var roles = await _userManager.GetRolesAsync(user);

                if (result.Succeeded)
                {
                    return Ok(new AuthResponse()
                    {
                        Message = "User registered successfully!",
                        Username = user.UserName,
                        Role = roles,
                        AccessToken = accessToken,
                        RefreshToken = refreshToken
                    });
                }

                return BadRequest(result.Errors);
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = exception.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return Unauthorized(new { message = "Invalid email or password." });

                if (user.UserName != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, false, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        var accessToken = await _jwtService.GenerateJwtToken(user);
                        var refreshToken = await _jwtService.GenerateRefreshToken(user);
                        var roles = await _userManager.GetRolesAsync(user);

                        return Ok(new AuthResponse()
                        {
                            Message = "Logged in successfully",
                            Username = user.UserName,
                            Role = roles,
                            AccessToken = accessToken,
                            RefreshToken = refreshToken
                        });
                    }
                }

                return Unauthorized(new { message = "Invalid email or password." });
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = exception.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestModel model)
        {
            try
            {
                var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == model.RefreshToken);

                if (refreshToken == null || !refreshToken.IsActive)
                    return BadRequest(new { message = "Invalid refresh token" });

                var user = await _userManager.FindByIdAsync(refreshToken.UserId);
                if (user == null)
                    return Unauthorized();

                if (string.IsNullOrEmpty(user.UserName))
                    return Unauthorized(new { message = "User does not have a valid username." });

                // Generate new JWT token
                var newJwtToken = await _jwtService.GenerateJwtToken(user);

                //invalidate the old refresh token and issue a new one
                refreshToken.Revoked = DateTime.UtcNow;
                var newRefreshToken = await _jwtService.GenerateRefreshToken(user);

                var roles = await _userManager.GetRolesAsync(user);

                return Ok(new AuthResponse()
                {
                    Message = "New access token has been generated.",
                    Username = user.UserName,
                    Role = roles,
                    AccessToken = newJwtToken,
                    RefreshToken = newRefreshToken
                });
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = exception.Message });
            }

        }
    }
}
