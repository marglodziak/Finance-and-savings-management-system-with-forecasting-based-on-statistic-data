using FinanceSystemAPI.Config;
using FinanceSystemAPI.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace FinanceSystemAPI.DAL
{
    public class DataAccessLayerGeneric
    {
        public SqlQueryResult ExecuteProcedure(string procedureName, SqlParameter[] parameters)
        {
            try
            {
                using (var connection = new SqlConnection(AppConfig.FinanceSystemDBConnString))
                {
                    var adapter = new SqlDataAdapter();
                    var resultTable = new DataTable();

                    adapter.SelectCommand = new SqlCommand(procedureName, connection);
                    adapter.SelectCommand.CommandType = CommandType.StoredProcedure;
                    adapter.SelectCommand.Parameters.AddRange(parameters);

                    adapter.Fill(resultTable);

                    return new SqlQueryResult()
                    {
                        IsSuccessful = true,
                        ReturnedData = resultTable
                    };
                }
            }
            catch (Exception ex)
            {
                return new SqlQueryResult()
                {
                    IsSuccessful = false,
                    ErrorMessage = ex.ToString()
                };
            }            
        }
    }
}
