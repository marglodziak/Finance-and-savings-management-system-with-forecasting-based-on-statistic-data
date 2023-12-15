using FinanceSystemAPI.DAL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace FinanceSystemAPI.Controllers
{
    [ApiController]
    [Authorize]
    [EnableCors("AllowCorsPolicy")]
    [Route("[controller]")]
    public class ExchangeRatesController : Controller
    {
        [HttpGet]
        public IActionResult GetExchangeRates()
        {
            var dal = new DataAccessLayer();

            return Ok(dal.GetExchangeRates());
        }

        [Route("Currencies")]
        [HttpGet]
        public IActionResult GetCurrencies()
        {
            var dal = new DataAccessLayer();

            return Ok(dal.GetCurrencies());
        }
    }
}
