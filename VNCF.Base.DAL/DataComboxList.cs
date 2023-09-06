using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using CF.Framework.Contract;
using VNCF.Base.Contract;
using CF.SQLServer.DAL;
using CF.Core.Config;

namespace VNCF.Base.DAL
{
    
    public static class DataComboxList
    {
        //private static SQLHelper sh = new SQLHelper(CachedConfigContext.Current.DaoConfig.Cms);
        private static string within_code="0000";
        public static List<ModelBaseList> GetComboxList(string SourceType, string language_id)
        {
            string strSql = "";
            string LanguageID = SQLHelper.ConvertLanguage(language_id);
            //string LanguageID = SQLHelper.ConvertLanguage(language_id);
            switch (SourceType)
            {
                case "Type"://單據來源
                    strSql += "Select id,name From FileType Order By id";
                    break;               
                //case "BillOrigin"://開單來源,單據種類等
                //    strSql += string.Format("SELECT id,name FROM sys_bill_origin WHERE function_id='JO06' AND [language]='{0}' AND [state]='0'", LanguageID);
                //    break;                
                default:
                    strSql += "";
                    break;
            }
            //cd_carton_size
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            ModelBaseList obj1 = new ModelBaseList();
            obj1.value = "";
            obj1.label = "";
            List<ModelBaseList> lst = new List<ModelBaseList>();
            lst.Add(obj1);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                ModelBaseList obj = new ModelBaseList();
                obj.value = dr["id"].ToString();
                obj.label = dr["name"].ToString().Trim();
                lst.Add(obj);
            } 
            return lst;
        }

        public static List<QtyUnitRate> GetQtyUnitRateList(string unit_code)
        {
            string strSql = "";
            strSql += "Select a.id,a.basic_unit,a.unit_code,a.rate" +
                " From it_coding a " +
                " Where a.within_code='" + within_code + "' And a.id='*' ";
            if (unit_code != "")
                strSql += " And a.unit_code='" + unit_code + "'";
            strSql += " Order By a.id";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            QtyUnitRate obj1 = new QtyUnitRate();
            obj1.value = "";
            obj1.label = "";
            List<QtyUnitRate> lst = new List<QtyUnitRate>();
            lst.Add(obj1);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                QtyUnitRate obj = new QtyUnitRate();
                obj.value = dr["unit_code"].ToString();
                obj.label = dr["unit_code"].ToString().Trim();
                obj.rate = dr["rate"].ToString() == "" ? 0 : Convert.ToDecimal(dr["rate"].ToString());
                lst.Add(obj);
            }
            return lst;
        }
        /// <summary>
        /// 倉位取倉位資料
        /// </summary>
        /// <param name="location_id"></param>
        /// <returns></returns>
        public static List<ModelBaseList> GetCartonCodeList(string location_id)
        {
            string strSql = string.Format(
                @"SELECT S.* 
                  FROM (SELECT id, name FROM cd_carton_code WHERE within_code='{0}' and location_id='{1}' AND id<>'ZZZ') S
                  WHERE S.name NOT LIKE '%臨時%' 
                  ORDER BY S.id", within_code, location_id);            
            ModelBaseList obj1 = new ModelBaseList();
            obj1.value = "";
            obj1.label = "";
            List<ModelBaseList> lst = new List<ModelBaseList>();
            lst.Add(obj1);
            DataTable dtWh = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            for (int i = 0; i < dtWh.Rows.Count; i++)
            {
                DataRow dr = dtWh.Rows[i];
                ModelBaseList obj = new ModelBaseList();
                obj.value = dr["id"].ToString();
                obj.label = dr["name"].ToString().Trim();
                lst.Add(obj);
            }
            return lst;
        }

   

    }
}
