﻿using ConfigurationManager = System.Configuration.ConfigurationManager;

namespace AppConfig
{
    public static class Config
    {
        public static string FinanceSystemDBConnString => GetConfig("FinanceSystemDB", true, true);
        public static string FinanceSystemIssuer => GetConfig("Issuer", true, false);
        public static string FinanceSystemSigningKey => GetConfig("SigningKey", true, false);
        public static int AccessTokenExpirationTime => Convert.ToInt32(GetConfig("AccessTokenExpirationTime", true, false));
        public static int RefreshTokenExpirationTime => Convert.ToInt32(GetConfig("RefreshTokenExpirationTime", true, false));
        public static string ExpirationClaim => GetConfig("ExpirationClaim", true, false);
        public static string UsernameClaim => GetConfig("UsernameClaim", true, false);
        public static string RoleClaim => GetConfig("RoleClaim", true, false);

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
