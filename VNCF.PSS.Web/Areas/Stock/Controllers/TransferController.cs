using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Common;
using VNCF.PSS.Web.Areas.Stock.Models;
using VNCF.PSS.Web.Areas.Stock.DAL;
using VNCF.PSS.Web.Areas.Base.DAL;
using System.Data;

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
        //查找移交單
        public ActionResult SearchTransfer(QueryTransferParas model)
        {
            var list = TransferDAL.SearchTransfer(model);
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        //流水帳
        [HttpPost]
        public ActionResult QueryTransfer(QueryTransferParas model)
        {
            var list = TransferDAL.QueryTransfer(model);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //庫存
        public ActionResult StockList()
        {
            return View();
            //var list = TransferDAL.QueryTransfer(model);
            //return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult StockList(QueryTransferParas model)
        {
            var list = TransferDAL.QueryStockList(model);
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddTransferHead(TransferHead model)
        {
            string result = TransferDAL.UpdateTransferHead(model);
            return Json(result);
        }

        //[HttpPost]
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

        [HttpPost]
        public ActionResult Delete(string ID,string Seq)
        {
            var result = TransferDAL.Delete(ID, Seq);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetDocFlagReturnString(string ID)
        {
            DataTable dt = BaseDataDAL.GetDocFlayReturnTable("wh_transfer", ID);
            var val=dt.Rows[0]["flag2"].ToString().Trim();
            return Json(val, JsonRequestBehavior.AllowGet);
        }
    }
}