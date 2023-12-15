using System.Data;
using DataAccessLayerGeneric.Models;
using Microsoft.Data.SqlClient;
using AppConfig;
using Newtonsoft.Json;

namespace DataAccessLayerGeneric
{
    public class DalGeneric
    {
        public static SqlQueryResult ExecuteProcedure(string procedureName, SqlParameter[] parameters)
        {
            using (var connection = new SqlConnection(Config.FinanceSystemDBConnString))
            {
                var adapter = new SqlDataAdapter();
                var resultTable = new DataTable();

                adapter.SelectCommand = new SqlCommand(procedureName, connection);
                adapter.SelectCommand.CommandType = CommandType.StoredProcedure;
                adapter.SelectCommand.Parameters.AddRange(parameters);

                try
                {
                    adapter.Fill(resultTable);
                    return new SqlQueryResult()
                    {
                        IsSuccessful = true,
                        ReturnedData = resultTable
                    };
                }
                catch(Exception ex)
                {
                    return new SqlQueryResult()
                    {
                        IsSuccessful = false,
                        ErrorMessage = ex.Message
                    };
                }               
            }
        }

        public static IEnumerable<T> ConvertDataTable<T>(DataTable dt)
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