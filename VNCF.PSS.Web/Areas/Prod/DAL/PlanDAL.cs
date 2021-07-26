using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Areas.Prod.Models;
using VNCF.PSS.Web.Common;
using System.Data.SqlClient;

namespace VNCF.PSS.Web.Areas.Prod.DAL
{
    public class PlanDAL
    {
        public string LanguageID = "";
        public PlanDAL()
        {
            //string LangID = "0";
            try
            {
                LanguageID = AdminUserContext.Current.LoginInfo.LanguageID;
            }
            catch
            {
                LanguageID = "0";
            }
        }
        public PlanHead GetOrderByMo(string ProductMo)
        {
            string strSql = "Select a.OcID,a.OrderDate,a.CustomerID,b.ProductMo,b.ProductID,b.OrderQty,b.OrderUnit,b.ProductRemark " +
            " FROM oc_OrderHead a " +
            " INNER JOIN oc_OrderDetails b ON a.OcID=b.OcID" +
            " Where a.OcID>='" + "" + "'";
            strSql += " AND b.ProductMo= '" + ProductMo + "'";
            string LangID = LanguageID;
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            DataRow dr = dt.Rows[0];
            PlanHead mdj = new PlanHead();
            mdj.ProductMo= dr["ProductMo"].ToString();
            mdj.OrderDate = dr["OrderDate"].ToString();
            mdj.CustomerID = dr["CustomerID"].ToString();
            mdj.GoodsID = dr["ProductID"].ToString();
            mdj.OrderQty = Convert.ToDecimal(dr["OrderQty"].ToString());
            mdj.OrderUnit = dr["OrderUnit"].ToString();
            mdj.ProductRemark = dr["ProductRemark"].ToString();
            return mdj;
        }
    }
}