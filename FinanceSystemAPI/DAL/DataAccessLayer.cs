using Microsoft.Data.SqlClient;
using DataAccessLayerGeneric;
using DataAccessLayerGeneric.Models;
using FinanceSystemAPI.Models;

namespace FinanceSystemAPI.DAL
{
    public class DataAccessLayer : DalGeneric
    {
        public SqlQueryResult RegisterUser(string email, string hashedPassword, string salt)
        {
            return ExecuteProcedure("[dbo].[usp_User_Insert]", new SqlParameter[]
            {
                new SqlParameter("@p_Email", email),
                new SqlParameter("@p_HashedPassword", hashedPassword),
                new SqlParameter("@p_Salt", salt)
            });
        }

        public DBUser GetUserDetails(string email)
        {
            var result = ExecuteProcedure("[dbo].[usp_User_Select]", new SqlParameter[]
            {
                new SqlParameter("@p_Email", email)
            });

            return ConvertDataTable<DBUser>(result.ReturnedData).FirstOrDefault();
        }

        public string GetRefreshToken(int userId)
        {
            var result = ExecuteProcedure("[dbo].[usp_RefreshToken_Select]", new SqlParameter[]
            {
                new SqlParameter("@p_UserId", userId)
            });

            return ConvertDataTable<string>(result.ReturnedData).FirstOrDefault();
        }

        public void SaveRefreshToken(int userId, string refreshToken, DateTimeOffset validTo)
        {
            ExecuteProcedure("[dbo].[usp_RefreshToken_Insert]", new SqlParameter[]
            {
                new SqlParameter("@p_UserId", userId),
                new SqlParameter("@p_RefreshToken", refreshToken),
                new SqlParameter("@p_ValidTo", validTo)
            });
        }

        public void DeleteInvalidRefreshTokens()
        {
            ExecuteProcedure("[dbo].[usp_RefreshTokens_Delete]", Array.Empty<SqlParameter>());
        }

        public SqlQueryResult AddEarnings(int userId, Operation[] earnings)
        {
            var failedEarnings = new List<double>();

            foreach (var earning in earnings)
            {
                try
                {
                    ExecuteProcedure("[dbo].[usp_Earning_Insert]", new SqlParameter[]
                    {
                    new SqlParameter("@p_UserId", userId),
                    new SqlParameter("@p_Date", earning.Date),
                    new SqlParameter("@p_Category", earning.Category),
                    new SqlParameter("@p_Description", earning.Description),
                    new SqlParameter("@p_Value", earning.Value),
                    new SqlParameter("@p_CurrencyCode", earning.CurrencyCode)
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
                };
            }

            return null;
        }

        public IEnumerable<Operation> GetUserEarnings(int userId)
        {
            var result = ExecuteProcedure("[dbo].[usp_Earnings_Select]", new SqlParameter[]
            {
                    new SqlParameter("@p_UserId", userId)
            });

            return ConvertDataTable<Operation>(result.ReturnedData);
        }

        public void DeleteEarning(int earningId)
        {
            ExecuteProcedure("[dbo].[usp_Earning_Delete]", new SqlParameter[]
            {
                new SqlParameter("@p_EarningId", earningId)
            });
        }

        public IEnumerable<string> GetEarningCategories(int userId)
        {
            var categories = new List<string>();

            categories.AddRange(GetGeneralEarningCategories());
            //TODO: custom categories as well

            return categories;
        }

        public SqlQueryResult AddExpenses(int userId, Operation[] expenses)
        {
            var failedExpenses = new List<double>();

            foreach (var expense in expenses)
            {
                try
                {
                    ExecuteProcedure("[dbo].[usp_Expense_Insert]", new SqlParameter[]
                    {
                    new SqlParameter("@p_UserId", userId),
                    new SqlParameter("@p_Date", expense.Date),
                    new SqlParameter("@p_Category", expense.Category),
                    new SqlParameter("@p_Description", expense.Description),
                    new SqlParameter("@p_Value", expense.Value),
                    new SqlParameter("@p_CurrencyCode", expense.CurrencyCode)
                    });
                }
                catch
                {
                    failedExpenses.Add(expense.Value);
                }
            }

            if (failedExpenses.Any())
            {
                return new SqlQueryResult()
                {
                    IsSuccessful = false,
                };
            }

            return null;
        }

        public IEnumerable<Operation> GetUserExpenses(int userId)
        {
            var result = ExecuteProcedure("[dbo].[usp_Expenses_Select]", new SqlParameter[]
            {
                    new SqlParameter("@p_UserId", userId)
            });

            return ConvertDataTable<Operation>(result.ReturnedData);
        }

        public void DeleteExpense(int expenseId)
        {
            ExecuteProcedure("[dbo].[usp_Expense_Delete]", new SqlParameter[]
            {
                new SqlParameter("@p_ExpenseId", expenseId)
            });
        }

        public IEnumerable<string> GetExpenseCategories(int userId)
        {
            var categories = new List<string>();

            categories.AddRange(GetGeneralExpenseCategories());
            //TODO: custom categories as well

            return categories;
        }

        public IEnumerable<RateDetails> GetExchangeRates()
        {
            var result = ExecuteProcedure("[dbo].[usp_ExchangeRates_Select]", Array.Empty<SqlParameter>());

            return ConvertDataTable<RateDetails>(result.ReturnedData);
        }

        public IEnumerable<string> GetCurrencies()
        {
            var result = ExecuteProcedure("[dbo].[usp_Currencies_Select]", Array.Empty<SqlParameter>());

            return ConvertDataTable<string>(result.ReturnedData);
        }

        private IEnumerable<string> GetGeneralEarningCategories()
        {
            var result = ExecuteProcedure("[dbo].[usp_EarningsCategoriesGeneral_Select]", new SqlParameter[] { });

            return ConvertDataTable<string>(result.ReturnedData);
        }

        private IEnumerable<string> GetGeneralExpenseCategories()
        {
            var result = ExecuteProcedure("[dbo].[usp_ExpensesCategoriesGeneral_Select]", new SqlParameter[] { });

            return ConvertDataTable<string>(result.ReturnedData);
        }

        public SqlQueryResult SetConnectionCode(int userId, int connectionCode, DateTime validTo)
        {
            return ExecuteProcedure("[dbo].[usp_ConnectUserRequest_Insert]", new SqlParameter[]
            {
                new SqlParameter("@p_UserId", userId),
                new SqlParameter("@p_ConnectUserCode", connectionCode),
                new SqlParameter("@p_ValidTo", validTo)
            });
        }

        public ConnectionCodeDetails GetConnectionCode(int code)
        {
            var result = ExecuteProcedure("[dbo].[usp_ConnectUserRequest_Select]", new SqlParameter[]
            {
                new SqlParameter("@p_ConnectUserCode", code)
            });

            return ConvertDataTable<ConnectionCodeDetails>(result.ReturnedData).FirstOrDefault();
        }

        public SqlQueryResult ConnectUsers(int connectingUserId, int userConnectedToId)
        {
            return ExecuteProcedure("[dbo].[usp_ConnectedUsers_Insert]", new SqlParameter[]
            {
                new SqlParameter("@p_ConnectingUserId", connectingUserId),
                new SqlParameter("@p_UserConnectedToId", userConnectedToId)
            });
        }

        public void ChangeUsername(int currentUserId, int userConnectedToId, string newUsername)
        {
            ExecuteProcedure("[dbo].[usp_ConnectedUser_Update]", new SqlParameter[]
            {
                new SqlParameter("@p_CurrentUserId", currentUserId),
                new SqlParameter("@p_UserConnectedToId", userConnectedToId),
                new SqlParameter("@p_Username", newUsername)
            });
        }

        public IEnumerable<ConnectedUser> GetConnectedUsers(int userId, bool connectedToMeMode)
        {
            var result = ExecuteProcedure("[dbo].[usp_ConnectedUsers_Select]", new SqlParameter[]
            {
                new SqlParameter("@p_UserId", userId),
                new SqlParameter("@p_ConnectedToMeMode", connectedToMeMode)
            });

            return ConvertDataTable<ConnectedUser>(result.ReturnedData);
        }

        public void DeleteConnectedUsers(int userId, string email, string username, bool connectedToMeMode)
        {
            ExecuteProcedure("[dbo].[usp_ConnectedUsers_Delete]", new SqlParameter[]
            {
                new SqlParameter("@p_UserId", userId),
                new SqlParameter("@p_UserEmail", email),
                new SqlParameter("@p_Username", username),
                new SqlParameter("@p_ConnectedToMeMode", connectedToMeMode)
            });
        }
        public void CleanConnectionCodeQueue(int userId)
        {
            ExecuteProcedure("[dbo].[usp_ConnectUserRequest_Delete]", new SqlParameter[]
            {
                new SqlParameter("@p_UserId", userId)
            });
        }
    }
}
