using FinanceSystemAPI.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Reflection;

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

        private static List<T> ConvertDataTable<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }

        private static T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName)
                    {
                        var k = Convert.ChangeType(dr[column.ColumnName], pro.PropertyType);
                        pro.SetValue(obj, k, null);
                    }
                    else
                        continue;
                }
            }
            return obj;
        }
    }
}
