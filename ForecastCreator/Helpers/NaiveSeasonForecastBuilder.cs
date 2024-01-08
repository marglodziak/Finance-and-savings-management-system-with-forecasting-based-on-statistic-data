using ForecastCreator.Enums;
using ForecastCreator.Models;

namespace ForecastCreator.Helpers
{
    public class NaiveSeasonForecastBuilder
    {
        public KeyValuePair<string[], float[][]> Build(ForecastData data)
        {
            var earningsForecast = ForecastCreator.GetNaiveSeasonForecast(OperationTypes.Earning, data.Earnings);
            var expensesForecast = ForecastCreator.GetNaiveSeasonForecast(OperationTypes.Expense, data.Expenses);
            var dates = DateHelper.GetForecastDateRange();
            var results = DataPreparer.FormatResults(data, earningsForecast, expensesForecast);

            return new KeyValuePair<string[], float[][]>(dates, results);
        }
    }
}
