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
        public ActionResult Find()
        {
            return View();
        }
        public JsonResult List(TransferHead model)
        {
            //构造成Json的格式传递
            //var result = new { iTotalRecords = 100, iTotalDisplayRecords = 10, data = list };
            var list = TransferDAL.LoadTransferDetailsByID(model.ID);
            return Json(list, JsonRequestBehavior.AllowGet);
            //return Json(null, JsonRequestBehavior.AllowGet);
        }
        public ActionResult LoadTransfer(TransferHead model)
        {
            var list = TransferDAL.LoadTransfer(model);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AddTransferHead(TransferHead model)
        {
            string result = TransferDAL.UpdateTransferHead(model);
            return Json(result);
        }
        public ActionResult LoadTransferHead(string ID)
        {
            var list = TransferDAL.LoadTransferHead(ID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AddList(TransferDetails model)
        {
            //listOrderInfo.Add(model);
            //var result = new { total = 100, rows = listOrderInfo };
            //return Json(result, JsonRequestBehavior.AllowGet);
            //model.ID = Request["ID"] == null ? "" : Request["ID"].ToString();
            //string FlagID = Request["FlagID"] == null ? "" : Request["FlagID"].ToString();
            //model.LocID=Request["LocID"] == null ? "" : Request["LocID"].ToString();
            //model.NextLocID = Request["NextLocID"] == null ? "" : Request["NextLocID"].ToString();
            var result = TransferDAL.UpdateTransferDetails(model);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Delete(string ID,string Seq)
        {
            var result = TransferDAL.Delete(ID, Seq);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetDocFlag(string ID)
        {
            var list = TransferDAL.GetFlagList(ID);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
    }
}