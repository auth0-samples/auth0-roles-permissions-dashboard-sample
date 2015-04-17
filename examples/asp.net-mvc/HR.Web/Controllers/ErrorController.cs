using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HR.Web.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Unauthorized()
        {
            return View("Unauthorized");
        }
    }
}