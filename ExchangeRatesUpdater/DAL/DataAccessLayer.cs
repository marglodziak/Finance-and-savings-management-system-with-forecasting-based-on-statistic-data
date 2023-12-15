using DataAccessLayerGeneric;
using ExchangeRatesUpdater.Models;
using Microsoft.Data.SqlClient;

namespace ExchangeRatesUpdater.DAL
{
    internal class DataAccessLayer : DalGeneric
    {
        public void UpdateExchangeRates(RateDetails[] rates)
        {
            foreach (var rate in rates)
            {
                ExecuteProcedure("dbo.usp_ExchangeRates_Update", new SqlParameter[]
                {
                    new SqlParameter("@p_CurrencyCode", rate.Code),
                    new SqlParameter("@p_CurrencyName", rate.Currency),
                    new SqlParameter("@p_CurrentExchangeRate", rate.Mid)
                });
            }            
        }
    }
}
