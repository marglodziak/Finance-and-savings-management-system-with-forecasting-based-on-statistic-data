using System.Security.Cryptography;
using System.Text;

namespace FinanceSystemAPI.Helpers
{
    public class PasswordHasher
    {
        private const int keySize = 64;
        private const int iterations = 500000;

        public (string hash, string salt) HashPassword(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(keySize);            

            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations,
                HashAlgorithmName.SHA512,
                keySize);

            return (Convert.ToHexString(hash), Convert.ToHexString(salt));
        }

        public string HashPassword(string password, string salt)
        {
            var saltConverted = Convert.FromHexString(salt);

            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                saltConverted,
                iterations,
                HashAlgorithmName.SHA512,
                keySize);

            return Convert.ToHexString(hash);
        }
    }
}
