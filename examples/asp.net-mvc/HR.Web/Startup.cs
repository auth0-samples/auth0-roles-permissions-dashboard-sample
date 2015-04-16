using System.Configuration;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using HR.Web;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Newtonsoft.Json.Linq;
using Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace HR.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Enable the application to use a cookie to store information for the signed in user
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login")
                // LoginPath property informs the middleware that it should change an outgoing 401 Unauthorized status code into a 302 redirection onto the given login path
                // More info: http://msdn.microsoft.com/en-us/library/microsoft.owin.security.cookies.cookieauthenticationoptions.loginpath(v=vs.111).aspx
            });

            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Use Auth0
            var provider = new Auth0.Owin.Auth0AuthenticationProvider
            {
                OnAuthenticated = (context) =>
                {
                    var permissions = context.User["permissions"] as JArray;
                    if (permissions != null)
                    {
                        foreach (var permission in permissions)
                        {
                            context.Identity.AddClaim(new Claim(ClaimTypes.Role, permission.ToString()));
                        }
                    }

                    return Task.FromResult(0);
                }
            };

            app.UseAuth0Authentication(
                clientId: ConfigurationManager.AppSettings["auth0:ClientId"],
                clientSecret: ConfigurationManager.AppSettings["auth0:ClientSecret"],
                domain: ConfigurationManager.AppSettings["auth0:Domain"],
                //redirectPath: "/Account/ExternalLoginCallback", // use AccountController instead of Auth0AccountController
                provider: provider);
        }
    }
}