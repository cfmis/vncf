using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using VNCF.PSS.Web.Areas.Stock.Models;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Areas.Base.DAL;
using CF.SQLServer.DAL;
using System.Data.SqlClient;

namespace VNCF.PSS.Web.Areas.Stock.DAL
{
    public class TransferDAL
    {
        public static string UpdateTransferHead(TransferHead model)
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
            if (!CheckTransferHead(ID))
                strSql += "Insert Into wm_TransferHead (ID,TransferDate,LocID,NextLocID,FlagID) Values ('"
                    + ID + "','" + model.TransferDate + "','" + model.LocID + "','" + model.NextLocID + "','" + model.FlagID + "')";
            else
                strSql += string.Format(@"UPDATE wm_TransferHead SET TransferDate='{0}' WHERE ID='{1}'"
                    , model.TransferDate, model.ID);
            strSql += string.Format(@" COMMIT TRANSACTION ");
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            result = ID;
            return result;
        }
        private static bool CheckTransferHead(string ID)
        {
            bool result = true;
            string strSql = "Select ID FROM wm_TransferHead Where ID='" + ID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = true;
            else
                result = false;
            return result;
        }
        public static List<TransferHead> LoadTransferHead(string ID)
        {
            List<TransferHead> lsModel = new List<TransferHead>();
            string strSql = "Select * FROM wm_TransferHead Where ID='" + ID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                TransferHead mdj = new TransferHead();
                DataRow dr = dt.Rows[i];
                mdj.ID = dr["ID"].ToString();
                mdj.FlagID = dr["FlagID"].ToString();
                mdj.TransferDate = dr["TransferDate"].ToString();
                mdj.LocID = dr["LocID"].ToString();
                mdj.NextLocID = dr["NextLocID"].ToString();
                lsModel.Add(mdj);
            }
            return lsModel;
        }
        public static List<TransferDetails> SearchTransfer(QueryTransferParas model)
        {
            string strSql = "Select a.TransferDate,b.*,c.name,c.english_name" +
                " FROM wm_TransferHead a " +
                " Inner Join wm_TransferDetails b On a.ID=b.ID" +
                " Left Join it_goods c ON b.GoodsID=c.id" +
                " Where a.ID>='" + "" + "'";
            if (model.IDFrom != null && model.IDTo != null)
                strSql += " And a.ID>='" + model.IDFrom + "' And a.ID<='" + model.IDTo + "'";
            if (model.TransferDateFrom != null && model.TransferDateTo != null)
            {
                string DateTo = Convert.ToDateTime(model.TransferDateTo).AddDays(1).ToString("yyyy/MM/dd");
                strSql += " And a.TransferDate>='" + model.TransferDateFrom + "' And a.TransferDate<'" + DateTo + "'";
            }
            if (model.IDFrom == null && model.IDTo == null && model.TransferDateFrom == null && model.TransferDateTo == null)
                strSql += " And a.ID=''";
            strSql += " ORDER BY a.TransferDate Desc,b.Seq Desc";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<TransferDetails> lsDetails = new List<TransferDetails>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                TransferDetails mdj = new TransferDetails();
                DataRow dr = dt.Rows[i];
                mdj.TransferDate = dr["TransferDate"].ToString();
                mdj.ID = dr["ID"].ToString();
                mdj.Seq = dr["Seq"].ToString();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.GoodsID = dr["GoodsID"].ToString();
                mdj.LotNo = dr["LotNo"].ToString();
                mdj.TransferQty = Convert.ToInt32(dr["TransferQty"]);
                mdj.QtyUnit = dr["QtyUnit"].ToString();
                mdj.TransferWeg = Convert.ToDecimal(dr["TransferWeg"]);
                mdj.WegUnit = dr["WegUnit"].ToString();
                mdj.GoodsName = dr["name"].ToString();//"file:///"  + Server.MapPath("~")  +"~/Images/login.jpg";//
                mdj.NextLocID = dr["NextLocID"].ToString();
                lsDetails.Add(mdj);
            }
            return lsDetails;
        }
        public static List<TransferDetails> LoadTransferDetailsByID(string ID)
        {
            string strSql = "Select a.*,b.name,b.english_name" +
                " FROM wm_TransferDetails a " +
                " Left Join it_goods b ON a.GoodsID=b.id" +
                " Where a.ID='" + ID + "'";
            strSql += " ORDER BY a.Seq Desc";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<TransferDetails> lsDetails = new List<TransferDetails>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                TransferDetails mdj = new TransferDetails();
                DataRow dr = dt.Rows[i];
                mdj.Seq = dr["Seq"].ToString();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.GoodsID = dr["GoodsID"].ToString();
                mdj.LotNo = dr["LotNo"].ToString();
                mdj.TransferQty = Convert.ToInt32(dr["TransferQty"]);
                mdj.QtyUnit = dr["QtyUnit"].ToString();
                mdj.TransferWeg = Convert.ToDecimal(dr["TransferWeg"]);
                mdj.WegUnit = dr["WegUnit"].ToString();
                mdj.GoodsName = dr["name"].ToString();//"file:///"  + Server.MapPath("~")  +"~/Images/login.jpg";//
                mdj.NextLocID = dr["NextLocID"].ToString();
                lsDetails.Add(mdj);
            }
            return lsDetails;
        }


        public static UpdateStatusModels UpdateTransferDetails(TransferDetails model)
        {
            string result = "";
            bool ValidFlag = true;
            string strSql = "";
            string ID = model.ID;
            string LocID = model.LocID;
            string NextLocID = model.NextLocID;
            string QtyUnit = model.QtyUnit;
            string WegUnit = model.WegUnit;
            UpdateStatusModels resModel = new UpdateStatusModels();
            DataTable dtFlag = BaseDataDAL.GetDocFlayReturnTable("wh_transfer",model.FlagID);
            string flag0 = dtFlag.Rows[0]["flag0"].ToString().Trim();
            string flag1 = dtFlag.Rows[0]["flag1"].ToString().Trim();
            string flag2 = dtFlag.Rows[0]["flag2"].ToString().Trim();
            strSql += string.Format(@" SET XACT_ABORT  ON ");
            strSql += string.Format(@" BEGIN TRANSACTION ");
            bool FirstRec = false;
            if (ID == null || ID == "")
            {
                FirstRec = true;
                ID = GenNumberDAL.GenTransferID(flag0, LocID, NextLocID, flag2);
            }
            else
            {
                if (!CheckTransferHead(ID))
                {
                    FirstRec = true;
                    ID = GenNumberDAL.GenTransferID(flag0, LocID, NextLocID, flag2);
                }
            }
            if (FirstRec)
                strSql += string.Format(@"Insert Into wm_TransferHead (ID,TransferDate,LocID,NextLocID,FlagID) Values ('"
                        + ID + "','" + model.TransferDate + "','" + model.LocID + "','" + model.NextLocID + "','" + model.FlagID + "')");
            else
                strSql += string.Format(@"UPDATE wm_TransferHead SET TransferDate='{0}' WHERE ID='{1}'"
                    , model.TransferDate, ID);

            string ProductMo = model.ProductMo;
            string GoodsID = model.GoodsID;
            string LotNo = model.LotNo;
            decimal Qty = model.TransferQty.ToString().Trim() != "" ? model.TransferQty : 0;
            decimal Weg = model.TransferWeg.ToString().Trim() != "" ? model.TransferWeg : 0;

            result = CheckQtyStore(LocID, GoodsID, ProductMo, LotNo, flag1, Weg, Qty);
            if (result != "")
                ValidFlag = false;
            else
            {
                if (flag2 == "TO")
                {
                    result = CheckQtyStore(NextLocID, GoodsID, ProductMo, LotNo, "+", Weg, Qty);
                    if (result != "")
                        ValidFlag = false;
                }
            }
            if (ValidFlag == false)
            {
                resModel.Msg = result;
                return resModel;
            }

            string Seq = GenNumberDAL.GetDetailsSeq("wm_TransferDetails", model.ID);
            string CreateUser = "";
            string CreateTime = System.DateTime.Now.ToString("yyyy/MM/dd HH:ss:mm");

            strSql += string.Format(@"Insert Into wm_TransferDetails (ID,Seq,ProductMo,GoodsID,LocID,LotNo,TransferQty,TransferWeg,QtyUnit,WegUnit,NextLocID,CreateUser,CreateTime) Values " +
                        "('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}')"
                        , ID, Seq, model.ProductMo, model.GoodsID, model.LocID, model.LotNo, model.TransferQty, model.TransferWeg, QtyUnit, WegUnit, NextLocID, "", CreateTime);
            strSql += string.Format(JoinUpdateStr("U", LocID, GoodsID, ProductMo, LotNo, flag1, Weg, Qty, CreateUser, CreateTime));
            if (flag2 == "TO")
                strSql += string.Format(JoinUpdateStr("U", NextLocID, GoodsID, ProductMo, LotNo, "+", Weg, Qty, CreateUser, CreateTime));
            strSql += string.Format(@" COMMIT TRANSACTION ");
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            if (result == "")
                resModel.Status = "OK";
            else
            {
                resModel.Status = "ERROR";
                resModel.Msg = result;
            }
            resModel.ReturnValue = ID;
            return resModel;
        }
        protected static string CheckQtyStore(string LocID, string GoodsID, string ProdcutMo, string LotNo, string flag1, decimal Weg, decimal Qty)
        {
            string result = "";
            decimal InQty = 0, InWeg = 0, OutQty = 0, OutWeg = 0;
            DataTable dtStore1 = GetStoreDetails(LocID, GoodsID, ProdcutMo, LotNo);
            if (dtStore1.Rows.Count > 0)
            {

                InWeg = dtStore1.Rows[0]["InWeg"].ToString() != "" ? Convert.ToDecimal(dtStore1.Rows[0]["InWeg"].ToString()) : 0;
                InQty = dtStore1.Rows[0]["InQty"].ToString() != "" ? Convert.ToDecimal(dtStore1.Rows[0]["InQty"].ToString()) : 0;
                OutWeg = dtStore1.Rows[0]["OutWeg"].ToString() != "" ? Convert.ToDecimal(dtStore1.Rows[0]["OutWeg"].ToString()) : 0;
                OutQty = dtStore1.Rows[0]["OutQty"].ToString() != "" ? Convert.ToDecimal(dtStore1.Rows[0]["OutQty"].ToString()) : 0;
            }
            if (flag1 == "+")
            {
                if (InWeg + Weg < OutWeg || InWeg + Weg < 0)
                    result = BaseDataDAL.GetSystemMessage("ST00002");
                else if (InQty + Qty < OutQty || InQty + Qty < 0)
                    result = BaseDataDAL.GetSystemMessage("ST00001");
            }
            else
            {
                if (dtStore1.Rows.Count == 0)
                    result = BaseDataDAL.GetSystemMessage("ST00003");
                else
                    if (OutWeg + Weg > InWeg || OutWeg + Weg < 0)
                    result = BaseDataDAL.GetSystemMessage("ST00002");
                else if (OutQty + Qty > InQty || OutQty + Qty < 0)
                    result = BaseDataDAL.GetSystemMessage("ST00001");
            }
            return result;
        }

        protected static DataTable GetStoreDetails(string LocID, string GoodsID, string ProductMo, string LotNo)
        {
            string strSql = "";
            strSql = "Select InQty,InWeg,OutQty,OutWeg From wm_StoreDetails " +
                " Where LocID='" + LocID + "' And GoodsID='" + GoodsID + "' And ProductMo='" + ProductMo + "' And LotNo='" + LotNo + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            return dt;
        }

        protected static string JoinUpdateStr(string Mode,string LocID, string GoodsID, string ProductMo, string LotNo, string flag1, decimal Weg, decimal Qty, string CreateUser, string CreateTime)
        {
            string strSql = "";
            DataTable dtStore = GetStoreDetails(LocID, GoodsID, ProductMo, LotNo);
            decimal InQty = 0, InWeg = 0, OutQty = 0, OutWeg = 0;
            if (dtStore.Rows.Count > 0)
            {
                InWeg = dtStore.Rows[0]["InWeg"].ToString() != "" ? Convert.ToDecimal(dtStore.Rows[0]["InWeg"].ToString()) : 0;
                InQty = dtStore.Rows[0]["InQty"].ToString() != "" ? Convert.ToDecimal(dtStore.Rows[0]["InQty"].ToString()) : 0;
                OutWeg = dtStore.Rows[0]["OutWeg"].ToString() != "" ? Convert.ToDecimal(dtStore.Rows[0]["OutWeg"].ToString()) : 0;
                OutQty = dtStore.Rows[0]["OutQty"].ToString() != "" ? Convert.ToDecimal(dtStore.Rows[0]["OutQty"].ToString()) : 0;
            }
            if (flag1 == "+")
            {
                InWeg = InWeg + Weg;
                InQty = InQty + Qty;
            }
            else
            {
                OutWeg = OutWeg + Weg;
                OutQty = OutQty + Qty;
            }
            if (dtStore.Rows.Count == 0 && Mode=="U")
                strSql += string.Format(@"Insert Into wm_StoreDetails (LocID,GoodsID,ProductMo,LotNo,InQty,InWeg,OutQty,OutWeg,CreateUser,CreateTime) Values " +
                "('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}')"
                , LocID, GoodsID, ProductMo, LotNo, InQty, InWeg, OutQty, OutWeg, CreateUser, CreateTime);
            else
                strSql += string.Format(@"Update wm_StoreDetails Set InQty='{0}',InWeg='{1}',OutQty='{2}',OutWeg='{3}'" +
                    ",CreateUser='{4}',CreateTime='{5}'" +
                " Where LocID='{6}' And GoodsID='{7}' And ProductMo='{8}' And LotNo='{9}'"
                , InQty, InWeg, OutQty, OutWeg, CreateUser, CreateTime, LocID, GoodsID, ProductMo, LotNo);

            return strSql;
        }
        public static UpdateStatusModels Delete(string ID,string Seq)
        {
            string result = "";
            UpdateStatusModels resModel = new UpdateStatusModels();

            DataTable dtTransfer = FindDetailsByID(ID, Seq);
            DataRow dr = dtTransfer.Rows[0];
            string FlagID = dr["FlagID"].ToString().Trim();
            string ProductMo = dr["ProductMo"].ToString().Trim();
            string GoodsID = dr["GoodsID"].ToString().Trim();
            string LotNo = dr["LotNo"].ToString().Trim();
            string LocID = dr["LocID"].ToString().Trim();
            string NextLocID = dr["NextLocID"].ToString().Trim();
            decimal Weg = 0 - (dr["TransferWeg"].ToString().Trim() != "" ? Convert.ToDecimal(dr["TransferWeg"].ToString().Trim()) : 0);
            decimal Qty = 0 - (dr["TransferQty"].ToString().Trim() != "" ? Convert.ToDecimal(dr["TransferQty"].ToString().Trim()) : 0);
            string CreateUser = "";
            string CreateTime = System.DateTime.Now.ToString("yyyy/MM/dd HH:ss:mm");
            DataTable dtFlag = BaseDataDAL.GetDocFlayReturnTable("wh_transfer", FlagID);
            string flag1 = dtFlag.Rows[0]["flag1"].ToString().Trim();
            string flag2 = dtFlag.Rows[0]["flag2"].ToString().Trim();
            bool valid_flag = true;
            result = CheckQtyStore(LocID, GoodsID, ProductMo, LotNo, flag1, Weg, Qty);
            if (result != "")
                valid_flag = false;
            else
            {
                if (flag2 == "TO")
                {
                    result = CheckQtyStore(NextLocID, GoodsID, ProductMo, LotNo, "+", Weg, Qty);
                    if (result != "")
                        valid_flag = false;
                }
            }

            if (valid_flag == true)
            {
                string strSql = "";
                strSql += string.Format(@" SET XACT_ABORT  ON ");
                strSql += string.Format(@" BEGIN TRANSACTION ");
                strSql += string.Format(@"Delete From wm_TransferDetails Where ID='{0}' And Seq='{1}'", ID, Seq);
                strSql += string.Format(JoinUpdateStr("D", LocID, GoodsID, ProductMo, LotNo, flag1, Weg, Qty, CreateUser,CreateTime));
                if (flag2 == "TO")
                    strSql += string.Format(JoinUpdateStr("D", NextLocID, GoodsID, ProductMo, LotNo, "+", Weg, Qty, CreateUser, CreateTime));

                strSql += string.Format(@" COMMIT TRANSACTION ");

                result = SQLHelper.ExecuteSqlUpdate(strSql);
            }


            if (result == "")
                resModel.Status = "OK";
            else
            {
                resModel.Status = "ERROR";
                resModel.Msg = result;
            }
            resModel.ReturnValue = ID;
            return resModel;
        }

        protected static DataTable FindDetailsByID(string ID,string Seq)
        {
            string strSql = "";
            strSql = "Select a.FlagID,b.* From wm_TransferHead a " +
                " Inner Join wm_TransferDetails b On a.ID=b.ID Where b.ID='" + ID + "' And b.Seq='" + Seq + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            return dt;
        }
        public static List<ViewTransfer> QueryTransfer(QueryTransferParas model)
        {
            string LocID = model.LocID != null ? model.LocID : "";
            string TransferDateFrom = model.TransferDateFrom != null ? model.TransferDateFrom : "";
            string TransferDateTo = model.TransferDateTo != null ? model.TransferDateTo : "";
            string ProductMoFrom = model.ProductMoFrom != null ? model.ProductMoFrom : "";
            string ProductMoTo = model.ProductMoTo != null ? model.ProductMoTo : "";
            string GoodsIDFrom = model.GoodsIDFrom != null ? model.GoodsIDFrom : "";
            string GoodsIDTo = model.GoodsIDTo != null ? model.GoodsIDTo : "";
            if (LocID == "" && TransferDateFrom == "" && TransferDateTo == "" && ProductMoFrom == "" && ProductMoTo == "" && GoodsIDFrom == "" && GoodsIDTo == "")
            {
                LocID = "ZZZ";
                TransferDateFrom = "1900/01/01";
                TransferDateTo = "1900/01/01";
            }
            string strSql = "p_WmTransferDetails";
            SqlParameter[] parameters = {new SqlParameter("@LocID", LocID)
                    ,new SqlParameter("@DateFrom", TransferDateFrom)
                    ,new SqlParameter("@DateTo", TransferDateTo)
                    ,new SqlParameter("@ProductMoFrom", ProductMoFrom)
                    ,new SqlParameter("@ProductMoTo", ProductMoTo)
                    ,new SqlParameter("@GoodsIDFrom", GoodsIDFrom)
                    ,new SqlParameter("@GoodsIDTo", GoodsIDTo)
                    };
            DataTable dt = SQLHelper.ExecuteProcedureRetrunDataTable(strSql, parameters);

            List<ViewTransfer> lsDetails = new List<ViewTransfer>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                ViewTransfer mdj = new ViewTransfer();
                DataRow dr = dt.Rows[i];
                mdj.ID = dr["ID"].ToString();
                mdj.LocID = dr["LocID"].ToString();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.GoodsID = dr["GoodsID"].ToString();
                mdj.LotNo = dr["LotNo"].ToString();
                mdj.TransferQty = Convert.ToInt32(dr["TransferQty"]);
                //mdj.QtyUnit = dr["QtyUnit"].ToString();
                mdj.TransferWeg = Convert.ToDecimal(dr["TransferWeg"]);
                //mdj.WegUnit = dr["WegUnit"].ToString();
                mdj.GoodsName = dr["GoodsName"].ToString();//"file:///"  + Server.MapPath("~")  +"~/Images/login.jpg";//
                mdj.NextLocID = dr["NextLocID"].ToString();
                mdj.TransferDate = dr["TransferDate"].ToString();
                mdj.FlagID = dr["FlagID"].ToString();
                mdj.FlagName = dr["FlagName"].ToString();
                mdj.TransferFlag = dr["TransferFlag"].ToString();
                mdj.LocIDFrom = dr["LocIDFrom"].ToString();
                mdj.UseItem = dr["UseItem"].ToString();
                mdj.UseItemName = dr["UseItemName"].ToString();
                mdj.WmQty = dr["WmQty"].ToString() != "" ? Convert.ToInt32(dr["WmQty"]) : 0;
                mdj.WmWeg = dr["WmWeg"].ToString() != "" ? Convert.ToDecimal(dr["WmWeg"]) : 0;
                lsDetails.Add(mdj);
            }
            return lsDetails;
        }

        public static List<ViewTransfer> QueryStockList(QueryTransferParas model)
        {
            string LocID = model.LocID != null ? model.LocID : "";
            string ProductMoFrom = model.ProductMoFrom != null ? model.ProductMoFrom : "";
            string ProductMoTo = model.ProductMoTo != null ? model.ProductMoTo : "";
            string GoodsIDFrom = model.GoodsIDFrom != null ? model.GoodsIDFrom : "";
            string GoodsIDTo = model.GoodsIDTo != null ? model.GoodsIDTo : "";
            if (LocID == "" && ProductMoFrom == "" && ProductMoTo == "" && GoodsIDFrom == "" && GoodsIDTo == "")
            {
                LocID = "ZZZ";
            }
            string strSql = "p_WmStockList";
            SqlParameter[] parameters = {new SqlParameter("@LocID", LocID)
                    ,new SqlParameter("@ProductMoFrom", ProductMoFrom)
                    ,new SqlParameter("@ProductMoTo", ProductMoTo)
                    ,new SqlParameter("@GoodsIDFrom", GoodsIDFrom)
                    ,new SqlParameter("@GoodsIDTo", GoodsIDTo)
                    };
            DataTable dt = SQLHelper.ExecuteProcedureRetrunDataTable(strSql, parameters);

            List<ViewTransfer> lsDetails = new List<ViewTransfer>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                ViewTransfer mdj = new ViewTransfer();
                DataRow dr = dt.Rows[i];
                mdj.LocID = dr["LocID"].ToString();
                mdj.GoodsID = dr["GoodsID"].ToString();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.LotNo = dr["LotNo"].ToString();
                mdj.GoodsName = dr["GoodsName"].ToString();//"file:///"  + Server.MapPath("~")  +"~/Images/login.jpg";//
                mdj.WmQty = dr["WmQty"].ToString() != "" ? Convert.ToInt32(dr["WmQty"]) : 0;
                mdj.WmWeg = dr["WmWeg"].ToString() != "" ? Convert.ToDecimal(dr["WmWeg"]) : 0;
                lsDetails.Add(mdj);
            }
            return lsDetails;
        }

    }
}