namespace FinanceSystemAPI.Models
{
    public class Earning
    {
        public string Username { get; set; }
        public DateTime Date { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public double Value { get; set; }
        public string CurrencyCode { get; set; }
        public double CurrentValueInPLN { get; set; }
    }
}
