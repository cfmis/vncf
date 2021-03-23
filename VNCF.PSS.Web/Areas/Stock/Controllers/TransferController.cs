using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Common;
using VNCF.PSS.Web.Areas.Stock.Models;
using VNCF.PSS.Web.Areas.Stock.DAL;

namespace VNCF.PSS.Web.Areas.Stock.Controllers
{
    public class TransferController : AdminControllerBase//Controller
    {
        // GET: Stock/Transfer
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Create()
        {
            return View();
        }
        public ActionResult AddTransferHead(TransferHead model)
        {
            string result = TransferDAL.UpdateOcHead(model);
            return Json(result);
        }

    }
}