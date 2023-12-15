using DataAccessLayerGeneric.Models;
using FinanceSystemAPI.DAL;
using FinanceSystemAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace FinanceSystemAPI.Controllers
{
    [ApiController]
    [Authorize]
    [EnableCors("AllowCorsPolicy")]
    [Route("[controller]")]
    public class UserController : BaseController
    {
        [HttpGet]
        [Route("")]
        public IActionResult GetConnectedUsers()
        {
            var userId = GetUserId();
            var result = new DataAccessLayer().GetConnectedUsers(userId);

            return Ok(result);
        }

        [HttpPut]
        [Route("Name")]
        public IActionResult ChangeUsername([FromBody] ChangeUsernameRequest request)
        {
            var currentUserId = GetUserId();
            new DataAccessLayer().ChangeUsername(currentUserId, request.UserId, request.Username);

            return Ok();
        }

        [HttpGet]
        [Route("ConnectionCode")]
        public IActionResult GetConnectionCode()
        {
            int code;
            SqlQueryResult result;

            var userId = GetUserId();

            do
            {
                code = new Random().Next(100000, 999999);
                var validTo = DateTime.Now.AddMinutes(3);

                result = new DataAccessLayer().SetConnectionCode(userId, code, validTo);
            }
            while (!result.IsSuccessful);
            

            return Ok(code.ToString());
        }

        [HttpPost]
        [Route("ConnectionCode")]
        public IActionResult CheckConnectionCode([FromBody]int code)
        { 
            var dal = new DataAccessLayer();

            var userId = GetUserId();
            var result = dal.GetConnectionCode(code);

            if (result is null || result.ConnectUserCode != code)
            {
                return BadRequest("Podany kod jest błędny.");
            }
            if (result.UserId == userId)
            {
                return BadRequest("Nie można połączyć się z własnym kontem.");
            }
            if (result.ValidTo <  DateTime.Now)
            {
                dal.CleanConnectionCodeQueue(result.UserId);
                return BadRequest("Podany kod wygasł.");
            }

            var connectResult = dal.ConnectUsers(userId, result.UserId);
            
            if (!connectResult.IsSuccessful)
            {
                return BadRequest("Wybrane konto jest już połączone.");
            }
            
            dal.CleanConnectionCodeQueue(result.UserId);
            return Ok(result.UserId);
        }
    }
}
