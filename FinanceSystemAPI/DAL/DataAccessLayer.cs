using Microsoft.Data.SqlClient;
using System.Data;
using System.Text;

namespace FinanceSystemAPI.DAL
{
    public class DataAccessLayer
    {
        public DataTable Test()
        {
            var connString = @"Server=localhost\SQLEXPRESS;Database=FinanceSystem;Trusted_Connection=true; Connection timeout=30; TrustServerCertificate=true";
            var k = new SqlConnection(connString);
            try
            {
                k.Open();
                var l = new SqlCommand("EXEC dbo.usp_Test @p_Id=1", k);
                var table = new DataTable();
                var a = new SqlDataAdapter(l);

                a.Fill(table);

                return table;
            }
            catch
            {
                return null;
            }
            finally
            {
                k.Close();
            }

        }
        
    }
}
