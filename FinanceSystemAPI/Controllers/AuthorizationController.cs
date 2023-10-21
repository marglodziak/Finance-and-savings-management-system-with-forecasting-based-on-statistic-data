using System.Web.Helpers;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using FinanceSystemAPI.Models;
using FinanceSystemAPI.DAL;
using FinanceSystemAPI.Config;

namespace FinanceSystemAPI.Controllers
{
    [ApiController]
    [EnableCors("AllowCorsPolicy")]
    [Route("[controller]")]
    public class AuthorizationController : ControllerBase
    {       
        [HttpPost]
        [Route("Register")]
        public IActionResult RegisterUser(Credentials credentials)
        {
            var hashedPassword = Crypto.HashPassword(credentials.Password);

            var result = new DataAccessLayer().RegisterUser(credentials.Email, hashedPassword);

            if (result.IsSuccessful)
            {
                return Ok("U¿ytkownik zarejestrowany poprawnie.");
            }

            return BadRequest($"B³¹d podczas rejestracji u¿ytkownika: {result.ErrorMessage}.");
        }
    }
}