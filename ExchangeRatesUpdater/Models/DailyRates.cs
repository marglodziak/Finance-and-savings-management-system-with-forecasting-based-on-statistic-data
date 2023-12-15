namespace ExchangeRatesUpdater.Models
{
    internal class DailyRates
    {
        public string Table {  get; set; }
        public string No { get; set; }
        public DateTime EffectiveDate { get; set; }
        public RateDetails[] Rates { get; set; }
    }
}
