using System.Configuration;
using ConfigurationManager = System.Configuration.ConfigurationManager;

namespace FinanceSystemAPI.Config
{
    public static class AppConfig
    {
        public static string CorsPolicyName => GetConfig("AllowCorsPolicy", true);

        private static string GetConfig(string key, bool throwError)
        {
            if (ConfigurationManager.AppSettings[key] is not null)
            {
                return ConfigurationManager.AppSettings[key];
            }

            if (throwError)
            {
                throw new ConfigurationException($"Key \"{key}\" does not exist in the config file.");
            }

            return "";
        }
    }
}
