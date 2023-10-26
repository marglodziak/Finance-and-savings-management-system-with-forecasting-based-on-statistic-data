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

        public SqlQueryResult RegisterUser(string email, string hashedPassword, string salt)
        {
            return _dal.ExecuteProcedure("[dbo].[usp_User_Insert]", new SqlParameter[] {
                new SqlParameter("@p_Email", email),
                new SqlParameter("@p_HashedPassword", hashedPassword),
                new SqlParameter("@p_Salt", salt)
            });
        }

        public SqlQueryResult GetUserDetails(string email)
        {
            return _dal.ExecuteProcedure("[dbo].[usp_User_Select]", new SqlParameter[] {
                new SqlParameter("@p_Email", email)
            });
        }
    }
}
