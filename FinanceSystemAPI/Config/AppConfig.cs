using System.Configuration;
using ConfigurationManager = System.Configuration.ConfigurationManager;

namespace FinanceSystemAPI.Config
{
    public static class AppConfig
    {
        public static string FinanceSystemDBConnString => GetConfig("FinanceSystemDB", true, true);

        private static string GetConfig(string key, bool throwError, bool isConnString = false)
        {
            try
            {
                if (isConnString)
                {
                    return GetConnString(key);
                }

                return GetAppSetting(key);
            }

            catch
            {
                if (throwError)
                {
                    throw;
                }

                return "";
            }
        }

        private static string GetConnString(string key)
        {
            return ConfigurationManager.ConnectionStrings[key].ToString();
        }

        private static string GetAppSetting(string key)
        {
            return ConfigurationManager.AppSettings[key].ToString();
        }
    }
}
