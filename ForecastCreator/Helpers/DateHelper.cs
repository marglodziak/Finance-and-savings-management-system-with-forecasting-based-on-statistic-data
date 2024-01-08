using AppConfig;

namespace ForecastCreator.Helpers
{
    public class DateHelper
    {
        public static string[] GetForecastDateRange()
        {
            var startDate = DateTime.Now.AddMonths(-Config.ForecastHorizon+1);
            var endDate = DateTime.Now.AddMonths(Config.ForecastHorizon);

            var result = new List<string>();

            while (startDate < endDate)
            {
                result.Add(startDate.ToString("MM.yyyy"));
                startDate = startDate.AddMonths(1);
            }

            return result.ToArray();
        }
    }
}
