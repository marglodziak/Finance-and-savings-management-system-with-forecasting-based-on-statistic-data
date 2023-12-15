namespace FinanceSystemAPI.Models
{
    public class ConnectedUser
    {
        public int ConnectingUserId { get; set; }
        public int UserConnectedToId { get; set; }
        public string ConnectedUsername { get; set; }
    }
}
