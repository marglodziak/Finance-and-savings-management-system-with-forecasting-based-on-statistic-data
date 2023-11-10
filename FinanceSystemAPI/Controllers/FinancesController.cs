using FinanceSystemAPI.DAL;
using FinanceSystemAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace FinanceSystemAPI.Controllers
{
    [ApiController]
    [EnableCors("AllowCorsPolicy")]
    [Route("[controller]")]
    public class FinancesController : Controller
    {
        [Route("Earnings")]
        [HttpPost]
        public IActionResult AddEarnings([FromBody] EarningRequest request)
        {
            var result = new DataAccessLayer().AddEarnings(request);
            var samples = new Earning[]
            {
                new Earning()
                {
                    Date = "2023-11-05",
                    Category = "Pensja",
                    Value = 1234.56
                },
                new Earning()
                {
                    Date = "2023-11-06",
                    Category = "Pensja",
                    Value = 321.12
                }
            };

            return result.IsSuccessful ? Ok(samples) : BadRequest($"Nie udało się dodać następujących wpływów: {result.ErrorMessage}");
        }
    }
}
