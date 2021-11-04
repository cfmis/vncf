using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Common;
using System.Data.SqlClient;
using System.Text;

namespace VNCF.PSS.Web.Areas.Base.DAL
{
    public class BaseDataDAL
    {
        public static string LanguageID = AdminUserContext.Current.LoginInfo.LanguageID;


        
        public static List<BaseDataModels> GetLoc()
        {
            string strSql = "Select ID,Name,Engname,VieName " +
            " FROM bs_Loc Order By ID";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<BaseDataModels> lsModel = new List<BaseDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                BaseDataModels mdj = new BaseDataModels();
                mdj.ID = dr["id"].ToString();
                mdj.Name = dr["name"].ToString();
                lsModel.Add(mdj);
            }
            return lsModel;
        }
        //public static DataTable GetUnitReturnDataTable()
        //{
        //    string strSql = "Select ID,Name,English_name,VieName " +
        //    " FROM bs_Unit Order By ID";
        //    DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
        //    return dt;
        //}
        public static List<BaseDataModels> GetDocFlag(string DocType)
        {
            string strSql = "Select ID,Name,Engname,VieName " +
            " FROM bs_DocFlag " +
            " Where DocType='" + DocType + "'" +
            " Order By id";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<BaseDataModels> lsModel = new List<BaseDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                BaseDataModels mdj = new BaseDataModels();
                mdj.ID = dr["ID"].ToString();
                mdj.Name = dr["Name"].ToString();
                lsModel.Add(mdj);
            }
            return lsModel;
            //return dt;
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
        public static List<Goods> GetGoods(string ProductID)
        {
            string strSql = "Select top 10 id,name,english_name " +
            " FROM it_goods Where type='" + "0001" + "' AND id Like '" + "%" + ProductID + "%" + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            DataRow dr = dt.Rows[0];
            List<Goods> lsGoods = new List<Goods>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                Goods mdj = new Goods();
                mdj.goods_id = dr["id"].ToString();
                mdj.goods_cname = dr["name"].ToString();
                mdj.goods_ename = dr["english_name"].ToString();
                lsGoods.Add(mdj);
            }
            return lsGoods;
        }
        public static List<BaseDataModels> GetUnit(string kind)
        {
            string strSql = "Select ID,Name,english_name " +
            " FROM bs_unit Where kind='" + kind + "' Order By id";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<BaseDataModels> lsModel = new List<BaseDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                BaseDataModels mdj = new BaseDataModels();
                mdj.ID = dr["id"].ToString();
                mdj.Name = dr["name"].ToString();
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

        //返回基礎資料,供下拉列表框使用
        //前端是以ID值存儲至數據庫
        public static List<BaseDataModels> GetBaseInfoReturnList(string strTableName)
        {
            string strSql = "";
            string strFieldName = "";
            if (LanguageID == "0")
                strFieldName = "name";
            else
                strFieldName = "english_name";

            switch (strTableName)
            {
                case "bs_personnel"://跟單員
                    strTableName = "bs_sales";
                    strSql = string.Format(@"Select id,id +' ('+{0}+')' as name FROM {1} Where ISNULL(abbrev_id,'')='' and state<>'2' order by id", strFieldName, strTableName);
                    break;
                case "bs_sales"://營業員
                    strSql = string.Format(@"Select id,id +' ('+{0}+')' as name FROM {1} Where ISNULL(abbrev_id,'')<>'' and state<>'2' order by id", strFieldName, strTableName);
                    break;
                case "sy_bill_state"://單據狀態
                    strSql = string.Format(@"SELECT id,matter as name FROM sy_bill_state WHERE language_id='{0}'", LanguageID);
                    break;
                case "bs_type_zd"://取色辦
                    strTableName = "bs_type";
                    strSql = string.Format(@"SELECT  id,id +' ('+{0}+')' as name FROM {1} WHERE group_id='ZD' and state<>'2' order by id", strFieldName, strTableName);
                    break;
                case "bs_vendor"://取採購供應商                    
                    strSql = string.Format(@"SELECT id,id +' ('+{0}+')' as name FROM {1} WHERE type<>'OP' and state<>'2' order by id", strFieldName, strTableName);
                    break;
                case "bs_type_1"://制單種類
                case "bs_type_2"://做貨部門
                case "bs_type_3"://營業員組別
                    string group_id = "";
                    switch (strTableName)
                    {
                        case "bs_type_1":
                            group_id = "1";
                            break;
                        case "bs_type_2":
                            group_id = "2";
                            break;
                        case "bs_type_3":
                            group_id = "3";
                            break;
                    }
                    strSql = string.Format(@"SELECT id,id+'('+name+')' as name FROM bs_type WHERE group_id='{0}' and state<>'2' order by id", group_id);
                    break;
                default://大多數的
                    strSql = string.Format(@"Select id,id +' ('+{0}+')' as name FROM {1} Where state<>'2' order by id", strFieldName, strTableName);
                    break;
            }

            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<BaseDataModels> lstBase = new List<BaseDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                BaseDataModels objModel = new BaseDataModels();
                objModel.ID = dt.Rows[i]["id"].ToString();
                objModel.Name = dt.Rows[i]["name"].ToString();
                lstBase.Add(objModel);
            }
            return lstBase;
        }

        //返回基礎資料,供下拉列表框使用
        //前端是以Name值存儲至數據庫
        public static List<BaseDataModels> GetBaseInfoByNameReturnList(string strTableName)
        {
            string strSql = "";
            switch (strTableName)
            {
                case "bs_company_accounts"://銀行賬號
                    strSql = string.Format("SELECT accounts as id FROM {0} WHERE state<> '2' order by abbreviate", strTableName);
                    break;
                case "bs_customer"://洋行
                    strSql = "Select 'N/A' as id Union Select id FROM bs_customer Where state='1' and customer_group='2' order by id";
                    break;
                case "bs_unit"://數量單位
                    strSql = "Select id FROM bs_unit Where kind = '05' and state='0' order by id";
                    break;
                case "bs_unit_wt"://重量單位
                    strSql = "Select id FROM bs_unit Where kind = '03' and state='0' order by id";
                    break;
                case "bs_unit_all"://單位All
                    strSql = "Select id FROM bs_unit Where state='0' order by kind DESC,id";
                    break;
                case "bs_type_1"://制單種類
                case "bs_type_2"://做貨部門
                case "bs_type_3"://營業員組別
                    string group_id = "";
                    switch (strTableName)
                    {
                        case "bs_type_1":
                            group_id = "1";
                            break;
                        case "bs_type_2":
                            group_id = "2";
                            break;
                        case "bs_type_3":
                            group_id = "3";
                            break;
                    }
                    strSql = string.Format(@"SELECT id FROM bs_type WHERE group_id='{0}' and state<>'2' order by id", group_id);
                    break;               
                default:
                    strSql = string.Format("Select english_name as id FROM {0} Where state<>'2' order by id", strTableName);
                    break;
            }
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<BaseDataModels> lstBase = new List<BaseDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                BaseDataModels objModel = new BaseDataModels();
                objModel.ID = dt.Rows[i]["id"].ToString();
                objModel.Name = "";               
                lstBase.Add(objModel);
            }
            return lstBase;
        }              

        public static string GetSystemMessage(string ID)
        {
            string result = "";
            //var LanguageID = AdminUserContext.Current.LoginInfo.LanguageID;
            string strSql = "Select Name From sy_Message Where ID='" + ID + "' And LangID='" + LanguageID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = dt.Rows[0]["Name"].ToString();
            return result;
        }

        public static DataTable GetDocFlayReturnTable(string DocType,string ID)
        {
            string strSql = "";
            strSql = "Select ID,Name,flag0,flag1,flag2,fields1,fields2 From bs_DocFlag Where DocType='" + DocType + "' And ID='" + ID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            return dt;
        }


        //當前服務器日期及時間
        public static CurrentDateTime GetCurrentDateList()
        {
            string strSql = "Select CONVERT(varchar(20),getdate(),23) AS curr_date,CONVERT(varchar(20),getdate(),120) AS curr_datetime";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            CurrentDateTime objModel = new CurrentDateTime();
            objModel.current_date = dt.Rows[0]["curr_date"].ToString();
            objModel.current_datetime = dt.Rows[0]["curr_datetime"].ToString();
            return objModel;
        }

        public static dynamic LoadFormLanguage(string WebFormName)//List<List<string>>
        {
            string strSql = "p_LoadFormLanguage";
            SqlParameter[] parameters = {new SqlParameter("@WebFormName", WebFormName)
                    ,new SqlParameter("@LanguageID", LanguageID)
                    };
            DataTable dt = SQLHelper.ExecuteProcedureRetrunDataTable(strSql, parameters);
            string ReturnValue = string.Empty;
            ReturnValue = DataTableJsonReturnTable(dt);
            //return ReturnValue;

            dynamic myclass = new { field1 = "abcd", field2 = 12 };
            myclass= new { field1 = "abcd", field2 = 12 };
            return myclass;
            
        }

        public static List<T> GetColumnValues<T>(DataTable dtSource, string filedName)
        {
            return (from r in dtSource.AsEnumerable() select r.Field<T>(filedName)).ToList<T>();
        }

        //JASON格式，返回給EasyUI Table使用
        public static string DataTableJsonReturnTable(DataTable dt)
        {
            StringBuilder jsonBuilder = new StringBuilder();
            jsonBuilder.Append("{");
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    jsonBuilder.Append("\"");
                    jsonBuilder.Append(dt.Columns[j].ColumnName);
                    jsonBuilder.Append("\":\"");
                    jsonBuilder.Append(dt.Rows[i][j].ToString());
                    jsonBuilder.Append("\",");
                }
                jsonBuilder.Remove(jsonBuilder.Length - 1, 1);
            }
            jsonBuilder.Append("}");

            var ts= jsonBuilder.ToString();
            //jsonBuilder.Append("}");
            return jsonBuilder.ToString();

        }

        public static List<PermissonModels> GetPermission(string AuthorityID)
        {             
            string strUserName = AdminUserContext.Current.LoginInfo.LoginName; 
            string strSql = string.Format(@"Select Powers AS PermissionID From v_powers Where LoginName ='{0}' and AuthorityID='{1}'", strUserName, AuthorityID);           
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<PermissonModels> lstPermission = new List<PermissonModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                PermissonModels mdj = new PermissonModels();
                mdj.PermissionID = dr["PermissionID"].ToString();                
                lstPermission.Add(mdj);
            }
            return lstPermission;
        }
        public static List<ListDataModels> GetBasePermissionList(string TableName)
        {           
            string strSql = "";
            switch (TableName) {
                case "Role":
                    strSql = @"Select ID as value,name as label From Role Order by ID";
                     break;
                case "Authority":
                    strSql = @"Select AuthorityID as value,AuthorityName as label 
                            From Authority WHERE ISNULL(WebUrl,'')<>'' Order by AuthorityID";
                    break;
                case "sy_Powers":
                    strSql = @"Select ID as value,Powers as label From sy_Powers Order by Powers";
                    break;
            }
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<ListDataModels> lst = new List<ListDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                ListDataModels mdj = new ListDataModels();
                mdj.value = dr["value"].ToString();
                mdj.label = dr["label"].ToString();
                lst.Add(mdj);
            }
            return lst;
        }
       

    }
}