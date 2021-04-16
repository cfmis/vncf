using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNCF.PSS.Web.Areas.Base.DAL;
using CF.SQLServer.DAL;
using System.Data.SqlClient;
using VNCF.PSS.Web.Areas.Purchase.Models;
using System.Data;

namespace VNCF.PSS.Web.Areas.Purchase.DAL
{
    public class PurchaseDAL
    {
        public static string UpdateBuyHead(BuyHead model)
        {
            string result = "";
            string strSql = "";
            strSql += string.Format(@" SET XACT_ABORT  ON ");
            strSql += string.Format(@" BEGIN TRANSACTION ");
            string ID = "";
            if (model.ID == "" || model.ID == null)
            {
                Random rd = new Random();
                string dateTimeStr = System.DateTime.Now.ToString("yyyy/MM/dd hh:MM:dd");
                ID = dateTimeStr.Substring(0, 4) + dateTimeStr.Substring(5, 2) + dateTimeStr.Substring(8, 2)
                    + dateTimeStr.Substring(11, 2) + dateTimeStr.Substring(14, 2) + dateTimeStr.Substring(17, 2);// rd.Next(1, 1000000000).ToString();
            }
            else
                ID = model.ID;
            //if (!CheckTransferHead(ID))
            //    strSql += "Insert Into wm_TransferHead (ID,TransferDate,LocID,NextLocID,FlagID) Values ('"
            //        + ID + "','" + model.TransferDate + "','" + model.LocID + "','" + model.NextLocID + "','" + model.FlagID + "')";
            //else
            //    strSql += string.Format(@"UPDATE wm_TransferHead SET TransferDate='{0}' WHERE ID='{1}'"
            //        , model.TransferDate, model.ID);
            //strSql += string.Format(@" COMMIT TRANSACTION ");
            //result = SQLHelper.ExecuteSqlUpdate(strSql);
            result = ID;
            return result;
        }

        //返回供應商地址信息等
        public static BuyHead GetVendorByID(string strVendorID)
        {
            string strSql = string.Format(
                @"Select name as Vendor,
                isnull(add_address,'') as VendorAddress,
                isnull(linkman,'') as Contacts,
                isnull(l_phone,'') as ContactsTel,isnull(fax,'') as ContactsFax
                From dbo.bs_vendor
                Where id='{0}' and state ='1'", strVendorID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            BuyHead objModel = new BuyHead();
            if (dt.Rows.Count > 0)
            {
                objModel.Vendor = dt.Rows[0]["Vendor"].ToString();
                objModel.VendorAddress = dt.Rows[0]["VendorAddress"].ToString();
                objModel.Contacts = dt.Rows[0]["Contacts"].ToString();
                objModel.ContactsTel = dt.Rows[0]["ContactsTel"].ToString();
                objModel.ContactsFax = dt.Rows[0]["ContactsFax"].ToString();
            }
            else
            {
                objModel.Vendor = "";
                objModel.VendorAddress = "";
                objModel.Contacts = "";
                objModel.ContactsTel = "";
                objModel.ContactsFax = "";
            }
            return objModel;
        }

    }
}