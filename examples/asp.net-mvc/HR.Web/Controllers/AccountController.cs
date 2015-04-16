using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web;

namespace HR.Web.Controllers
{
    public class AccountController : Controller
    {
        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }
    }
}