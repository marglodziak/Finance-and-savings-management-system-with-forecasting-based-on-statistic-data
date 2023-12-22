namespace FinanceSystemAPI.Models
{
    public class DBUser
    {
        public int Id { get; set; }
        public string Hash { get; set; }
        public string Salt { get; set; }
        public int Role_Id { get; set; }
    }
}
