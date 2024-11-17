using BankApp.Core.DTO;
using BankApp.Core.ServiceContract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace BankApp.API.Controllers
{
    [EnableCors("AllowSpecificOrigin")]
    [Authorize(Roles = "RELATIONSHIP_MANAGER")]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] CustomerRequestDTO model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { message = ModelState });

                if (await _customerService.IsCustomerNoExists(model.CustomerNumber))
                    return BadRequest(new { message = "The Customer Number already exists." });

                var customer = await _customerService.AddCustomer(model);
                if (customer != null)
                    return Ok(customer);
                else
                    return BadRequest(new { message = "Not saved" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] CustomerRequestDTO requestModel)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { message = ModelState });

                var customerData = await _customerService.GetCustomerById(id);
                if (customerData == null)
                    return BadRequest(new { message = "The customer does not exists" });

                if (customerData.CustomerNumber != requestModel.CustomerNumber && await _customerService.IsCustomerNoExists(requestModel.CustomerNumber))
                    return BadRequest(new { message = "The Customer Number already exists." });

                var customer = await _customerService.UpdateCustomer(id, requestModel);
                if (customer != null)
                    return Ok(customer);
                else
                    return BadRequest(new { message = "Not updated" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet("get-by-id/{id}")]
        public async Task<IActionResult> GetCustomerById(Guid id)
        {
            try
            {
                var customer = await _customerService.GetCustomerById(id);
                return Ok(customer);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var customer = await _customerService.GetAllCustomer();
                return Ok(customer);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}
