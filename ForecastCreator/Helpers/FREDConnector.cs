using AppConfig;
using ForecastCreator.Models;
using Newtonsoft.Json.Linq;

namespace ForecastCreator.Helpers
{
    public class FREDConnector
    {
        private static HttpClient _httpClient = new HttpClient();

        public static double GetLastMonthSalaryChanges()
        {
            var recentValues = GetLastSalaryChanges(6).TakeLast(2);
            return recentValues.Last().Value / recentValues.First().Value;
        }

        public static double GetLastMonthCPIChanges()
        {
            var recentValues = GetLastCPIChanges(6).TakeLast(2);
            return recentValues.Last().Value / recentValues.First().Value;
        }

        public static IEnumerable<double> GetLastYearSalaryChanges() => GetLastSalaryChanges(13).Select(sc => sc.Value);
        public static IEnumerable<double> GetLastYearCPIChanges() => GetLastCPIChanges(13).Select(sc => sc.Value);

        private static IEnumerable<ObservationFRED> GetLastSalaryChanges(int monthNumber)
        {
            var observationStartDate = DateTime.Now.AddMonths(-monthNumber).ToString("yyyy-MM-dd");
            var url = Config.SalaryUrl +
                $"&api_key={Config.KeyFRED}" +
                $"&file_type=json" +
                $"&observation_start={observationStartDate}";

            return GetFedDoubleData(url);
        }

        private static IEnumerable<ObservationFRED> GetLastCPIChanges(int monthNumber)
        {
            var observationStartDate = DateTime.Now.AddMonths(-monthNumber).ToString("yyyy-MM-dd");
            var url = Config.CPIUrl +
                $"&api_key={Config.KeyFRED}" +
                $"&file_type=json" +
                $"&observation_start={observationStartDate}";

            return GetFedDoubleData(url);
        }

        private static IEnumerable<ObservationFRED> GetFedDoubleData(string url)
        {
            var result = _httpClient.GetAsync(url).Result;
            var resultConverted = result.Content.ReadAsStringAsync().Result;
            var values = JObject.Parse(resultConverted)["observations"].ToObject<ObservationFRED[]>();

            return values;
        }
    }
}
