using System;
using System.Web.Mvc;

namespace HR.Web
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class AuthorizePermissionAttribute : AuthorizeAttribute
    {
        public AuthorizePermissionAttribute(string permission)
        {
            this.Roles = permission;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (filterContext.HttpContext.Request.IsAuthenticated)
            {
                filterContext.HttpContext.Response.StatusCode = 403;
                filterContext.Result = new ViewResult { ViewName = "Unauthorized" };
            }
            else
            {
                base.HandleUnauthorizedRequest(filterContext);
            }
        }
    }
}