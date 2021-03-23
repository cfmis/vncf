using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using VNCF.PSS.Web.Areas.Sales.Models;
//using VNCF.PSS.Web.Areas.Base.DAL;
using CF.SQLServer.DAL;

namespace VNCF.PSS.Web.Areas.Sales.DAL
{
    public class OrderDAL
    {
        public static string UpdateOcHead(OrderHead model)
        {
            string result = "";
            string strSql = "";
            strSql += string.Format(@" SET XACT_ABORT  ON ");
            strSql += string.Format(@" BEGIN TRANSACTION ");
            string OcID = "";
            if (model.OcID == "" || model.OcID == null)
            {
                Random rd = new Random();
                string dateTimeStr = System.DateTime.Now.ToString("yyyy/MM/dd hh:MM:dd");
                OcID = dateTimeStr.Substring(0,4)+ dateTimeStr.Substring(5, 2)+ dateTimeStr.Substring(8, 2)
                    + dateTimeStr.Substring(11, 2)+ dateTimeStr.Substring(14, 2)+ dateTimeStr.Substring(17, 2);// rd.Next(1, 1000000000).ToString();
            }
            else
                OcID = model.OcID;
            if (!CheckOcHead(OcID))
                strSql += "Insert Into oc_OrderHead (OcID,Ver,OrderDate,CustomerID) Values ('"
                    + OcID + "','" + model.Ver + "','" + model.OrderDate + "','" + model.CustomerID + "')";
            else
                strSql += string.Format(@"UPDATE oc_OrderHead SET Ver='{0}',OrderDate='{1}',CustomerID='{2}' WHERE OcID='{3}'"
                    , model.Ver, model.OrderDate, model.CustomerID, OcID);
            strSql += string.Format(@" COMMIT TRANSACTION ");
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            result = OcID;
            return result;
        }
        private static bool CheckOcHead(string OcID)
        {
            bool result = true;
            string strSql = "Select OcID FROM oc_OrderHead Where OcID='" + OcID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = true;
            else
                result = false;
            return result;
        }
        public static List<OrderDetails> GetOcDetailsByID(string OcID)
        {
            string strSql = "Select a.*,b.name,b.english_name,c.picture_name" +
                " FROM oc_OrderDetails a " +
                " Left Join it_goods b ON a.ProductID=b.id" +
                " Left Join cd_pattern_details c On b.blueprint_id=c.id" +
                " Where a.OcID='" + OcID + "'";
            strSql += " ORDER BY a.Seq Desc";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<OrderDetails> lsDetails = new List<OrderDetails>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                OrderDetails mdj = new OrderDetails();
                DataRow dr = dt.Rows[i];
                mdj.Seq = dr["Seq"].ToString();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.ProductID = dr["ProductID"].ToString();
                mdj.OrderQty = Convert.ToInt32(dr["OrderQty"]);
                mdj.OrderUnit = dr["OrderUnit"].ToString();
                mdj.Price = Convert.ToDecimal(dr["Price"]);
                mdj.PriceUnit = dr["PriceUnit"].ToString();
                mdj.ProductCdesc = dr["name"].ToString();//"file:///"  + Server.MapPath("~")  +"~/Images/login.jpg";//
                mdj.ArtImage = "/art/artwork/" + dr["picture_name"].ToString().Trim().Replace("\\", "/");//"AAAA/A888020.bmp";// 
                lsDetails.Add(mdj);
            }
            return lsDetails;
        }

        public static OrderHead GetOcHeadByID(string OcID)
        {
            string strSql = "Select OcID,Ver,Convert(Varchar(10),OrderDate,111) AS OrderDate,CustomerID " +
            " FROM oc_OrderHead Where OcID='" + OcID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            DataRow dr = dt.Rows[0];
            OrderHead mdj = new OrderHead();
            mdj.OcID = dr["OcID"].ToString();
            mdj.OrderDate = dr["OrderDate"].ToString();
            mdj.Ver = Convert.ToInt32(dr["Ver"]);
            mdj.CustomerID = dr["CustomerID"].ToString();
            return mdj;
        }
        public static List<OrderHead> GetOcHeadReturnList(OrderHead model)
        {
            string strSql = "";
            strSql = "Select * " +
                " FROM oc_OrderHead Where OcID>=''";
            if (model.OcID == null)
                strSql += " AND OcID='ZZZZZZZZZ' ";
            else
                strSql += " AND OcID Like '%" + model.OcID + "%'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<OrderHead> lsOrder = new List<OrderHead>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                OrderHead mdj = new OrderHead();
                mdj.OcID = dr["OcID"].ToString();
                mdj.OrderDate = dr["OrderDate"].ToString();
                mdj.Ver = Convert.ToInt32(dr["Ver"]);
                mdj.CustomerID = dr["CustomerID"].ToString();
                lsOrder.Add(mdj);
            }
            return lsOrder;
        }
        public static string UpdateOcDetails(OrderDetails model)
        {
            string result = "";
            string strSql = "";
            string Seq = GetMaxSeq(model.OcID);
            strSql = "Insert Into oc_OrderDetails (OcID,Seq,ProductMo,ProductID,OrderQty,OrderUnit,Price,PriceUnit) Values ('"
                + model.OcID + "','" + Seq + "','" + model.ProductMo + "','" + model.ProductID + "','" + model.OrderQty
                 + "','" + model.OrderUnit + "','" + model.Price + "','" + model.PriceUnit + "')";
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;
        }
        private static string GetMaxSeq(string OcID)
        {
            string result = "";
            string strSql = "";
            strSql = "Select MAX(Seq) AS Seq FROM oc_OrderDetails Where OcID='" + OcID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = dt.Rows[0]["Seq"].ToString() != "" ? (Convert.ToInt32(dt.Rows[0]["Seq"]) + 1).ToString().PadLeft(3, '0') : "001";
            else
                result = "001";
            return result;
        }

        public static string DeleteOcDetails(string OcID, string Seq)
        {
            string result = "";
            string strSql = "";
            strSql = "Delete FROM oc_OrderDetails Where OcID='" + OcID + "' AND Seq='" + Seq + "'";
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;
        }
        //public static it_goods GetProductByID(string ProductID)
        //{
        //    string strSql = "Select id,name,english_name " +
        //    " FROM it_goods Where type='" + "0001" + "' AND id='" + ProductID + "'";
        //    DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
        //    DataRow dr = dt.Rows[0];
        //    it_goods mdj = new it_goods();
        //    mdj.ProductID = dr["id"].ToString();
        //    mdj.ProductCdesc = dr["name"].ToString();
        //    return mdj;
        //}
        //public static bs_customer GetCustByID(string ID)
        //{
        //    string strSql = "Select id,name,english_name " +
        //    " FROM bs_customer Where id='" + ID + "'";
        //    DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
        //    DataRow dr = dt.Rows[0];
        //    bs_customer mdj = new bs_customer();
        //    mdj.id = dr["id"].ToString();
        //    mdj.CustCname = dr["name"].ToString();
        //    return mdj;
        //}
        //public static List<bs_unit> GetUnit()
        //{
        //    string strSql = "Select id,name,english_name " +
        //    " FROM bs_unit Order By id";
        //    DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
        //    List<bs_unit> lsModel = new List<bs_unit>();
        //    for (int i = 0; i < dt.Rows.Count; i++)
        //    {
        //        DataRow dr = dt.Rows[i];
        //        bs_unit mdj = new bs_unit();
        //        mdj.id = dr["id"].ToString();
        //        mdj.name = dr["name"].ToString();
        //        lsModel.Add(mdj);
        //    }
        //    return lsModel;
        //}
    }
}