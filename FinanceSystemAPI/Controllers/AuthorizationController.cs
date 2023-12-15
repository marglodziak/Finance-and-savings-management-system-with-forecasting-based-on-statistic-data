using System.Text;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JWT.Builder;
using JWT.Algorithms;
using FinanceSystemAPI.Models;
using FinanceSystemAPI.DAL;
using FinanceSystemAPI.Helpers;
using AppConfig;

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

            var token = GenerateJwtToken(credentials.Email, (int)result.ReturnedData.Rows[0]["Role_Id"]);
            return Ok(new { Token = token });
        }

        [HttpGet]
        [Route("test")]
        public IActionResult Test()
        {
            var user = HttpContext.User;
            
            if (user.HasClaim(c => c.Type == Config.UsernameClaim))
            {
                string username = user.FindFirst(c => c.Type == Config.UsernameClaim).Value;
            }
            if (user.HasClaim(c => c.Type == Config.RoleClaim))
            {
                int role = Convert.ToInt32(user.FindFirst(c => c.Type == Config.RoleClaim).Value);
            }
            return Ok("123");
        }
        
        private string GenerateJwtToken(string email, int role)
        {
            return new JwtBuilder()
                .WithAlgorithm(new HMACSHA256Algorithm())
                .WithSecret(Encoding.ASCII.GetBytes(Config.FinanceSystemSigningKey))
                .Issuer(Config.FinanceSystemIssuer)
                .AddClaim(Config.ExpirationClaim, DateTimeOffset.UtcNow.AddMinutes(Config.ExpirationTime).ToUnixTimeSeconds())
                .AddClaim(Config.UsernameClaim, email)
                .AddClaim(Config.RoleClaim, role)
                .Encode();
        }
    }
}