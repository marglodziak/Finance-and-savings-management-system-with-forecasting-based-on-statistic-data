using FinanceSystemAPI.Config;
using FinanceSystemAPI.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text;

namespace FinanceSystemAPI.DAL
{
    public class DataAccessLayer
    {
        private DataAccessLayerGeneric _dal = new();

        public SqlQueryResult RegisterUser(string email, string hashedPassword)
        {
            return _dal.ExecuteProcedure("[dbo].[usp_User_Insert]", new SqlParameter[] {
                new SqlParameter("@p_Email", email),
                new SqlParameter("@p_HashedPassword", hashedPassword),
            });

        }

        public SqlQueryResult Test()
        {
            return _dal.ExecuteProcedure("dbo.Test", new SqlParameter[] {
                   new SqlParameter("@p_1", "Działa może?"),
                   new SqlParameter("@p_2", "Na pewno zadziała"),
                   new SqlParameter("@p_3", "A jeśli nie?"),
                   new SqlParameter("@p_4", "To zobaczymy")
            });
        }
        
    }
}
