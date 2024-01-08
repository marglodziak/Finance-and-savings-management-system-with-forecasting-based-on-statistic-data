namespace ForecastCreator.Models
{
    public class ForecastData
    {
        public IEnumerable<OperationByMonth> Earnings { get; set; }
        public IEnumerable<OperationByMonth> Expenses { get; set; }
    }
}
