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
    public class EarningsController : BaseController
    {
        [HttpGet]
        public IActionResult GetEarnings()
        {
            var dal = new DataAccessLayer();

            var userId = GetUserId();
            var result = dal.GetUserEarnings(userId);

            return Ok(result);
        }

        [HttpDelete]
        public IActionResult DeleteEarning([FromBody] int earningId)
        {
            new DataAccessLayer().DeleteEarning(earningId);
            return Ok();
        }

        [HttpGet]
        [Route("Categories")]
        public IActionResult GetEarningCategories()
        {
            var dal = new DataAccessLayer();

            var userId = GetUserId();
            var result = dal.GetEarningCategories(userId);

            return Ok(result);
        }

        [HttpPost]
        public IActionResult AddEarnings([FromBody] Earning[] earnings)
        {
            var dal = new DataAccessLayer();
            var userId = GetUserId();

            dal.AddEarnings(userId, earnings);

            return Ok();
        }
    }
}
