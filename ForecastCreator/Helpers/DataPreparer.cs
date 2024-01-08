using AppConfig;
using ForecastCreator.Models;

namespace ForecastCreator.Helpers
{
    public class DataPreparer
    {
        public static ForecastData PrepareMLData(ForecastData data)
        {
            return new ForecastData()
            {
                Earnings = ExtendData(data.Earnings),
                Expenses = ExtendData(data.Expenses)
            };
        }

        private static IEnumerable<OperationByMonth> ExtendData(IEnumerable<OperationByMonth> data)
        {
            var dataConverted = data.ToList();

            for (int i = 1; dataConverted.Count < Config.MinSeriesLength; i++)
            {
                var valueToCopy = dataConverted[dataConverted.Count - i].Value;
                dataConverted = dataConverted.Prepend(new OperationByMonth() { Value = valueToCopy }).ToList();
            }

            return dataConverted;
        }

        public static float[][] FormatResults(ForecastData original, float[] earningsForecast, float[] expensesForecast)
        {
            var originalBalance = CalculateBalance(original);
            var predictedBalance = CalculatePredictedBalance(originalBalance, earningsForecast, expensesForecast);

            return new float[][] { originalBalance, predictedBalance };
        }

        private static float[] CalculateBalance(ForecastData original)
        {
            var startDate = DateTime.Now.AddMonths(-Config.ForecastHorizon + 1);

            return GetBalanceForMonths(startDate, original);
        }

        private static float[] GetBalanceForMonths(DateTime startDate, ForecastData original)
        {
            var result = new List<float>();

            while (startDate <= DateTime.Now)
            {
                result.Add(GetBalanceForMonth(startDate, original));
                startDate = startDate.AddMonths(1);
            }

            return result.ToArray();
        }

        private static float GetBalanceForMonth(DateTime startDate, ForecastData original)
        {
            var earningsSum = original.Earnings
                .Where(e => e.Date.Split('.')[0] == startDate.Month.ToString() && e.Date.Split('.')[1] == startDate.Year.ToString())
                .Select(e => e.Value)
                .Sum();

            var expensesSum = original.Expenses
                .Where(e => e.Date.Split('.')[0] == startDate.Month.ToString() && e.Date.Split('.')[1] == startDate.Year.ToString())
                .Select(e => e.Value)
                .Sum();

            return earningsSum - expensesSum;
        }

        private static float[] CalculatePredictedBalance(float[] originalBalance, float[] earningsForecast, float[] expensesForecast)
        {
            var predictedBalance = new float[earningsForecast.Length];
            for (int i=0; i<earningsForecast.Length; i++)
            {
                predictedBalance[i] = earningsForecast[i] - expensesForecast[i];
            }

            return originalBalance.Concat(predictedBalance).ToArray();
        }
    }
}
