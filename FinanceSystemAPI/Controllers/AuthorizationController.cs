using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using FinanceSystemAPI.Models;
using FinanceSystemAPI.DAL;

namespace FinanceSystemAPI.Controllers
{
    [ApiController]
    [EnableCors("AllowCorsPolicy")]
    [Route("[controller]")]
    public class AuthorizationController : ControllerBase
    {       
        [HttpPost]
        [Route("Register")]
        public IActionResult RegisterUser(RegistrationData data)
        {
            var dal = new DataAccessLayer();
            var result = dal.Test();
            return Ok(result.Rows.Count);
        }
    }
}