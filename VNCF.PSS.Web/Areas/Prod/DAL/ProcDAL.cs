using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Areas.Prod.Models;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Prod.DAL
{
    
    public class ProcDAL
    {
        public string LanguageID = DBUtility.GetDetaultLang();
        private string ArtImagePath = DBUtility.ArtImagePath;
        private string dgerp2 = DBUtility.dgerp2;
        //GetGoodsFromPlan

        public List<ListDataModels> GetGoodsFromPlan(string ProductMo)
        {
            string strSql = "Select a.GoodsID,d.picture_name,";
            if (LanguageID == "0")
                strSql += "c.name AS GoodsCname";
            else if (LanguageID == "1")
                strSql += "c.english_name AS GoodsCname";
            else
                strSql += "e.vn_name1 AS GoodsCname";
            strSql += " From pd_PlanDetails a " +
            " Left Join it_goods c ON a.GoodsID=c.id " +
            " Left Join cd_pattern_details d ON c.blueprint_id=d.id " +
            " Left Join it_goods_vn e ON a.GoodsID=e.id" +
            " Where a.ProductMo= '" + ProductMo + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<ListDataModels> lsGoods = new List<ListDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                ListDataModels mdj = new ListDataModels();
                mdj.label = dr["GoodsID"].ToString().Trim() + " / " + dr["GoodsCname"].ToString().Trim();
                mdj.value = dr["GoodsID"].ToString();
                lsGoods.Add(mdj);
            }
            return lsGoods;
        }
    }
}