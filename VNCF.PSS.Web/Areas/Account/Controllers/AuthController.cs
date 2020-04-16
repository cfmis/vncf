using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Common;
using CF.Framework.Utility;
using CF.Framework.Web;
using CF.Account.Contract;
using CF.Framework.Contract;

namespace VNCF.PSS.Web.Areas.Account.Controllers
{
    public class AuthController : AdminControllerBase//: Controller
    {
        // GET: Account/Auth
        [AuthorizeIgnore]
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [AuthorizeIgnore]
        public ActionResult Login(string username, string password, string verifycode,string languageid)
        {

            //////return RedirectToAction("Index");

            var loginInfo = this.AccountService.Login(username, password,languageid);
            if (loginInfo != null)
            {
                this.CookieContext.UserToken = loginInfo.LoginToken;
                this.CookieContext.UserName = loginInfo.LoginName;
                this.CookieContext.UserId = loginInfo.UserID;
                this.CookieContext.LanguageID = loginInfo.LanguageID;
                return RedirectToAction("Index");
            }
            else
            {
                ModelState.AddModelError("error", "用户名或密码错误");
                return View();
            }
            //if (username == "admin")
            //{
            //    return RedirectToAction("Index");
            //}
            //else
            //{
            //    ModelState.AddModelError("error", "用户名或密码错误");
            //    return View();
            //}
        }

        public ActionResult Logout()
        {
            this.AccountService.Logout(this.CookieContext.UserToken);
            this.CookieContext.UserToken = Guid.Empty;
            this.CookieContext.UserName = string.Empty;
            this.CookieContext.UserId = 0;
            return RedirectToAction("Login");
            //HttpResponse.write("<Script Language=Javascript>window.alert('恭喜您，退出成功！');location.href='user_login.asp';</Script>");
            //window.parent.location.replace("AdminLogin.aspx");
        }

        //[AuthorizeIgnore]
        public ActionResult Index()
        {
            return View();
        }
        [AuthorizeIgnore]
        public ActionResult Top()
        {
            ViewBag.UserName = "超级管理员";
            ViewBag.AvailableBalance = "8888.00";
            return View();
        }
        [AuthorizeIgnore]
        public ActionResult Left()
        {
            return View();
        }
        [AuthorizeIgnore]
        public ActionResult Right()
        {
            return View();
        }
        [AuthorizeIgnore]
        public ActionResult RightMain()
        {
            return View();
        }
    }
}