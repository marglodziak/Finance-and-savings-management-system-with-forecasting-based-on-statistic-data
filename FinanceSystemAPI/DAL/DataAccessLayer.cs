using Azure.Core;
using FinanceSystemAPI.Models;
using Microsoft.Data.SqlClient;

namespace FinanceSystemAPI.DAL
{
    public class DataAccessLayer
    {
        private DataAccessLayerGeneric _dal = new();

        public SqlQueryResult RegisterUser(string email, string hashedPassword, string salt)
        {
            return _dal.ExecuteProcedure("[dbo].[usp_User_Insert]", new SqlParameter[]
            {
                new SqlParameter("@p_Email", email),
                new SqlParameter("@p_HashedPassword", hashedPassword),
                new SqlParameter("@p_Salt", salt)
            });
        }

        public SqlQueryResult GetUserDetails(string email)
        {
            return _dal.ExecuteProcedure("[dbo].[usp_User_Select]", new SqlParameter[]
            {
                new SqlParameter("@p_Email", email)
            });
        }

        public SqlQueryResult AddEarnings(EarningRequest request)
        {
            var failedEarnings = new List<double>();

            foreach (var earning in request.Earnings)
            {
                try
                {
                    _dal.ExecuteProcedure("[dbo].[usp_Earning_Insert]", new SqlParameter[]
                    {
                    new SqlParameter("@p_UserId", request.UserId),
                    new SqlParameter("@p_Date", earning.Date),
                    new SqlParameter("@p_Category", earning.Category),
                    new SqlParameter("@p_Value", earning.Value)
                    });
                }
                catch
                {
                    failedEarnings.Add(earning.Value);
                }
            }
            
            if (failedEarnings.Any())
            {
                return new SqlQueryResult()
                {
                    IsSuccessful = false,
                    // TODO: Error message as list to JSON
                };
            }

            return GetUserEarnings(request.UserId);
        }

        public SqlQueryResult GetUserEarnings(int userId)
        {
            var result = _dal.ExecuteProcedure("[dbo].[usp_Earnings_Select]", new SqlParameter[]
            {
                    new SqlParameter("@p_UserId", userId)
            });

            return result;

            //if (result.IsSuccessful)
            //{
            //    result.ReturnedData = result.ReturnedData.Rows[0]
            //}
        }
    }
}
