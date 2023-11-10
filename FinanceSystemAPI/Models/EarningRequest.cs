namespace FinanceSystemAPI.Models
{
    public class EarningRequest
    {
        public int UserId { get; set; }
        public Earning[] Earnings { get; set; }
    }
}
