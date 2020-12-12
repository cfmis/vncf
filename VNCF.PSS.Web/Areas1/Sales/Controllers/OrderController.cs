using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using VNCF.PSS.Web.Areas.Sales.Models;
using VNCF.PSS.Web.Areas.Sales.DAL;
using VNCF.PSS.Web.Common;
using System.IO;

namespace VNCF.PSS.Web.Areas.Sales.Controllers
{
    public class OrderController : AdminControllerBase//Controller
    {
        // GET: Sales/Order
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult List(OrderHead model)
        {
            //List<OrderDetails> list = new List<OrderDetails>();
            //for (int i = 0; i < 100; i++)
            //{
            //    list.Add(new OrderDetails
            //    {
            //        ProductMo = "GBE000001" + i,
            //        ProductID = "F0-CLBVE00-" + i,
            //        ProductDescription = "產品描述" + i,
            //        OrderQty = 2000 + i,
            //        OrderUnit = "PCS",
            //        Price = 20 + i,
            //        PriceUnit = "PCS",
            //        Amount = 20000 + i,
            //        Status = "1"
            //    });
            //}
            //if (!string.IsNullOrEmpty(filter.ProductID))
            //{
            //    list = list.Where(x => x.ProductID == filter.ProductID.Trim()).ToList();
            //}
            //if (!string.IsNullOrEmpty(filter.ProductDescription))
            //{
            //    list = list.Where(x => x.ProductDescription == filter.ProductDescription.Trim()).ToList();
            //}
            //if (!string.IsNullOrEmpty(filter.ProductMo))
            //{
            //    list = list.Where(x => x.ProductMo == filter.ProductMo.Trim()).ToList();
            //}

            //构造成Json的格式传递
            //var result = new { iTotalRecords = 100, iTotalDisplayRecords = 10, data = list };
            var list = OrderDAL.GetOcDetailsByID(model.OcID);
            var result = new { total = list.Count, rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
            //return Json(null, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddList(OrderDetails model)
        {
            //listOrderInfo.Add(model);
            //var result = new { total = 100, rows = listOrderInfo };
            //return Json(result, JsonRequestBehavior.AllowGet);
            string OcID = Request["OcID"] == null ? "" : Request["OcID"].ToString();
            model.OcID = OcID;
            string result = OrderDAL.UpdateOcDetails(model);
            return Json("OK");
        }
        public ActionResult AddList1(string OcID)
        {
            //listOrderInfo.Add(model);
            //var result = new { total = 100, rows = listOrderInfo };
            //return Json(result, JsonRequestBehavior.AllowGet);
            //string OcID = Request["OcID"] == null ? "" : Request["OcID"].ToString();
            OrderDetails model = new OrderDetails();
            var sr = new StreamReader(Request.InputStream);
            var stream = sr.ReadToEnd();
            //var entity = JsonConvert.DeserializeObject<PlaceOrder>(stream);
            JArray ja = (JArray)JsonConvert.DeserializeObject(stream);
            //model.ProductMo = ja[0]["ProductMo"].ToString();
            //for (int i = 0; i < ja.Count; i++)
            //{
            //    var ja0 = ja[i];
                model.ProductMo = ja[0]["value"].ToString();
            model.ProductID = ja[1]["value"].ToString();
            //model.ProductID = ja[i]["ProductID"].ToString();
            //model.OrderQty = Convert.ToInt32(ja[i]["OrderQty"].ToString());
            //model.Price = Convert.ToDecimal(ja[i]["Price"].ToString());
            //}
            model.OcID = OcID;
            string result = OrderDAL.UpdateOcDetails(model);
            //return Json("OK");
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Create()
        {
            return View("Edit");
        }
        public ActionResult Find()
        {
            return View();
        }
        [HttpPost]
        public ActionResult EditHead(OrderHead model)
        {
            //string result = OrderDAL.UpdateOcHead(model);
            return View("Index");
        }
        public ActionResult DeleteList(string OcID, string Seq)
        {
            OrderDAL.DeleteOcDetails(OcID, Seq);
            return Json("OK");
        }

        [HttpPost]
        public ActionResult AddHead(OrderHead model)
        {
            string result = OrderDAL.UpdateOcHead(model);
            return Json(result);
        }

        public ActionResult GetOcHead(string OcID)
        {
            var list = OrderDAL.GetOcHeadByID(OcID);
            var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetOcHeadReturnList(OrderHead model)
        {
            var list = OrderDAL.GetOcHeadReturnList(model);
            var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetProduct(string ProductID)
        {
            var result = OrderDAL.GetProductByID(ProductID);
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetCustomer(string ID)
        {
            var result = OrderDAL.GetCustByID(ID);
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetUnit()
        {
            var result = OrderDAL.GetUnit();
            //var result = new { rows = list };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Print(string ID)
        {
            //SoPrintHeadWithDetails model = new SoPrintHeadWithDetails();
            //model = SoDAL.PrintSo(ID);
            //if(model==null)
            //    return Content("No Order To Print~~");
            //return View(model);
            
            string aspx = "/AspNetReports/Order.aspx?ID=" + ID;
            using (var sw = new StringWriter())
            {
                //System.Web.HttpContext.Current.Server.Execute(aspx, sw, true);
                return Content(sw.ToString());
            }



            //return View();
        }
    }
}