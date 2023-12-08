using FinanceSystemAPI.Models;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System.Data;

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

        public int GetUserId(string email)
        {
            
            var result = _dal.ExecuteProcedure("[dbo].[usp_UserID_Select]", new SqlParameter[]
            {
                new SqlParameter("@p_Email", email)
            });

            if (!result.IsSuccessful)
            {
                throw new ArgumentException();
            }

            return Convert.ToInt32(result.ReturnedData.Rows[0]["Id"]);
        }

        public SqlQueryResult GetUserDetails(string email)
        {
            return _dal.ExecuteProcedure("[dbo].[usp_User_Select]", new SqlParameter[]
            {
                new SqlParameter("@p_Email", email)
            });
        }

        public SqlQueryResult AddEarnings(int userId, Earning[] earnings)
        {
            var failedEarnings = new List<double>();

            foreach (var earning in earnings)
            {
                try
                {
                    _dal.ExecuteProcedure("[dbo].[usp_Earning_Insert]", new SqlParameter[]
                    {
                    new SqlParameter("@p_UserId", userId),
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

            //return GetUserEarnings(request.UserId);
            return null;
        }

        public IEnumerable<Earning> GetUserEarnings(int userId)
        {
            var result = _dal.ExecuteProcedure("[dbo].[usp_Earnings_Select]", new SqlParameter[]
            {
                    new SqlParameter("@p_UserId", userId)
            });

            if (!result.IsSuccessful)
            {
                throw new ArgumentException();
            }

            return ConvertDataTable<Earning>(result.ReturnedData);
        }

        public IEnumerable<string> GetEarningCategories(int userId)
        {
            var categories = new List<string>();

            categories.AddRange(GetGeneralEarningCategories());


            return categories;
        }

        private IEnumerable<string> GetGeneralEarningCategories()
        {
            var result = _dal.ExecuteProcedure("[dbo].[usp_EarningsCategoriesGeneral_Select]", new SqlParameter[] { });

            if (!result.IsSuccessful)
            {
                throw new ArgumentException();
            }

            return ConvertDataTable<string>(result.ReturnedData);
        }

        private static IEnumerable<T> ConvertDataTable<T>(DataTable dt)
        {
            return dt.Columns.Count == 1 ? ConvertSimpleData<T>(dt) : ConvertComplexData<T>(dt);
        }

        private static IEnumerable<T> ConvertSimpleData<T>(DataTable dt)
        {
            var data = new List<T>();

            foreach (DataRow row in dt.Rows)
            {
                data.Add(GetItems<T>(row));
            }

            return data;
        }

        private static T GetItems<T>(DataRow dr)
        {
            string drSerialized = JsonConvert.SerializeObject(dr.ItemArray[0]);
            var drDeserialized = JsonConvert.DeserializeObject<T>(drSerialized);

            return drDeserialized;
        }

        private static IEnumerable<T> ConvertComplexData<T>(DataTable dt)
        {
            string drSerialized = JsonConvert.SerializeObject(dt);

            return JsonConvert.DeserializeObject<T[]>(drSerialized);
        }
    }
}
