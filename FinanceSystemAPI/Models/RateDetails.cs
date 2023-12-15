namespace FinanceSystemAPI.Models
{
    public class RateDetails
    {
        public string CurrencyCode { get; set; }
        public string CurrencyName { get; set; }
        public decimal CurrentExchangeRate { get; set; }
    }
}
