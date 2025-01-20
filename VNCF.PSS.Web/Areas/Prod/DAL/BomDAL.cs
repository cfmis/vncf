//using CF.SQLServer.DAL;
//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.SqlClient;
//using System.Linq;
//using System.Web;
//using VNCF.PSS.Web.Areas.Prod.Models;
//using VNCF.PSS.Web.Common;

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
    public class BomDAL
    {
        public string LanguageID = DBUtility.GetDetaultLang();
        private string ArtImagePath = DBUtility.ArtImagePath;
        private string dgerp2 = DBUtility.dgerp2;
      
        public BomDAL()
        {
            LanguageID = (LanguageID != "1") ? SQLHelper.ConvertLanguage(LanguageID) : "1"; //轉成GEO對應的語言
            //LanguageID:1越南文,2:英文(GEO),3繁體中文(GEO)
        }

        public List<ModelBomQuery> GetBomList(string BomId) // string language_id
        {
            SqlParameter[] paras = new SqlParameter[]
            {
                new SqlParameter("@within_code","0000"),
                new SqlParameter("@bom_id",BomId)
            }; 
            DataSet dts = SQLHelper.RunProcedure("usp_bom_structure", paras, "items", 20);
            DataTable dt = dts.Tables[0];
            //List<ModelBomQuery> lst = DataTableToList<ModelBomQuery>(dt);
            List<ModelBomQuery> lst = new List<ModelBomQuery>();
            string goods_name = "";
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                ModelBomQuery mdl = new ModelBomQuery();
                mdl.id = dt.Rows[i]["id"].ToString();
                mdl.parent_id = dt.Rows[i]["parent_id"].ToString();
                mdl.goods_id = dt.Rows[i]["goods_id"].ToString();
                switch (LanguageID)
                {
                    case "3":
                        goods_name = dt.Rows[i]["goods_name"].ToString();
                        break;
                    case "2":
                        goods_name = dt.Rows[i]["goods_name_en"].ToString();
                        break;
                    case "1":
                        goods_name = dt.Rows[i]["goods_name_vn"].ToString();
                        goods_name = string.IsNullOrEmpty(goods_name) ? dt.Rows[i]["goods_name"].ToString() : goods_name;
                        break;
                }
                mdl.goods_name = goods_name;
                lst.Add(mdl);
            }
            return lst;
        }

        public BomHead GetBomMostlyList(string BomId)
        {            
            SqlParameter[] paras = new SqlParameter[]
            {
                new SqlParameter("@within_code","0000"),
                new SqlParameter("@bom_id",BomId),
                new SqlParameter("@language_id",LanguageID)
            };
            DataSet dts = SQLHelper.RunProcedure("p_get_bom_head_data", paras, "items", 20);
            DataTable dt = dts.Tables[0];
            BomHead mdj = new BomHead();
            if (dt.Rows.Count > 0)
            {
                DataRow dr = dt.Rows[0];
                mdj.id = dr["id"].ToString();
                mdj.goods_id = dr["goods_id"].ToString();
                mdj.goods_name = dr["goods_name"].ToString();
                mdj.goods_name_vn = dr["goods_name_vn"].ToString();
                mdj.unit_code = dr["unit_code"].ToString();
                mdj.dept_id = dr["dept_id"].ToString();
                mdj.remark = dr["remark"].ToString();
                mdj.spec = dr["spec"].ToString();
                mdj.do_color = dr["do_color"].ToString();
                mdj.plate_effect = dr["plate_effect"].ToString();
                mdj.color_effect = dr["color_effect"].ToString();
                mdj.create_by = dr["create_by"].ToString();
                mdj.create_date = dr["create_date"].ToString();
                mdj.check_by = dr["check_by"].ToString();
                mdj.check_date = dr["check_date"].ToString();
                mdj.update_by = dr["update_by"].ToString();
                mdj.update_date = dr["update_date"].ToString();
                mdj.sanction_by = dr["sanction_by"].ToString();
                mdj.sanction_date = dr["sanction_date"].ToString();
                mdj.update_count = dr["update_count"].ToString();
                mdj.state = dr["state"].ToString();
            }   
            return mdj;
        }

        public List<BomDetail> GetBomDetailList(string BomId)
        {           
            SqlParameter[] paras = new SqlParameter[]
            {
                new SqlParameter("@within_code","0000"),
                new SqlParameter("@bom_id",BomId),
                new SqlParameter("@language_id",LanguageID)
            };
            DataSet dts = SQLHelper.RunProcedure("p_get_bom_detail_data", paras, "items", 20);
            DataTable dt = dts.Tables[0];
            List<BomDetail> lst = new List<BomDetail>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {                
                BomDetail mdj = new BomDetail();
                mdj.process = dt.Rows[i]["process"].ToString();
                mdj.goods_id = dt.Rows[i]["goods_id"].ToString();
                mdj.goods_name = dt.Rows[i]["goods_name"].ToString();
                mdj.goods_name_vn = dt.Rows[i]["goods_name_vn"].ToString();
                mdj.dosage = Convert.ToDecimal(dt.Rows[i]["dosage"].ToString());
                mdj.base_qty = Convert.ToDecimal(dt.Rows[i]["base_qty"].ToString());
                mdj.bom_nwt = Convert.ToDecimal(dt.Rows[i]["bom_nwt"].ToString());
                mdj.unit_code = dt.Rows[i]["unit_code"].ToString();
                mdj.goods_bom = dt.Rows[i]["goods_bom"].ToString();
                mdj.do_color = dt.Rows[i]["do_color"].ToString();
                mdj.plate_effect = dt.Rows[i]["plate_effect"].ToString();
                mdj.remark = dt.Rows[i]["remark"].ToString();               
                lst.Add(mdj);
            }
            return lst;
        }



    }

    

}