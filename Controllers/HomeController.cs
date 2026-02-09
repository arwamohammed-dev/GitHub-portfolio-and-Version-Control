using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using RadarClientApp.Models;

namespace RadarClientApp.Controllers
{
    public class HomeController : Controller
    {

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public IActionResult Index()
        {
            // التأكد من وجود اسم المستخدم في الجلسة
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("FullName")))
            {
                return RedirectToAction("Login", "Account");
            }
            return View();
        }

    }

}
