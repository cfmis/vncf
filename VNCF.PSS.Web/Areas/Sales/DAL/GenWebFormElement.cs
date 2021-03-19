using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using VNCF.PSS.Web.Common;
using VNCF.PSS.Web.Areas.Sales.Models;
using CF.SQLServer.DAL;
using CF.Framework.Utility;
using System.Web.Mvc;


namespace VNCF.PSS.Web.Areas.Sales.DAL
{
    public class GenWebFormElement
    {
        public CreateOrderIndexModel AdminCreateOrderIndex(string webFormName)
        {
            var LanguageID = AdminUserContext.Current.LoginInfo.LanguageID;
            var item = new CreateOrderIndexModel();
            string strSql = "Select a.FieldsID,b.FieldsName" +
                " FROM sy_WebFormElement a" +
                " INNER JOIN sy_DataDictionaryLanguage b ON a.FieldsID=b.FieldsID" +
                " WHERE a.WebFormName='" + webFormName + "' AND b.LanguageID='" + LanguageID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                var fieldsID = dr["FieldsID"].ToString().Trim().ToUpper();
                var fieldsName = dr["FieldsName"].ToString().Trim();
                item.OcID = fieldsID == "OCID" ? fieldsName : item.OcID;
                item.OrderDate = fieldsID == "ORDERDATE" ? fieldsName : item.OrderDate;
                item.Ver = fieldsID == "VER" ? fieldsName : item.Ver;
                item.CustomerID = fieldsID == "CUSTOMERID" ? fieldsName : item.CustomerID;
            }
            return item;
        }

        public List<WebFormElementModel> GetWebFormElement(string webFormName)
        {
            var LanguageID = AdminUserContext.Current.LoginInfo.LanguageID;
            List<WebFormElementModel> lsModel = new List<WebFormElementModel>();
            string strSql = "Select a.FieldsID,b.FieldsName" +
                " FROM sy_WebFormElement a" +
                " INNER JOIN sy_DataDictionaryLanguage b ON a.FieldsID=b.FieldsID" +
                " WHERE a.WebFormName='" + webFormName + "' AND b.LanguageID='" + LanguageID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            for (int i=0;i<dt.Rows.Count;i++)
            {
                DataRow dr = dt.Rows[i];
                WebFormElementModel objModel = new WebFormElementModel();
                objModel.FieldsID = dr["FieldsID"].ToString().Trim();
                objModel.FieldsName = dr["FieldsName"].ToString().Trim();
                lsModel.Add(objModel);
            }
            return lsModel;
        }


        /// <summary>
        /// 前端頁面翻譯
        /// </summary>
        /// <param name="webFormName"> web page name</param>
        /// <returns></returns>
        public ViewDataDictionary getViewData(string webFormName)
        {
            //ViewData存儲標簽翻譯數據
            var LanguageID = AdminUserContext.Current.LoginInfo.LanguageID;
            string strSql = "Select a.FieldsID,b.FieldsName" +
               " FROM sy_WebFormElement a" +
               " INNER JOIN sy_DataDictionaryLanguage b ON a.FieldsID=b.FieldsID" +
               " WHERE a.WebFormName='" + webFormName + "' AND b.LanguageID='" + LanguageID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            ViewDataDictionary ViewData = new ViewDataDictionary();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                ViewData[dt.Rows[i]["FieldsID"].ToString()] = dt.Rows[i]["FieldsName"].ToString();
            }
            //調用頁面的當前用戶及時間
            ViewData["user_id"] = AdminUserContext.Current.LoginInfo.LoginName;
            return ViewData;
        }

    }
}