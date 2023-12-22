using AppConfig;
using DataAccessLayerGeneric;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;

namespace FinanceSystemAPI.Controllers
{
    public class BaseController : Controller
    {
        protected int GetUserId()
        {
            var userEmail = GetUserEmail();

            var result = DalGeneric.ExecuteProcedure("[dbo].[usp_UserID_Select]", new SqlParameter[]
            {
                new SqlParameter("@p_Email", userEmail)
            });

            return Convert.ToInt32(result.ReturnedData.Rows[0]["Id"]);
        }

        protected string GetUserEmail()
        {
            var user = HttpContext.User;

            return user.Claims.FirstOrDefault(c => c.Type == Config.UsernameClaim)?.Value ?? "";
        }

        protected string GetUserEmail(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var decodedToken = handler.ReadJwtToken(token);

            return decodedToken.Claims.FirstOrDefault(c => c.Type == Config.UsernameClaim)?.Value ?? "";
        }
    }
}
