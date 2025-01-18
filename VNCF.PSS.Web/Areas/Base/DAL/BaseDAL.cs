using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using VNCF.PSS.Web.Areas.Base.Models;
using CF.SQLServer.DAL;


namespace VNCF.PSS.Web.Areas.Base.DAL
{
    public class BaseDAL
    {
        //static string remote_db = "dbo.";
        /// <summary>
        /// 部門編碼
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public static List<Dept> GetDeptReturnList(Dept model)
        {
            string strsql = @"Select Row_Number() Over(Order By id) as row_number,* FROM bs_department Where 1=1";
            string sql_rows_total = @"Select count(*) as rows_total FROM bs_department Where 1=1";
            string strwhere = "";
            //string strSql = "";
            //strSql = "Select * FROM bs_department Where state='0'";
            if (!string.IsNullOrEmpty(model.id))
            {
                strwhere += " AND id Like '%" + model.id + "%'";
            }
            if (!string.IsNullOrEmpty(model.name))
            {
                strwhere += " AND name Like '%" + model.name + "%'";
            }
            if (!string.IsNullOrEmpty(model.english_name))
            {
                strwhere += " AND english_name Like '%" + model.english_name + "%'";
            }
            strwhere += " AND state='0'";
            strsql += strwhere;
            sql_rows_total += strwhere;

            //獲取滿足當前查找條件總的記錄數
            DataTable dtRows_Total = SQLHelper.ExecuteSqlReturnDataTable(sql_rows_total);
            int rows_tatal = int.Parse(dtRows_Total.Rows[0]["rows_total"].ToString());

            //*****處理分頁*****            
            int start_no = (model.page - 1) * model.rows + 1; //當前頁的開始行號
            int end_no = model.rows * model.page; //當前頁的結束行號
            string sqlcommon = string.Format("Select * From ({0}) as t Where t.row_number >= {1} and t.row_number <= {2}", strsql, start_no, end_no);
            //*****************
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(sqlcommon);

            //DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strsql);
            List<Dept> lsDept = new List<Dept>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                Dept mdj = new Dept();
                mdj.id = dr["id"].ToString();
                mdj.name = dr["name"].ToString();
                mdj.english_name = dr["english_name"].ToString();
                mdj.create_by = dr["create_by"].ToString();
                mdj.create_date = Convert.ToDateTime(dr["create_date"].ToString()).ToString("G");
                mdj.update_by = dr["update_by"].ToString();
                mdj.update_date = Convert.ToDateTime(dr["update_date"].ToString()).ToString("G");
                mdj.row_number = Convert.ToInt32(dr["row_number"].ToString());
                mdj.rows_total = rows_tatal;
                lsDept.Add(mdj);
            }
            return lsDept;
        }

        /// <summary>
        /// 牌子編號
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public static List<Brand> GetBrandReturnList(Brand model)
        {

            string strsql = @"Select Row_Number() Over(Order By id) as row_number,* FROM bs_brand Where 1=1";
            string sql_rows_total = @"Select count(*) as rows_total FROM bs_brand Where 1=1";
            string strwhere = "";
            if (!string.IsNullOrEmpty(model.id))
            {
                strwhere += " AND id Like '%" + model.id + "%'";
            }
            if (!string.IsNullOrEmpty(model.name))
            {
                strwhere += " AND name Like '%" + model.name + "%'";
            }
            if (!string.IsNullOrEmpty(model.english_name))
            {
                strwhere += " AND english_name Like '%" + model.english_name + "%'";
            }
            strwhere += " AND state='0'";
            strsql += strwhere;
            sql_rows_total += strwhere;

            //獲取滿足當前查找條件總的記錄數
            DataTable dtRows_Total = SQLHelper.ExecuteSqlReturnDataTable(sql_rows_total);
            int rows_tatal = Int32.Parse(dtRows_Total.Rows[0]["rows_total"].ToString());

            //*****處理分頁*****            
            int start = (model.page - 1) * model.rows + 1; //當前頁的開始行號
            int end = model.rows * model.page; //當前頁的結束行號
            string sqlcommon = string.Format("Select * From ({0}) as t Where t.row_number >= {1} and t.row_number <= {2}", strsql, start, end);
            //*****************
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(sqlcommon);

            List<Brand> lsBrand = new List<Brand>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                Brand mdj = new Brand();
                mdj.id = dr["id"].ToString();
                mdj.name = dr["name"].ToString();
                mdj.english_name = dr["english_name"].ToString();
                mdj.create_by = dr["create_by"].ToString();
                mdj.create_date = Convert.ToDateTime(dr["create_date"].ToString()).ToString("G");
                mdj.update_by = dr["update_by"].ToString();
                mdj.update_date = Convert.ToDateTime(dr["update_date"].ToString()).ToString("G");
                mdj.row_number = Convert.ToInt32(dr["row_number"].ToString());
                mdj.rows_total = rows_tatal;
                lsBrand.Add(mdj);
            }
            return lsBrand;
        }

        /// <summary>
        /// 國家代號
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public static List<Country> GetCountryList(Country model)
        {

            string strsql =
                @"Select Row_Number() Over(Order By id) as row_number,id,name,english_name,create_by,create_date,update_by,update_date
                  FROM bs_country Where 1=1";
            string sql_rows_total = @"Select count(*) as rows_total FROM bs_country Where 1=1";
            string strwhere = "";
            if (!string.IsNullOrEmpty(model.id))
            {
                strwhere += " AND id Like '%" + model.id + "%'";
            }
            if (!string.IsNullOrEmpty(model.name))
            {
                strwhere += " AND name Like '%" + model.name + "%'";
            }
            if (!string.IsNullOrEmpty(model.english_name))
            {
                strwhere += " AND english_name Like '%" + model.english_name + "%'";
            }
            strwhere += " AND state='0'";
            strsql += strwhere;
            sql_rows_total += strwhere;

            //獲取滿足當前查找條件總的記錄數
            DataTable dtRows_Total = SQLHelper.ExecuteSqlReturnDataTable(sql_rows_total);
            int rows_tatal = int.Parse(dtRows_Total.Rows[0]["rows_total"].ToString());

            //*****處理分頁******            
            int start = (model.page - 1) * model.rows + 1; //當前頁的開始行號
            int end = model.rows * model.page; //當前頁的結束行號
            string sqlcommon = string.Format("Select * From ({0}) as T Where T.row_number >= {1} and T.row_number <= {2}", strsql, start, end);
            //******************
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(sqlcommon);

            List<Country> lstCountry = new List<Country>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                Country mdj = new Country();
                mdj.id = dr["id"].ToString();
                mdj.name = dr["name"].ToString();
                mdj.english_name = dr["english_name"].ToString();
                mdj.create_by = dr["create_by"].ToString();
                mdj.create_date = !string.IsNullOrEmpty(dr["create_date"].ToString()) ? Convert.ToDateTime(dr["create_date"].ToString()).ToString("G") : null;
                mdj.update_by = dr["update_by"].ToString();
                mdj.update_date = !string.IsNullOrEmpty(dr["update_date"].ToString()) ? Convert.ToDateTime(dr["update_date"].ToString()).ToString("G") : null;
                mdj.row_number = Convert.ToInt32(dr["row_number"].ToString());
                mdj.rows_total = rows_tatal;
                lstCountry.Add(mdj);
            }
            return lstCountry;
        }

        //更新NEW&EDIT
        public static string UpdateCountry(Country model)
        {
            string result = "";
            string strsql = "";
            if (model.action == "NEW")
            {
                strsql = string.Format(@"Insert Into bs_country(within_code,id,name,english_name,state,create_by,create_date) Values('0000','{0}','{1}','{2}','0','{3}',getdate())",
                    model.id, model.name, model.english_name, model.create_by);
            }
            else
            {
                strsql = string.Format(@"Update bs_country Set name='{0}',english_name='{1}',update_by='{2}',update_date=getdate() Where within_code='0000' and id='{3}'",
                    model.name, model.english_name, model.update_by, model.id);
            }
            result = SQLHelper.ExecuteSqlUpdate(strsql);
            return result;
        }

        //刪除當前記錄
        public static string DelCountry(string id)
        {
            string result = "";
            string strsql = string.Format(@"Delete FROM bs_country WHERE within_code='0000' and id='{0}'", id);
            result = SQLHelper.ExecuteSqlUpdate(strsql);
            return result;
        }

        /// <summary>
        /// 供應商代號
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public static List<Vendor> GetVendorReturnList(Vendor model)
        {
            string strsql =
                @"Select Row_Number() Over(Order By id) as row_number,*
                  FROM bs_vendor Where 1=1";
            string sql_rows_total = @"Select count(*) as rows_total FROM bs_vendor Where 1=1";
            string strwhere = "";
            if (!string.IsNullOrEmpty(model.id))
            {
                strwhere += " AND id Like '%" + model.id + "%'";
            }
            if (!string.IsNullOrEmpty(model.name))
            {
                strwhere += " AND name Like '%" + model.name + "%'";
            }
            if (!string.IsNullOrEmpty(model.english_name))
            {
                strwhere += " AND english_name Like '%" + model.english_name + "%'";
            }
            strwhere += " AND state<>'2'";
            strsql += strwhere;
            sql_rows_total += strwhere;

            //獲取滿足當前查找條件總的記錄數
            DataTable dtRows_Total = SQLHelper.ExecuteSqlReturnDataTable(sql_rows_total);
            int rows_tatal = int.Parse(dtRows_Total.Rows[0]["rows_total"].ToString());

            //*****處理分頁*****            
            int start = (model.page - 1) * model.rows + 1; //當前頁的開始行號
            int end = model.rows * model.page; //當前頁的結束行號
            string sqlcommon = string.Format("Select * From ({0}) as T Where T.row_number >= {1} and T.row_number <= {2}", strsql, start, end);
            //*****************
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(sqlcommon);

            List<Vendor> lstCountry = new List<Vendor>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                Vendor mdj = new Vendor();
                mdj.id = dr["id"].ToString();
                mdj.name = dr["name"].ToString();
                mdj.english_name = dr["english_name"].ToString();
                mdj.sort_name = dr["sort_name"].ToString();
                mdj.logogram = dr["logogram"].ToString();
                mdj.english_logogram = dr["english_logogram"].ToString();
                mdj.english_logogram = dr["english_logogram"].ToString();
                mdj.area = dr["area"].ToString();
                mdj.email = dr["email"].ToString();
                mdj.type = dr["type"].ToString();
                mdj.fax = dr["fax"].ToString();
                mdj.phone = dr["phone"].ToString();
                mdj.c_code = dr["c_code"].ToString();
                mdj.payment_mode = dr["payment_mode"].ToString();
                mdj.payment_method = dr["payment_method"].ToString();
                mdj.linkman = dr["linkman"].ToString();
                mdj.l_phone = dr["l_phone"].ToString();
                mdj.l_mobile = dr["l_mobile"].ToString();
                mdj.money_id = dr["money_id"].ToString();
                mdj.state = dr["state"].ToString();
                mdj.add_address = dr["add_address"].ToString();


                mdj.remark = dr["remark"].ToString();
                mdj.create_by = dr["create_by"].ToString();
                mdj.create_date = !string.IsNullOrEmpty(dr["create_date"].ToString()) ? Convert.ToDateTime(dr["create_date"].ToString()).ToString("G") : null;
                mdj.update_by = dr["update_by"].ToString();
                mdj.update_date = !string.IsNullOrEmpty(dr["update_date"].ToString()) ? Convert.ToDateTime(dr["update_date"].ToString()).ToString("G") : null;
                mdj.row_number = Convert.ToInt32(dr["row_number"].ToString());
                mdj.rows_total = rows_tatal;
                lstCountry.Add(mdj);
            }
            return lstCountry;
        }
    }
}