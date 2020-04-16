using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using VNCF.PSS.Web.Areas.Sales.Models;
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
            if (!CheckOcHead(model.OcID))
                strSql = "Insert Into oc_OrderHead (OcID,Ver,OrderDate,CustomerID) Values ('"
                    + model.OcID + "','" + model.Ver + "','" + model.OrderDate + "','" + model.CustomerID + "')";
            else
                strSql += string.Format(@"UPDATE oc_OrderHead SET Ver='{0}',OrderDate='{1}',CustomerID='{2}' WHERE OcID='{3}'"
                    , model.Ver, model.OrderDate, model.CustomerID, model.OcID);
            strSql += string.Format(@" COMMIT TRANSACTION ");
            result = SQLHelper.ExecuteSqlUpdate(strSql);
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
            string strSql = "Select * FROM oc_OrderDetails Where OcID='" + OcID + "'";
            strSql += " ORDER BY Seq Desc";
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
                lsDetails.Add(mdj);
            }
            return lsDetails;
        }

        public static OrderHead GetOcHeadByID(string OcID)
        {
            string strSql = "Select * FROM oc_OrderHead Where OcID='" + OcID + "'";
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
            strSql = "Select * FROM oc_OrderHead Where OcID>=''";
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
    }
}