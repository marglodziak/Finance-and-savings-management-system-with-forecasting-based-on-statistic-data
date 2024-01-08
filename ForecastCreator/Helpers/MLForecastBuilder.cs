using AppConfig;
using ForecastCreator.Models;

namespace ForecastCreator.Helpers
{
    public class MLForecastBuilder
    {
        public KeyValuePair<string[], float[][]> Build(ForecastData data)
        {
            var preparedData = DataPreparer.PrepareMLData(data);
            var earningsForecast = ForecastCreator.GetMLForecast(preparedData.Earnings);
            var expensesForecast = ForecastCreator.GetMLForecast(preparedData.Expenses);
            var dates = DateHelper.GetForecastDateRange();
            var results = DataPreparer.FormatResults(data, earningsForecast, expensesForecast);


            return new KeyValuePair<string[], float[][]>(dates, results);
        }
    }
}
