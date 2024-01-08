using FinanceSystemAPI.DAL;
using FinanceSystemAPI.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace FinanceSystemAPI.Controllers
{
    [ApiController]
    [Authorize]
    [EnableCors("AllowCorsPolicy")]
    [Route("[controller]")]
    public class ForecastsController : BaseController
    {
        [HttpGet]
        [Route("Naive")]
        public IActionResult GetNaiveForecast()
        {
            var dal = new DataAccessLayer();
            var userId = GetUserId();
            var earnings = dal.GetUserEarningsByMonth(userId);
            var expenses = dal.GetUserExpensesByMonth(userId);

            if (!earnings.Any() || !expenses.Any())
            {
                return BadRequest("Brak danych do stworzenia prognozy. Dodaj więcej wpływów i wydatków.");
            }

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json");

            var results = client.PostAsync("https://localhost:7178/NaiveForecast", new StringContent(JsonConvert.SerializeObject(new { Earnings = earnings, Expenses = expenses }), new MediaTypeHeaderValue("application/json"))).Result;

            return Ok(results.Content.ReadAsStringAsync().Result);
        }

        [HttpGet]
        [Route("NaiveWithSeason")]
        public IActionResult GetNaiveForecastWithSeasoning()
        {
            var dal = new DataAccessLayer();
            var userId = GetUserId();
            var earnings = dal.GetUserEarningsByMonth(userId);
            var expenses = dal.GetUserExpensesByMonth(userId);

            if (!earnings.Any() || !expenses.Any())
            {
                return BadRequest("Brak danych do stworzenia prognozy. Dodaj więcej wpływów i wydatków.");
            }

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json");

            var results = client.PostAsync("https://localhost:7178/NaiveSeasonForecast", new StringContent(JsonConvert.SerializeObject(new { Earnings = earnings, Expenses = expenses }), new MediaTypeHeaderValue("application/json"))).Result;

            return Ok(results.Content.ReadAsStringAsync().Result);
        }

        [HttpGet]
        [Route("ML")]
        public IActionResult GetMLForecast()
        {
            var dal = new DataAccessLayer();
            var userId = GetUserId();
            var earnings = dal.GetUserEarningsByMonth(userId);
            var expenses = dal.GetUserExpensesByMonth(userId);

            if (!earnings.Any() || !expenses.Any())
            {
                return BadRequest("Brak danych do stworzenia prognozy. Dodaj więcej wpływów i wydatków.");
            }

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json");

            var results = client.PostAsync("https://localhost:7178/MLForecast", new StringContent(JsonConvert.SerializeObject(new { Earnings = earnings, Expenses = expenses }), new MediaTypeHeaderValue("application/json"))).Result;
                        
            return Ok(results.Content.ReadAsStringAsync().Result);
        }
    }
}
