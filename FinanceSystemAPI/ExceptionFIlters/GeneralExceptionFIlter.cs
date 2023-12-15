using System.Net;
using System.Web.Http.Filters;

namespace FinanceSystemAPI.ExceptionFilters
{
    public class GeneralExceptionFilter : ExceptionFilterAttribute
    {
        private Type[] _alreadyHandledExceptions = {
            typeof(InvalidOperationException)
        };

        public override void OnException(HttpActionExecutedContext context)
        {
            if (_alreadyHandledExceptions.Contains(context.Exception.GetType()))
            {
                context.Response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                context.Response.Content = new StringContent("Coś poszło nie tak. Pracujemy nad rozwiązaniem Twojego błędu.");
            }
        }
    }
}
