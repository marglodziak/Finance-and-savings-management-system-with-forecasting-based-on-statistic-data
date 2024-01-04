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
    public class ExpensesController : BaseController
    {
        [HttpGet]
        public IActionResult GetExpenses()
        {
            var dal = new DataAccessLayer();

            var userId = GetUserId();
            var result = dal.GetUserExpenses(userId);

            return Ok(result);
        }

        [HttpDelete]
        public IActionResult DeleteExpense([FromBody] int expenseId)
        {
            new DataAccessLayer().DeleteExpense(expenseId);
            return Ok();
        }

        [HttpGet]
        [Route("Categories")]
        public IActionResult GetExpenseCategories()
        {
            var dal = new DataAccessLayer();

            var userId = GetUserId();
            var result = dal.GetExpenseCategories(userId);

            return Ok(result);
        }

        [HttpPost]
        public IActionResult AddExpense([FromBody] Operation[] expenses)
        {
            var dal = new DataAccessLayer();
            var userId = GetUserId();

            dal.AddExpenses(userId, expenses);

            return Ok();
        }
    }
}
