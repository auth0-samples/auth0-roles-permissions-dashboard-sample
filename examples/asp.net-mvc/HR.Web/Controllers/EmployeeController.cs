using System.Web.Mvc;

namespace HR.Web.Controllers
{
    [AuthorizePermission("employee_read")]
    public class EmployeeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [AuthorizePermission("employee_create")]
        public ActionResult Create()
        {
            return View();
        }
    }
}