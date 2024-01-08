using ForecastCreator.Enums;
using ForecastCreator.Models;

namespace ForecastCreator.Helpers
{
    public class NaiveForecastBuilder
    {
        public KeyValuePair<string[], float[][]> Build(ForecastData data)
        {
            var earningsForecast = ForecastCreator.GetNaiveForecast(OperationTypes.Earning, data.Earnings);
            var expensesForecast = ForecastCreator.GetNaiveForecast(OperationTypes.Expense, data.Expenses);
            var dates = DateHelper.GetForecastDateRange();
            var results = DataPreparer.FormatResults(data, earningsForecast, expensesForecast);

            return new KeyValuePair<string[], float[][]>(dates, results);
        }
    }
}
