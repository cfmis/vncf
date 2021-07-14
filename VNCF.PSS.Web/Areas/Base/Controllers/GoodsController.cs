using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Common;
using VNCF.PSS.Web.Areas.Base.DAL;

namespace VNCF.PSS.Web.Areas.Base.Controllers
{
    public class GoodsController : Controller//AdminControllerBase//:
    {

        List<GoodsEntity> goosdList = new List<GoodsEntity>
         {
             new GoodsEntity() { ID = 001,Name = "水",Type = 1,Price = 3},
             new GoodsEntity() { ID = 002,Name = "牛奶",Type = 1,Price = 10},
             new GoodsEntity() { ID = 003,Name = "面包",Type = 2,Price = 15}
         };
        // GET: Base/Goods
        public ActionResult Index()
        {
            return View();
            //return View("Create");
            //return View("Edit");
        }
        public ActionResult List()
        {
            return View("Index");
            //return View("Edit");
            //return View("Create");
            //return View("Vue");
        }
        public ActionResult Edit()
        {
            return View();
        }
        public ActionResult Create()
        {
            return View();
        }
        public ActionResult Vue()
        {
            return View();
        }
        [HttpGet]
        public JsonResult GetGoodsType()
        {
            List<int> goodsType = new List<int>();
            foreach (var item in goosdList)
            {
                if (!goodsType.Contains(item.Type))
                {
                    goodsType.Add(item.Type);
                }
            }
            return Json(goodsType, JsonRequestBehavior.AllowGet);
        }
        //[HttpPost]
        public JsonResult GetAllGoods()
        {
            return Json(goosdList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult SearchGoods(Goods searchParams)
        {
            NewBaseDAL nbd = new NewBaseDAL();
            //var goodsList = BaseDataDAL.GetGoods("");
            var goodsList = nbd.SearchGoods(searchParams);
            return Json(goodsList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult AddGoods(Goods updateParams)
        {
            NewBaseDAL nbd = new NewBaseDAL();
            //var goodsList = BaseDataDAL.GetGoods("");
            var goodsList = nbd.UpdateGoods(updateParams);
            return Json(goodsList, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
         public JsonResult GetGoods(int id)
         {
             var entity = goosdList.Where(g => g.ID == id).FirstOrDefault();
             if (entity != null)
             {
                 return Json(new ReturnJsonInfo(500, "success!", entity));
             }
             return Json(new ReturnJsonInfo(400, "error!", null));
         }
        [HttpPost]
         public JsonResult UpdateGoods(GoodsEntity entity)
         {
             if (entity!=null)
             {
                 var goodsEntiy = goosdList.FirstOrDefault(g => g.ID == entity.ID);
                 if (goodsEntiy!=null)
                 {
                     goodsEntiy = entity;
                     return Json(new ReturnJsonInfo(500, "success!", goosdList));
                 }
                 goosdList.Add(entity);
                 return Json(new ReturnJsonInfo(500, "success!", goosdList));
             }
             return Json(new ReturnJsonInfo(400, "error!",null));
         }

        [HttpPost]
         public JsonResult DelectGoods(int id)
         {
             var entity = goosdList.Where(g => g.ID == id).FirstOrDefault();
             if (entity != null)
             {
                 goosdList.Remove(entity);
                 return Json(new ReturnJsonInfo(500, "success!", goosdList));
             }
             return Json(new ReturnJsonInfo(400, "error!",null));
         }

    }
}