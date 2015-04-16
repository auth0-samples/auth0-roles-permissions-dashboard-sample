using System.Web.Mvc;

namespace HR.Web.Controllers
{
    [AuthorizePermission("holidays_read")]
    public class HolidaysController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}