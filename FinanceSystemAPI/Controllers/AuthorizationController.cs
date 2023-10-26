using System.Web.Helpers;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using FinanceSystemAPI.Models;
using FinanceSystemAPI.DAL;
using FinanceSystemAPI.Config;
using FinanceSystemAPI.Helpers;
using System.Text;

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
            (string hashedPassword, string salt) = new PasswordHasher().HashPassword(credentials.Password);
            var pwd = new PasswordHasher().HashPassword(credentials.Password, salt);
            var result = new DataAccessLayer().RegisterUser(credentials.Email, hashedPassword, salt);

            if (result.IsSuccessful)
            {
                return Ok("U¿ytkownik zarejestrowany poprawnie.");
            }

            return BadRequest($"B³¹d podczas rejestracji u¿ytkownika: {result.ErrorMessage}.");
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult LoginUser(Credentials credentials)
        {
            var result = new DataAccessLayer().GetUserDetails(credentials.Email);

            if (!result.IsSuccessful || result.ReturnedData.Rows.Count == 0)
            {
                return BadRequest("B³êdne dane logowania");
            }

            var salt = result.ReturnedData.Rows[0]["Salt"];

            if (salt is null)
            {
                throw new Exception("no salt recorded");
            }

            var hash = new PasswordHasher().HashPassword(credentials.Password, salt.ToString());

            if (hash != result.ReturnedData.Rows[0]["Hash"].ToString())
            {
                return BadRequest("B³êdne dane logowania");
            }

            return Ok($"U¿ytkownik zalogowany z uprawnieniami {result.ReturnedData.Rows[0]["Role_Id"]}");
        }
    }
}