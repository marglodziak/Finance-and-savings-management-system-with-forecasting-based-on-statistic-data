using System.Net;
using System.Web.Http.Filters;

namespace FinanceSystemAPI.ExceptionFilters
{
    public class InvalidOperationExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception is InvalidOperationException)
            {
                context.Response = new HttpResponseMessage(HttpStatusCode.BadRequest);
                context.Response.Content = new StringContent(context.Exception.ToString());
            }
        }
    }
}
