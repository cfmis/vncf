using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNCF.PSS.Web.Areas.Base.DAL;
using CF.SQLServer.DAL;
using System.Data.SqlClient;
using VNCF.PSS.Web.Areas.Purchase.Models;

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
    }
}