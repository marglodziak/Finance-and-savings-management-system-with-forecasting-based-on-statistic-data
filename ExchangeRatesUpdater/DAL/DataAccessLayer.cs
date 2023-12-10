using DataAccessLayerGeneric;
using Microsoft.Data.SqlClient;

namespace ExchangeRatesUpdater.DAL
{
    internal class DataAccessLayer
    {
        private DalGeneric _dal = new ();

        public void Test()
        {
            _dal.ExecuteProcedure("dbo.usp_Test", new SqlParameter[] { });
        }
    }
}
