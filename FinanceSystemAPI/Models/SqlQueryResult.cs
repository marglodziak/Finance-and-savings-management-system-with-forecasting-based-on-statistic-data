using System.Data;

namespace FinanceSystemAPI.Models
{
    public class SqlQueryResult
    {
        public bool IsSuccessful { get; set; }
        public string ErrorMessage { get; set; }
        public DataTable ReturnedData { get; set; }
    }
}
