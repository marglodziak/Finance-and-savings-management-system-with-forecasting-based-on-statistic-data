using AppConfig;
using ForecastCreator.Enums;
using ForecastCreator.Models;
using Microsoft.ML;
using Microsoft.ML.Transforms.TimeSeries;

namespace ForecastCreator.Helpers
{
    public class ForecastCreator
    {
        public static float[] GetNaiveForecast(OperationTypes type, IEnumerable<OperationByMonth> operations)
        {
            double factor = 0;
            switch (type)
            {
                case OperationTypes.Earning:
                    factor = FREDConnector.GetLastMonthSalaryChanges();
                    break;
                case OperationTypes.Expense:
                    factor = FREDConnector.GetLastMonthCPIChanges();
                    break;
            }

            var lastOperationValue = operations.Last().Value;
            return Enumerable.Range(1, Config.ForecastHorizon)
                .Select(i => (float)(lastOperationValue*Math.Pow(factor, i)))
                .ToArray();
        }

        public static float[] GetNaiveSeasonForecast(OperationTypes type, IEnumerable<OperationByMonth> operations)
        {
            IEnumerable<double> factors = Enumerable.Empty<double>();
            var results = new List<float>();
            var lastOperationValue = operations.Last().Value;

            switch (type)
            {
                case OperationTypes.Earning:
                    factors = FREDConnector.GetLastYearSalaryChanges();
                    break;
                case OperationTypes.Expense:
                    factors = FREDConnector.GetLastYearCPIChanges();
                    break;
            }



            for (int i=1; i<Config.ForecastHorizon+1; i++)
            {
                var factor = i < factors.Count()
                    ? factors.ElementAt(i) / factors.ElementAt(i-1)
                    : factors.Last() / factors.ElementAt(factors.Count()-1) / factors.ElementAt(factors.Count() - 1);

                results.Add((float)(lastOperationValue * factor));
            }

            return results.ToArray();
        }

        public static float[] GetMLForecast(IEnumerable<OperationByMonth> operations)
        {
            var context = new MLContext();
            var data = context.Data.LoadFromEnumerable(operations);
            var pipeline = context.Forecasting.ForecastBySsa(
                    "Forecast",
                    nameof(OperationByMonth.Value),
                    windowSize: Config.WindowSize,
                    seriesLength: Config.SeriesLength,
                    trainSize: Math.Max(Config.TrainSize, operations.Count()),
                    horizon: Config.ForecastHorizon
                );

            var model = pipeline.Fit(data);
            var forecastingEngine = model.CreateTimeSeriesEngine<OperationByMonth, OperationByMonthForecast>(context);
            var forecast = forecastingEngine.Predict();

            return forecast.Forecast;
        }
    }
}
