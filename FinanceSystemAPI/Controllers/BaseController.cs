using AppConfig;
using DataAccessLayerGeneric;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace FinanceSystemAPI.Controllers
{
    public class BaseController : Controller
    {
        protected int GetUserId()
        {
            var user = HttpContext.User;
            var userEmail = user.Claims.FirstOrDefault(c => c.Type == Config.UsernameClaim)?.Value ?? "";

            var result = DalGeneric.ExecuteProcedure("[dbo].[usp_UserID_Select]", new SqlParameter[]
            {
                new SqlParameter("@p_Email", userEmail)
            });

            return Convert.ToInt32(result.ReturnedData.Rows[0]["Id"]);
        }
    }
}
