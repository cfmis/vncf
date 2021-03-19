using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Areas.Base.Models;

namespace VNCF.PSS.Web.Areas.Base.DAL
{
    public class BaseDataDAL
    {
        public static DataTable GetLoc()
        {
            string strSql = "Select ID,Name,Engname,VieName " +
            " FROM bs_Loc Order By ID";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            return dt;
        }
        public static DataTable GetUnitReturnDataTable()
        {
            string strSql = "Select ID,Name,English_name,VieName " +
            " FROM bs_Unit Order By ID";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            return dt;
        }
        public static DataTable GetDocFlag(string DocFlag)
        {
            string strSql = "Select ID,Name,Engname,VieName " +
            " FROM bs_DocFlag Order By id";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            //List<DocFlag> lsModel = new List<DocFlag>();
            //for (int i = 0; i < dt.Rows.Count; i++)
            //{
            //    DataRow dr = dt.Rows[i];
            //    DocFlag mdj = new DocFlag();
            //    mdj.ID = dr["ID"].ToString();
            //    mdj.Name = dr["Name"].ToString();
            //    lsModel.Add(mdj);
            //}
            //return lsModel;
            return dt;
        }

        public static it_goods GetGoodsByID(string ProductID)
        {
            string strSql = "Select id,name,english_name " +
            " FROM it_goods Where type='" + "0001" + "' AND id='" + ProductID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            DataRow dr = dt.Rows[0];
            it_goods mdj = new it_goods();
            mdj.ProductID = dr["id"].ToString();
            mdj.ProductCdesc = dr["name"].ToString();
            return mdj;
        }
        public static List<bs_unit> GetUnit()
        {
            string strSql = "Select id,name,english_name " +
            " FROM bs_unit Order By id";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<bs_unit> lsModel = new List<bs_unit>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                bs_unit mdj = new bs_unit();
                mdj.id = dr["id"].ToString();
                mdj.name = dr["name"].ToString();
                lsModel.Add(mdj);
            }
            return lsModel;
        }

        public static bs_customer GetCustByID(string ID)
        {
            string strSql = "Select id,name,english_name " +
            " FROM bs_customer Where id='" + ID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            DataRow dr = dt.Rows[0];
            bs_customer mdj = new bs_customer();
            mdj.id = dr["id"].ToString();
            mdj.CustCname = dr["name"].ToString();
            return mdj;
        }
    }
}