using ForecastCreator.Helpers;
using ForecastCreator.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ForecastCreator.Controllers
{
    [ApiController]
    public class ForecastsController : ControllerBase
    {
        [HttpPost]
        [Route("NaiveForecast")]
        public IActionResult GetNaiveForecast([FromBody] ForecastData data)
        {
            var result = new NaiveForecastBuilder().Build(data);

            return Ok(result);
        }

        [HttpPost]
        [Route("NaiveSeasonForecast")]
        public IActionResult GetNaiveSeasonForecast([FromBody] ForecastData data)
        {
            var result = new NaiveSeasonForecastBuilder().Build(data);

            return Ok(result);
        }

        [HttpPost]
        [Route("MLForecast")]
        public IActionResult GetMLForecast([FromBody] ForecastData data)
        {
            var result = new MLForecastBuilder().Build(data);

            return Ok(result);
        }
    }
}