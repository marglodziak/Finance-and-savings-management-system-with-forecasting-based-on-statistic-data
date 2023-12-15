using Newtonsoft.Json;
using ExchangeRatesUpdater.DAL;
using ExchangeRatesUpdater.Models;

namespace ExchangeRatesUpdater
{
    internal class RatesUpdater
    {
        static void Main(string[] args)
        {
            var response = GetCurrentExchangeRates().Result;

            if (!response.IsSuccessStatusCode)
            {
                return;
            }

            var result = response.Content.ReadAsStringAsync().Result;
            var exchangeRates = JsonConvert.DeserializeObject<DailyRates[]>(result).FirstOrDefault();

            if (exchangeRates == null)
            {
                return;
            }

            var dal = new DataAccessLayer();
            dal.UpdateExchangeRates(exchangeRates.Rates);
        }

        private static async Task<HttpResponseMessage> GetCurrentExchangeRates()
        {
            var client = new HttpClient();

            return await client.GetAsync("http://api.nbp.pl/api/exchangerates/tables/a");
        }
    }
}