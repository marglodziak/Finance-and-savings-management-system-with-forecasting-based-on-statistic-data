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
using Azure.Core;
using System.IdentityModel.Tokens.Jwt;

namespace FinanceSystemAPI.Controllers
{
    [ApiController]
    [EnableCors("AllowCorsPolicy")]
    [Route("[controller]")]
    public class AuthorizationController : BaseController
    {       
        [HttpPost]
        [Route("Register")]
        public IActionResult RegisterUser(Credentials credentials)
        {
            var dal = new DataAccessLayer();
            var user = dal.GetUserDetails(credentials.Email);

            if (user is not null)
            {
                return BadRequest($"podany adres e-mail jest ju¿ zajêty");
            }

            (string hashedPassword, string salt) = new PasswordHasher().HashPassword(credentials.Password);
            var pwd = new PasswordHasher().HashPassword(credentials.Password, salt);
            var result = new DataAccessLayer().RegisterUser(credentials.Email, hashedPassword, salt);

            if (result.IsSuccessful)
            {
                return Ok();
            }

            return BadRequest($"{result.ErrorMessage}");
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult LoginUser(Credentials credentials)
        {
            var dal = new DataAccessLayer();
            var user = dal.GetUserDetails(credentials.Email);

            if (user is null)
            {
                return BadRequest("Podano b³êdne dane logowania. Spróbuj ponownie.");
            }

            var hash = new PasswordHasher().HashPassword(credentials.Password, user.Salt);

            if (hash != user.Hash)
            {
                return BadRequest("Podano b³êdne dane logowania. Spróbuj ponownie.");
            }

            return Ok(ProcessTokens(credentials.Email, user.Role_Id, user.Id, dal));            
        }

        [HttpPost]
        [Route("AccessToken")]
        public IActionResult GetNewAccessToken([FromBody] string refreshToken)
        {
            var dal = new DataAccessLayer();            
            var userEmail = GetUserEmail(refreshToken);
            var user = dal.GetUserDetails(userEmail);

            var token = dal.GetRefreshToken(user.Id);

            if (refreshToken != token)
            {
                return BadRequest("Invalid refresh token");
            }

            return Ok(ProcessTokens(userEmail, user.Role_Id, user.Id, dal));
        }

        private object ProcessTokens(string email, int roleId, int userId, DataAccessLayer dal)
        {
            var accessToken = GenerateAccessToken(email, roleId);

            var validToTime = DateTimeOffset.Now.AddMinutes(Config.RefreshTokenExpirationTime);
            var refreshToken = GenerateRefreshToken(email, roleId, validToTime);

            dal.SaveRefreshToken(userId, refreshToken, validToTime);
            dal.DeleteInvalidRefreshTokens();

            return new { AccessToken = accessToken, RefreshToken = refreshToken };
        }
        
        private string GenerateAccessToken(string email, int role)
        {
            return new JwtBuilder()
                .WithAlgorithm(new HMACSHA256Algorithm())
                .WithSecret(Encoding.ASCII.GetBytes(Config.FinanceSystemSigningKey))
                .Issuer(Config.FinanceSystemIssuer)
                .AddClaim(Config.ExpirationClaim, DateTimeOffset.UtcNow.AddMinutes(Config.AccessTokenExpirationTime).ToUnixTimeSeconds())
                .AddClaim(Config.UsernameClaim, email)
                .AddClaim(Config.RoleClaim, role)
                .Encode();
        }

        private string GenerateRefreshToken(string email, int role, DateTimeOffset validToTime)
        {
            return new JwtBuilder()
                .WithAlgorithm(new HMACSHA256Algorithm())
                .WithSecret(Encoding.ASCII.GetBytes(Config.FinanceSystemSigningKey))
                .Issuer(Config.FinanceSystemIssuer)
                .AddClaim(Config.ExpirationClaim, validToTime.ToUnixTimeSeconds())
                .AddClaim(Config.UsernameClaim, email)
                .AddClaim(Config.RoleClaim, role)
                .Encode();
        }
    }
}