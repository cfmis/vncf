using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Areas.Prod.Models;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Prod.DAL
{
    public class QueryDG
    {
        public string LanguageID = DBUtility.GetDetaultLang();
        private string ArtImagePath = DBUtility.ArtImagePath;
        private string dgerp2 = DBUtility.dgerp2;
        private string within_code = DBUtility.within_code;

        public List<PlanDetails> GetPlanDetailsByMo(string ProductMo)
        {
            string strSql = "";
            //strSql += " Select DISTINCT aa.* " +
            //    " From (";
            strSql += "Select a.id,a.ver,a.mo_id,b.sequence_id,b.goods_id,b.wp_id,b.next_wp_id" +
                ",Convert(Int,b.prod_qty) AS prod_qty,c.do_color,c.blueprint_id,f.picture_name,f.sequence_id AS art_seq " +
                ",b.flag,b.flag As flag_sort";
            if (LanguageID == "0")
                strSql += ",c.name AS GoodsCname,d.name AS WipDesc,e.name AS NextWipDesc";
            else if (LanguageID == "1")
                strSql += ",c.english_name AS GoodsCname,d.english_name AS WipDesc,e.english_name AS NextWipDesc";
            else
                strSql += ",c.english_name AS GoodsCname,d.english_name AS WipDesc,d.english_name AS NextWipDesc";
            strSql += " Into #tb_wip01 ";
            strSql += " FROM " + dgerp2 + "jo_bill_mostly a" +
                " Inner Join " + dgerp2 + "jo_bill_goods_details b ON a.within_code=b.within_code And a.id=b.id And a.ver=b.ver " +
                " Left Join " + dgerp2 + "it_goods c ON b.within_code=c.within_code And b.goods_id=c.id" +
                " Left Join " + dgerp2 + "cd_department d ON b.within_code=d.within_code AND b.wp_id=d.id " +
                " Left Join " + dgerp2 + "cd_department e ON b.within_code=e.within_code AND b.next_wp_id=e.id "+
                " Left Join " + dgerp2 + "cd_pattern_details f ON c.within_code=f.within_code AND c.blueprint_id=f.id ";
            strSql += " Where a.within_code='" + within_code + "' And a.mo_id='" + ProductMo + "'";
            strSql += " Update #tb_wip01 Set flag_sort='0'+flag_sort Where LEN(flag_sort)< 3 ";
            //strSql += " ) aa";
            //strSql += " Where bb.sequence_id='0001h' ";
            strSql += " Select a.* "+
                " From #tb_wip01 a " +
                " Inner Join (Select id,ver,sequence_id,Min(art_seq) AS art_seq From #tb_wip01 Group By id,ver,sequence_id ) b " +
                " On a.id=b.id And a.ver=b.ver And a.sequence_id=b.sequence_id And a.art_seq=b.art_seq ";
            strSql += " Order By a.flag_sort ";
            strSql += " Drop Table #tb_wip01 ";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<PlanDetails> lsPlanDetails = new List<PlanDetails>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                PlanDetails mdjPlanDetails = new PlanDetails();
                DataRow dr = dt.Rows[i];
                mdjPlanDetails.ID = dr["id"].ToString();
                mdjPlanDetails.ProductMo = dr["mo_id"].ToString();
                mdjPlanDetails.Ver = Convert.ToInt32(dr["Ver"].ToString());
                mdjPlanDetails.Seq = dr["sequence_id"].ToString();
                mdjPlanDetails.flag = dr["flag"].ToString();
                mdjPlanDetails.GoodsID = dr["goods_id"].ToString();
                mdjPlanDetails.GoodsCname = dr["GoodsCname"].ToString();
                mdjPlanDetails.WipID = dr["wp_id"].ToString();
                mdjPlanDetails.WipDesc = dr["WipDesc"].ToString();
                mdjPlanDetails.NextWipID = dr["next_wp_id"].ToString();
                mdjPlanDetails.NextWipDesc = dr["NextWipDesc"].ToString();
                mdjPlanDetails.RequestQty = Convert.ToInt32(dr["prod_qty"].ToString());
                mdjPlanDetails.do_color = dr["do_color"].ToString();
                mdjPlanDetails.ArtImageUrl = ArtImagePath + (dr["picture_name"] != null ? dr["picture_name"].ToString().Trim().Replace("\\", "/") : "");//"AAAA/A888020.bmp";// 
                lsPlanDetails.Add(mdjPlanDetails);
            }
            return lsPlanDetails;
        }
        public List<PlanDetails> GetPlanDetailsByMoPart(string ID,string Seq)
        {

            string strSql = "Select a.sequence_id,a.materiel_id,a.location" +
                ",Convert(Int,a.fl_qty) AS prod_qty,b.do_color";
            if (LanguageID == "0")
                strSql += ",b.name AS GoodsCname,c.name AS WipDesc";
            else if (LanguageID == "1")
                strSql += ",b.english_name AS GoodsCname,c.english_name AS WipDesc";
            else
                strSql += ",b.english_name AS GoodsCname,c.english_name AS WipDesc";
            strSql += " FROM " + dgerp2 + "jo_bill_materiel_details a" +
                " Left Join " + dgerp2 + "it_goods b ON a.within_code=b.within_code And a.materiel_id=b.id" +
                " Left Join " + dgerp2 + "cd_department c ON a.within_code=c.within_code AND a.location=c.id ";
            strSql += " Where a.within_code='" + within_code + "' And a.id='" + ID + "' And a.upper_sequence='" + Seq + "'";
            strSql += " Order By a.sequence_id ";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<PlanDetails> lsPlanDetails = new List<PlanDetails>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                PlanDetails mdjPlanDetails = new PlanDetails();
                DataRow dr = dt.Rows[i];
                mdjPlanDetails.Seq = dr["sequence_id"].ToString();
                mdjPlanDetails.GoodsID = dr["materiel_id"].ToString();
                mdjPlanDetails.GoodsCname = dr["GoodsCname"].ToString();
                mdjPlanDetails.WipID = dr["location"].ToString();
                mdjPlanDetails.WipDesc = dr["WipDesc"].ToString();
                mdjPlanDetails.RequestQty = Convert.ToInt32(dr["prod_qty"].ToString());
                mdjPlanDetails.do_color = dr["do_color"].ToString();
                lsPlanDetails.Add(mdjPlanDetails);
            }
            return lsPlanDetails;
        }


        public List<OrderDataDg> GetOrderData(string mo_id,string goods_id,string brand_id,string top_rec)
        {
            string strSql = "";
            //strSql += " Select DISTINCT aa.* " +
            //    " From (";
            strSql += "Select ";
            if (top_rec == "")
                top_rec = "500";
            strSql +=" Top "+ top_rec+" a.id,a.ver,Convert(Varchar(20),a.order_date,111) As order_date,b.mo_id,b.sequence_id,b.goods_id,b.brand_id " +
                ",c.do_color";
            if (LanguageID == "0")
                strSql += ",c.name AS GoodsCname";
            else if (LanguageID == "1")
                strSql += ",c.english_name AS GoodsCname";
            else
                strSql += ",c.english_name AS GoodsCname";
            strSql += " FROM " + dgerp2 + "so_order_manage a" +
                " Inner Join " + dgerp2 + "so_order_details b ON a.within_code=b.within_code And a.id=b.id And a.ver=b.ver " +
                " Left Join " + dgerp2 + "it_goods c ON b.within_code=c.within_code And b.goods_id=c.id " ;
            strSql += " Where a.within_code='" + within_code + "'";
            if (mo_id != "")
                strSql += " And b.mo_id='" + mo_id + "'";
            if (goods_id != "")
                strSql += "  And b.goods_id Like " + "'%" + goods_id + "%'";
            if (brand_id != "")
                strSql += " And b.brand_id='" + brand_id + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<OrderDataDg> lsOrderDetails = new List<OrderDataDg>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                OrderDataDg mdjOrderDetails = new OrderDataDg();
                DataRow dr = dt.Rows[i];
                mdjOrderDetails.ID = dr["id"].ToString();
                mdjOrderDetails.mo_id = dr["mo_id"].ToString();
                mdjOrderDetails.Ver = Convert.ToInt32(dr["Ver"].ToString());
                mdjOrderDetails.sequence_id = dr["sequence_id"].ToString();
                mdjOrderDetails.goods_id = dr["goods_id"].ToString();
                mdjOrderDetails.goods_cname = dr["GoodsCname"].ToString();
                mdjOrderDetails.brand_id = dr["brand_id"].ToString();
                mdjOrderDetails.do_color = dr["do_color"].ToString();
                mdjOrderDetails.order_date = dr["order_date"].ToString();
                lsOrderDetails.Add(mdjOrderDetails);
            }
            return lsOrderDetails;
        }

        public List<OrderDataDg> GetOrderDataPart(string ID,string Ver,string sequence_id)
        {
            string strSql = "";
            //strSql += " Select DISTINCT aa.* " +
            //    " From (";
            strSql += "Select a.id,a.ver,a.sequence_id,a.goods_id " +
                ",a.primary_key,b.do_color";
            if (LanguageID == "0")
                strSql += ",b.name AS GoodsCname";
            else if (LanguageID == "1")
                strSql += ",b.english_name AS GoodsCname";
            else
                strSql += ",b.english_name AS GoodsCname";
            strSql += " FROM " + dgerp2 + "so_order_bom a" +
                " Left Join " + dgerp2 + "it_goods b ON a.within_code=b.within_code And a.goods_id=b.id ";
            strSql += " Where a.within_code='" + within_code + "' And a.id='" + ID + "'" +
                " And a.ver='" + Ver + "'" + " And a.upper_sequence='" + sequence_id + "'";
            strSql += " Order By a.primary_key Desc";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<OrderDataDg> lsOrderDetails = new List<OrderDataDg>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                OrderDataDg mdjOrderDetails = new OrderDataDg();
                DataRow dr = dt.Rows[i];
                mdjOrderDetails.ID = dr["id"].ToString();
                mdjOrderDetails.Ver = Convert.ToInt32(dr["Ver"].ToString());
                mdjOrderDetails.sequence_id = (i + 1).ToString().PadLeft(2, '0');// dr["sequence_id"].ToString();
                mdjOrderDetails.goods_id = dr["goods_id"].ToString();
                mdjOrderDetails.goods_cname = dr["GoodsCname"].ToString();
                mdjOrderDetails.do_color = dr["do_color"].ToString();
                if (dr["primary_key"].ToString() == "1")
                    mdjOrderDetails.part_flag = "Y";
                else
                    mdjOrderDetails.part_flag = "";
                lsOrderDetails.Add(mdjOrderDetails);
            }
            return lsOrderDetails;
        }
    }

    
}