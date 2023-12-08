using FinanceSystemAPI.Config;
using FinanceSystemAPI.DAL;
using FinanceSystemAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace FinanceSystemAPI.Controllers
{
    [ApiController]
    [Authorize]
    [EnableCors("AllowCorsPolicy")]
    [Route("[controller]")]
    public class FinancesController : Controller
    {
        [Route("Earnings")]
        [HttpGet]
        public IActionResult GetEarnings()
        {
            var dal = new DataAccessLayer();

            var userId = GetUserId(dal);
            var result = dal.GetUserEarnings(userId);

            return Ok(result);
        }

        [Route("EarningCategories")]
        [HttpGet]
        public IActionResult GetEarningCategories()
        {
            var dal = new DataAccessLayer();

            var userId = GetUserId(dal);
            var result = dal.GetEarningCategories(userId);

            return Ok(result);
        }

        [Route("Earnings")]
        [HttpPost]
        public IActionResult AddEarnings([FromBody] Earning[] earnings)
        {
            var dal = new DataAccessLayer();
            var userId = GetUserId(dal);

            dal.AddEarnings(userId, earnings);

            return Ok();
        }

        private int GetUserId(DataAccessLayer dal)
        {
            var user = HttpContext.User;
            var userEmail = user.Claims.FirstOrDefault(c => c.Type == AppConfig.UsernameClaim)?.Value ?? "";

            return dal.GetUserId(userEmail);
        }
    }
}
