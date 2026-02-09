using Microsoft.AspNetCore.Mvc;
using RadarClientApp.Data;
using RadarClientApp.Models;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace RadarClientApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // صفحة الدخول
        public IActionResult Login() => View();

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            // البحث عن المستخدم في القاعدة
            var user = _context.Users.FirstOrDefault(u => u.Email == email && u.Password == password);

            if (user != null)
            {
                // حفظ البيانات في الجلسة (Session)
                HttpContext.Session.SetString("UserEmail", user.Email);
                HttpContext.Session.SetString("FullName", $"{user.FirstName} {user.LastName}");
                HttpContext.Session.SetString("AccessType", user.AccessType);

                return RedirectToAction("Index", "Home"); // التوجه للرئيسية
            }

            ViewBag.Error = "البيانات المدخلة غير متطابقة مع سجلاتنا.";
            return View();
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
        public IActionResult Profile()
        {
            var accessType = HttpContext.Session.GetString("AccessType");
            ViewBag.AccessType = accessType;
            return View();
        }

    }
}
