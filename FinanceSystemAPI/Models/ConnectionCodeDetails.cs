namespace FinanceSystemAPI.Models
{
    public class ConnectionCodeDetails
    {
        public int UserId { get; set; }
        public int ConnectUserCode { get; set; }
        public DateTime ValidTo { get; set; }
    }
}
