using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VNCF.PSS.Web.Areas.Base.DAL;
using CF.SQLServer.DAL;
using System.Data.SqlClient;
using VNCF.PSS.Web.Areas.Purchase.Models;
using System.Data;
using VNCF.PSS.Web.Common;
using VNCF.PSS.Web.Areas.Sales.Models;
using VNCF.PSS.Web.Areas.Base.Models;

namespace VNCF.PSS.Web.Areas.Purchase.DAL
{
    public class PurchaseDAL
    {
        static string strRemoteDB = "DGERP2.cferp.dbo.";     

        //更新主表
        public static string UpdateBuyHead(BuyHead model)
        {
            string result = "";
            string strSql = "";
            string user_id = AdminUserContext.Current.LoginInfo.LoginName;

            strSql += string.Format(@" SET XACT_ABORT ON ");
            strSql += string.Format(@" BEGIN TRANSACTION ");
            string ID = "";           
            ID = model.ID;
            if (!CheckOcHead(ID))
            {
                strSql += string.Format(
                  @" Insert Into pu_BuyHead (ID,Ver,OrderDate,Vendor,VendorID,VendorAddress,BuyerName,BuyerID,CurrencyID,CurrencyRate,PaymentType,PaymentAmt,OtherAmt,TotalAmt,State,Remark,
                     DepartMentID,PriceType,CustomerID,CustomerCdesc,Contacts,ContactsTel,ContactsFax,Packing,CreateBy,CreateAt) Values 
                   ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}',{9},'{10}',{11},{12},{13},'{14}','{15}','{16}','{17}','{18}','{19}','{20}','{21}','{22}','{23}','{24}',getdate())",
                  ID, model.Ver, model.OrderDate, model.Vendor, model.VendorID, model.VendorAddress, model.BuyerName, model.BuyerID, model.CurrencyID, model.CurrencyRate, model.PaymentType,
                  model.PaymentAmt, model.OtherAmt, model.TotalAmt, model.State, model.Remark, model.DepartMentID, model.PriceType, model.CustomerID, model.CustomerCdesc, model.Contacts,
                  model.ContactsTel, model.ContactsFax, model.Packing, user_id);
                
                //更新最大序號                
                DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(@"SELECT fixation_value_1 AS prex FROM sys_bill_rule A WHERE A.bill_id = 'PUR1'");
                string strPrex = dt.Rows[0]["prex"].ToString(); //"VWH";
                dt= SQLHelper.ExecuteSqlReturnDataTable(string.Format(@"SELECT '1' FROM sys_bill_max with(nolock) WHERE bill_id = 'PUR1' and bill_text1='{0}'", strPrex));
                if(dt.Rows.Count>0)
                    strSql += string.Format(@" Update sys_bill_max SET bill_code='{0}' Where bill_id='PUR1' And bill_text1='{1}' ",ID, strPrex);
                else
                    strSql += string.Format(@" Insert INTO sys_bill_max(bill_id,bill_code,bill_text1) Values('{0}','{1}','{2}')", "PUR1",ID, strPrex);
            }
            else
                strSql += string.Format(
               @" UPDATE pu_BuyHead SET OrderDate='{0}',Vendor='{1}',VendorID='{2}',VendorAddress='{3}',BuyerName='{4}',BuyerID='{5}',CurrencyID='{6}',CurrencyRate={7},PaymentType='{8}',
                      PaymentAmt={9},OtherAmt={10},TotalAmt={11},State='{12}',Remark='{13}',DepartMentID='{14}',PriceType='{15}',CustomerID='{16}',CustomerCdesc='{17}',Contacts='{18}',
                      ContactsTel='{19}',ContactsFax='{20}',Packing='{21}',UpdateBy='{22}',UpdateAt=getdate() 
                 WHERE ID='{23}' AND Ver='{24}'",
                 model.OrderDate, model.Vendor, model.VendorID, model.VendorAddress, model.BuyerName, model.BuyerID, model.CurrencyID, model.CurrencyRate, model.PaymentType,
                 model.PaymentAmt, model.OtherAmt, model.TotalAmt, model.State, model.Remark, model.DepartMentID, model.PriceType, model.CustomerID, model.CustomerCdesc, model.Contacts,
                 model.ContactsTel, model.ContactsFax, model.Packing, user_id, ID, model.Ver);

            strSql += string.Format(@" COMMIT TRANSACTION ");
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            if (result == "")
                result = "OK";
            else
                result = "ERROR";

            return result;
        }

        //更新明細表
        public static string UpdateBuyDetails(BuyDetails model)
        {
            string result = "";
            string strSql_i = "";
            string strSql_u = "";
            string Seq = GetMaxSeq(model.ID);                    

            strSql_i += string.Format(@" SET XACT_ABORT ON ");
            strSql_i += string.Format(@" BEGIN TRANSACTION ");
            strSql_i += string.Format(
               @" Insert Into pu_BuyDetails(ID,Ver,Seq,ProductMo,ProductID,ProductCdesc,ArriveDate,OrderQty,OrderUnit,Price,PriceUnit,DiscountRate,DiscountAmt,TotalSum,Spec,Color,Weight,WeightUnit,Remarks) 
                Values ('{0}','{1}', '{2}', '{3}', '{4}', '{5}', '{6}', {7}, '{8}', {9}, '{10}', {11}, {12}, {13}, '{14}', '{15}', {16}, '{17}', '{18}')",
               model.ID, model.Ver, Seq, model.ProductMo, model.ProductID, model.ProductCdesc, model.ArriveDate, model.OrderQty, model.OrderUnit, model.Price, model.PriceUnit, model.DiscountRate, model.DiscountAmt,
               model.TotalSum, model.Spec, model.Color, model.Weight, model.WeightUnit, model.Remarks);
            /*20210312取消插入新記錄時自動添加SalesBOM
            strSql_i += string.Format(
               @" Insert Into oc_OrderBom(OcID, Ver, UpperSeq,Seq,PrimaryKey,ProductID,Dosage,UnitCode) Values('{0}','{1}', '{2}', '{3}','{4}','{5}',{6},'{7}')",
               model.OcID, model.Ver, Seq,"001","1", model.ProductID,1,"PCS");
            */
            strSql_i += string.Format(@" COMMIT TRANSACTION ");

            strSql_u = string.Format(
               @" Update pu_BuyDetails
               Set ProductMo='{3}',ProductID='{4}',ProductCdesc='{5}',ArriveDate='{6}',OrderQty={7},OrderUnit='{8}',Price={9},PriceUnit='{10}',DiscountRate={11},DiscountAmt={12},TotalSum={13},Spec='{14}',
                Color='{15}',Weight={16},WeightUnit='{17}',Remarks='{18}'
               WHERE ID='{0}' And Ver='{1}' And Seq='{2}'", model.ID, model.Ver, model.Seq,
               model.ProductMo, model.ProductID, model.ProductCdesc, model.ArriveDate, model.OrderQty, model.OrderUnit, model.Price, model.PriceUnit, model.DiscountRate, model.DiscountAmt, model.TotalSum, model.Spec,
               model.Color, model.Weight, model.WeightUnit, model.Remarks);

            if (model.ActionType == "NEW")
                result = SQLHelper.ExecuteSqlUpdate(strSql_i);
            else
                result = SQLHelper.ExecuteSqlUpdate(strSql_u);
            return result;
        }


        private static bool CheckOcHead(string ID)
        {
            bool result = true;
            string strSql = "Select ID FROM pu_BuyHead Where ID='" + ID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = true;
            else
                result = false;
            return result;
        }


        //最大單據號
        public static string GetMaxByID()
        {
            string strSql = @"SELECT fixation_value_1 AS prex FROM sys_bill_rule A WHERE A.bill_id = 'PUR1'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            string strPrex = dt.Rows[0]["prex"].ToString(); //"VWH";
            strSql = string.Format("Select bill_code FROM sys_bill_max With(nolock) Where bill_id='{0}' And bill_text1='{1}'","PUR1" ,strPrex);
            dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            string id = "";
            if (dt.Rows.Count > 0 && !string.IsNullOrEmpty(dt.Rows[0]["bill_code"].ToString()))
                id = strPrex + (int.Parse(dt.Rows[0]["bill_code"].ToString().Substring(3, 6)) + 1).ToString("000000");
            else
                id = strPrex + "000001";
           return id;
        }

        //最大序號
        private static string GetMaxSeq(string ID)
        {
            string result = "";
            string strSql = "";
            strSql = string.Format("Select MAX(Seq) AS Seq FROM pu_BuyDetails Where ID='{0}'", ID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = dt.Rows[0]["Seq"].ToString() != "" ? (Convert.ToInt32(dt.Rows[0]["Seq"]) + 1).ToString().PadLeft(3, '0') : "001";
            else
                result = "001";
            return result;
        }

        //返回供應商地址信息等
        public static BuyHead GetVendorByID(string strVendorID)
        {
            string strSql = string.Format(
                @"SELECT A.name AS Vendor,ISNULL(A.add_address,'') AS VendorAddress,ISNULL(A.linkman,'') AS Contacts,
                ISNULL(A.l_phone,'') AS ContactsTel,ISNULL(A.fax,'') AS ContactsFax,ISNULL(A.money_id,'') AS CurrencyID,
                ISNULL(SS.exchange_rate,0) AS CurrencyRate
                FROM dbo.bs_vendor A LEFT JOIN
                 (SELECT aa.id,aa.exchange_rate FROM bs_exchange_rate aa,
			            (select id,max(days) as days from bs_exchange_rate where state <>'2' group by id) s  
			            WHERE aa.id=s.id And aa.days=s.days
		         ) SS ON ISNULL(A.money_id,'')=SS.id
                WHERE A.id='{0}' AND A.state ='1'", strVendorID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            BuyHead objModel = new BuyHead();
            if (dt.Rows.Count > 0)
            {
                objModel.Vendor = dt.Rows[0]["Vendor"].ToString();
                objModel.VendorAddress = dt.Rows[0]["VendorAddress"].ToString();
                objModel.Contacts = dt.Rows[0]["Contacts"].ToString();
                objModel.ContactsTel = dt.Rows[0]["ContactsTel"].ToString();
                objModel.ContactsFax = dt.Rows[0]["ContactsFax"].ToString();
                objModel.CurrencyID = dt.Rows[0]["CurrencyID"].ToString();
                objModel.CurrencyRate = decimal.Parse(dt.Rows[0]["CurrencyRate"].ToString()); 
            }
            else
            {
                objModel.Vendor = "";
                objModel.VendorAddress = "";
                objModel.Contacts = "";
                objModel.ContactsTel = "";
                objModel.ContactsFax = "";
                objModel.CurrencyID = "";
                objModel.CurrencyRate = 0;
            }
            return objModel;
        }

        public static BuyHead GetBuyerByID(string strBuyerID)
        {
            strBuyerID = strBuyerID.PadLeft(10,'0');
            string strSql = string.Format(
             @"SELECT Top 1 id,Rtrim(name) as name FROM {0}cd_personnel WHERE within_code='0000' and id='{1}' and state<>'2' and Isnull(personnel_state,'')<>'2'", strRemoteDB,strBuyerID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            BuyHead objModel = new BuyHead();
            if (dt.Rows.Count > 0)
            {
                objModel.BuyerID = dt.Rows[0]["id"].ToString();
                objModel.BuyerName = dt.Rows[0]["name"].ToString();
            }
            else
            {
                objModel.BuyerID = "";
                objModel.BuyerName = "";
            }
            return objModel;
        }

       
        //返採購單明細總金額
        public static BuyDetails GetTotalAmtByID(string strID, int Ver, string Seq)
        {            
            string strSql = string.Format(@"Select Sum(a.TotalSum) As TotalSum From pu_BuyDetails a WHERE a.ID='{0}' And a.Ver={1} And a.Seq<>'{2}'", strID, Ver, Seq);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            BuyDetails objModel = new BuyDetails();
            if (dt.Rows.Count > 0)
            {
                objModel.TotalSum = string.IsNullOrEmpty(dt.Rows[0]["TotalSum"].ToString()) ? 0 : decimal.Parse(dt.Rows[0]["TotalSum"].ToString());                 
            }
            else
            {
                objModel.TotalSum = 0;                
            }
            strSql = string.Format(@"select Sum(FareSum) as FareSum From pu_BuyFare WHERE ID='{0}' And Ver={1} group by ID,Ver", strID, Ver);
            dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
            {
                objModel.Price = string.IsNullOrEmpty(dt.Rows[0]["FareSum"].ToString()) ? 0 : decimal.Parse(dt.Rows[0]["FareSum"].ToString());
            }
            else
            {
                objModel.Price = 0;
            }
            return objModel;
        }

        //返採購單其他費用總金額
        public static BuyDetails GetTotalAmtOtherByID(string strID, int Ver, string strFareID)
        {
            string strSql = string.Format(
                @"SELECT Sum(a.TotalSum) As TotalSum,Max(Isnull(S.FareSum,0)) AS FareSum
                From pu_BuyDetails a with(nolock) 
                LEFT JOIN (Select ID,Ver,Sum(FareSum) as FareSum From pu_BuyFare with(nolock) WHERE ID='{0}' And Ver={1} AND FareID<>'{2}' Group By ID,Ver) S ON a.ID=S.ID AND a.Ver=S.Ver
                WHERE a.ID='{0}' And a.Ver={1}", strID, Ver, strFareID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            BuyDetails objModel = new BuyDetails();
            if (dt.Rows.Count > 0)
            {
                objModel.TotalSum= string.IsNullOrEmpty(dt.Rows[0]["TotalSum"].ToString()) ? 0 : decimal.Parse(dt.Rows[0]["TotalSum"].ToString());
                objModel.Price = string.IsNullOrEmpty(dt.Rows[0]["FareSum"].ToString()) ? 0 : decimal.Parse(dt.Rows[0]["FareSum"].ToString());
            }
            else
            {
                objModel.TotalSum = 0;
                objModel.Price = 0;
                
            }
            return objModel;
        }
        
        //返回主檔資料
        public static List<BuyHead> GetBuyHeadByID(string ID)
        {
            string strSql =
            @"SELECT ID,Ver,Convert(Varchar(10),OrderDate,111) AS OrderDate,VendorID,Vendor,VendorAddress,CustomerID,CustomerCdesc,Contacts,
            ContactsTel,ContactsFax,BuyerID,BuyerName,DepartMentID,CurrencyID,CurrencyRate,PaymentType,PriceType,PaymentAmt,OtherAmt,TotalAmt,State,
            Remark,CreateBy,CreateAt,UpdateBy,UpdateAt,Packing           
            FROM dbo.pu_BuyHead Where ID='" + ID + "'";
            BuyHead mdj = new BuyHead();
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<BuyHead> lsHead = new List<BuyHead>();
            if (dt.Rows.Count > 0)
            {
                DataRow dr = dt.Rows[0];
                mdj.ID = dr["ID"].ToString();
                mdj.Ver = Convert.ToInt32(dr["Ver"]);
                mdj.OrderDate = dr["OrderDate"].ToString();
                mdj.VendorID = dr["VendorID"].ToString();
                mdj.Vendor = dr["Vendor"].ToString();
                mdj.VendorAddress = dr["VendorAddress"].ToString();
                mdj.CustomerID = dr["CustomerID"].ToString();
                mdj.CustomerCdesc = dr["CustomerCdesc"].ToString();                            
                mdj.Contacts = dr["Contacts"].ToString();
                mdj.ContactsTel = dr["ContactsTel"].ToString();
                mdj.ContactsFax = dr["ContactsFax"].ToString(); 
                mdj.BuyerID = dr["BuyerID"].ToString();
                mdj.BuyerName = dr["BuyerName"].ToString();
                mdj.DepartMentID = dr["DepartMentID"].ToString();
                mdj.CurrencyID = dr["CurrencyID"].ToString();
                mdj.CurrencyRate = decimal.Parse(string.IsNullOrEmpty(dr["CurrencyRate"].ToString()) ? "0.00" : dr["CurrencyRate"].ToString());
                mdj.PaymentType = dr["PaymentType"].ToString();
                mdj.PaymentAmt = decimal.Parse(string.IsNullOrEmpty(dr["PaymentAmt"].ToString()) ? "0.00" : dr["PaymentAmt"].ToString());
                mdj.OtherAmt = decimal.Parse(string.IsNullOrEmpty(dr["OtherAmt"].ToString()) ? "0.00" : dr["OtherAmt"].ToString());
                mdj.TotalAmt = decimal.Parse(string.IsNullOrEmpty(dr["TotalAmt"].ToString()) ? "0.00" : dr["TotalAmt"].ToString());
                mdj.State = dr["State"].ToString();
                mdj.Remark = dr["Remark"].ToString();
                mdj.CreateBy = dr["CreateBy"].ToString();
                mdj.CreateAt = dr["CreateAt"].ToString();
                mdj.UpdateBy = dr["UpdateBy"].ToString();
                mdj.UpdateAt = dr["UpdateAt"].ToString();               
                mdj.PriceType = dr["PriceType"].ToString();
                mdj.Packing = dr["Packing"].ToString();

                lsHead.Add(mdj);
            }
            return lsHead;
        }

        //返回明細資料
        public static List<BuyDetails> GetBuyDetailsByID(string ID)
        {
            string strSql =
                @"SELECT ID,Ver,Seq,ProductMo,ProductID,ProductCdesc,Convert(varchar(10),ArriveDate,120) AS ArriveDate,CONVERT(int,OrderQty) AS OrderQty,OrderUnit,Price,
                PriceUnit,DiscountRate,DiscountAmt,TotalSum,Spec,Color,Weight,WeightUnit,Remarks  
                FROM dbo.pu_BuyDetails Where ID='" + ID + "' ORDER BY Seq";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<BuyDetails> lsDetails = new List<BuyDetails>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                BuyDetails mdj = new BuyDetails();
                DataRow dr = dt.Rows[i];
                mdj.ID = dr["ID"].ToString();
                mdj.Ver = int.Parse(dr["Ver"].ToString());
                mdj.Seq = dr["Seq"].ToString();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.ProductID = dr["ProductID"].ToString();
                mdj.ProductCdesc = dr["ProductCdesc"].ToString();
                mdj.ArriveDate = dr["ArriveDate"].ToString();               
                mdj.OrderQty = Convert.ToInt32(dr["OrderQty"]);
                mdj.OrderUnit = dr["OrderUnit"].ToString();
                mdj.Price = Convert.ToDecimal(dr["Price"]);
                mdj.PriceUnit = dr["PriceUnit"].ToString();
                mdj.DiscountRate = Convert.ToDecimal(string.IsNullOrEmpty(dr["DiscountRate"].ToString()) ? "0.00" : dr["DiscountRate"]);
                mdj.DiscountAmt = Convert.ToDecimal(string.IsNullOrEmpty(dr["DiscountAmt"].ToString()) ? "0.00" : dr["DiscountAmt"]);
                mdj.TotalSum = Convert.ToDecimal(string.IsNullOrEmpty(dr["TotalSum"].ToString()) ? "0.00" : dr["TotalSum"]); 
                mdj.Spec = dr["Spec"].ToString();
                mdj.Color = dr["Color"].ToString();
                mdj.Weight = Convert.ToDecimal(string.IsNullOrEmpty(dr["Weight"].ToString()) ? "0.00" : dr["Weight"]);
                mdj.WeightUnit = dr["WeightUnit"].ToString();
                mdj.Remarks = dr["Remarks"].ToString();                
                
                lsDetails.Add(mdj);
            }
            return lsDetails;
        }


        public static string UpdateOtherFare(BuyFare model)
        {
            string result = "";
            string strSql_i = "";
            string strSql_u = "";
            //string Seq = GetMaxSeq(model.ID, model.Ver);
            strSql_i = string.Format(
               @"Insert Into pu_BuyFare(ID,Ver,FareID, Name,FareSum,Qty,Price,UnitCode,ProductID) Values ('{0}','{1}', '{2}', '{3}', '{4}', '{5}', {6}, '{7}', '{8}')",
               model.ID, model.Ver, model.FareID, model.Name, model.FareSum, model.Qty,model.Price, model.UnitCode, model.ProductID);
            strSql_u = string.Format(
               @"Update pu_BuyFare Set Name='{3}',FareSum={4}, Qty={5},Price={6}, UnitCode='{7}', ProductID='{8}' WHERE ID='{0}' And Ver='{1}' And FareID='{2}'",
               model.ID, model.Ver, model.FareID, model.Name, model.FareSum, model.Qty,model.Price,model.UnitCode,model.ProductID );

            if (model.ActionType == "NEW")
                result = SQLHelper.ExecuteSqlUpdate(strSql_i);
            else
                result = SQLHelper.ExecuteSqlUpdate(strSql_u);
            return result;
        }

        public static string DeleteBuyDetails(string ID, int Ver, string Seq)
        {
            string result = "";
            string strSql = string.Format(@"Delete FROM pu_BuyDetails Where ID='{0}' and ver={1} AND Seq='{2}'", ID, Ver, Seq);
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;
        }

        public static string DeleteOtherFareByID(string ID, int Ver, string FareID)
        {
            string result = "";
            string strSql_d = string.Format(@"DELETE FROM pu_BuyFare Where ID='{0}' And Ver={1} And FareID='{2}'", ID, Ver, FareID);
            result = SQLHelper.ExecuteSqlUpdate(strSql_d);
            return result;
        }

        //返回其他費用明細資料
        public static List<BuyFare> GetOtherFareByID(BuyFare model)
        {
            string strSql = string.Format(@"Select * FROM pu_BuyFare Where ID='{0}' and Ver={1} ORDER BY FareID", model.ID, model.Ver);            
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<BuyFare> lsDetails = new List<BuyFare>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                BuyFare mdj = new BuyFare();
                DataRow dr = dt.Rows[i];
                mdj.ID = dr["ID"].ToString();
                mdj.Ver = int.Parse(dr["Ver"].ToString());
                mdj.FareID = dr["FareID"].ToString();
                mdj.Name = dr["Name"].ToString();
                mdj.Qty = int.Parse(dr["Qty"].ToString());
                mdj.UnitCode = dr["UnitCode"].ToString();
                mdj.Price = decimal.Parse(dr["Price"].ToString());
                mdj.FareSum = decimal.Parse(dr["FareSum"].ToString());
                mdj.ProductID = dr["ProductID"].ToString();

                lsDetails.Add(mdj);
            }
            return lsDetails;
        }

        //附加費用編碼查詢
        public static List<ItemInfo> FindOtherFareReturnList(string ProductID)
        {
            List<ItemInfo> lstItem = new List<ItemInfo>();
            string strSql = "SELECT id as ProductID,name as ProductCdesc,english_name as ProductEdesc FROM bs_tack_fare";
            //基本資料中提取
            if (string.IsNullOrEmpty(ProductID))
                strSql += " WHERE use_buy='1' AND state='0'";
            else
                strSql += string.Format(@" WHERE id='{0}' and use_buy = '1' AND state='0'", ProductID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                ItemInfo objModel = new ItemInfo();
                objModel.ProductID = dt.Rows[i]["ProductID"].ToString();
                objModel.ProductCdesc = dt.Rows[i]["ProductCdesc"].ToString();
                objModel.ProductEdesc = dt.Rows[i]["ProductEdesc"].ToString();
                lstItem.Add(objModel);
            }
            return lstItem;
        }

        public static List<FindList> FindReturnList(string ID, string VendorID, string OrderDate1, string OrderDate2, string DepartMentID, string ProductMo, string ProductID)
        {
            string strSql =
                @"Select a.ID,Convert(varchar(10),a.OrderDate,120) as OrderDate,a.VendorID,a.DepartMentID,b.Seq,b.ProductMo,b.ProductID,b.ProductCdesc,
                Convert(int,b.OrderQty) as OrderQty,b.OrderUnit,b.Price,b.PriceUnit,b.TotalSum FROM pu_BuyHead a,pu_BuyDetails b Where a.ID=b.ID AND a.Ver=b.Ver ";
            if (string.IsNullOrEmpty(ID) && string.IsNullOrEmpty(OrderDate1) && string.IsNullOrEmpty(OrderDate2) &&
                string.IsNullOrEmpty(VendorID) && string.IsNullOrEmpty(DepartMentID) && string.IsNullOrEmpty(ProductMo) &&
                string.IsNullOrEmpty(ProductID) 
                )
            {
                strSql += " AND 1=0 ";//返加空數據
            }
            else
            {
                if (!string.IsNullOrEmpty(ID))
                {
                    strSql += " AND a.ID Like '%" + ID + "%'";
                }
                if (!string.IsNullOrEmpty(OrderDate1))
                {
                    strSql += " AND a.OrderDate>='" + OrderDate1 + "'";
                }
                if (!string.IsNullOrEmpty(OrderDate2))
                {
                    strSql += " AND a.OrderDate<='" + OrderDate2 + "'";
                }
                if (!string.IsNullOrEmpty(VendorID))
                {
                    strSql += " AND a.VendorID Like '%" + VendorID + "%'";
                }
                if (!string.IsNullOrEmpty(DepartMentID))
                {
                    strSql += " AND a.DepartMentID Like '%" + DepartMentID + "%'";
                }
                strSql += " AND a.state<>'2'";
                if (!string.IsNullOrEmpty(ProductMo))
                {
                    strSql += " AND b.ProductMo Like '%" + ProductMo + "%'";
                }
                if (!string.IsNullOrEmpty(ProductID))
                {
                    strSql += " AND b.ProductID Like '%" + ProductID + "%'";
                }
            }
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<FindList> lstPur = new List<FindList>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                FindList mdj = new FindList();
                mdj.ID = dr["ID"].ToString();               
                mdj.OrderDate = dr["OrderDate"].ToString();               
                mdj.VendorID = dr["VendorID"].ToString();
                mdj.Seq = dr["Seq"].ToString();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.ProductID = dr["ProductID"].ToString();
                mdj.ProductCdesc = dr["ProductCdesc"].ToString();
                mdj.OrderQty = Convert.ToInt32(dr["OrderQty"].ToString());
                mdj.OrderUnit = dr["OrderUnit"].ToString();
                mdj.Price= string.IsNullOrEmpty(dr["Price"].ToString()) ? 0 : decimal.Parse(dr["Price"].ToString());
                mdj.PriceUnit = dr["PriceUnit"].ToString();
                mdj.TotalSum = string.IsNullOrEmpty(dr["TotalSum"].ToString()) ? 0 : decimal.Parse(dr["TotalSum"].ToString());
                mdj.DepartMentID = dr["DepartMentID"].ToString();

                lstPur.Add(mdj);
            }
            return lstPur;
        }

        //返回附加費中英文描述
        public static BaseDescription GetOtherFareByID(string strFareID)
        {
            string strSql = string.Format(@"Select name,english_name FROM bs_tack_fare with(nolock) WHERE id='{0}' and use_buy = '1' AND state='0'", strFareID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            BaseDescription objModel = new BaseDescription();
            if (dt.Rows.Count > 0)
            {
                objModel.Cdesc = dt.Rows[0]["name"].ToString();
                objModel.Edesc = dt.Rows[0]["english_name"].ToString();
            }
            else
            {
                objModel.Cdesc = "";
                objModel.Edesc = "";
            }
            return objModel;
        }

        public static List<PurReport> GetReportReturnList(string ID)
        {
            List<PurReport> lstModel = new List<PurReport>();
            string strSql = string.Format(
            @"SELECT S.* FROM
            (SELECT a.ID,CONVERT(VARCHAR(10),a.OrderDate,120) AS OrderDate,a.CurrencyID,dbo.fn_GetMoneySign(a.CurrencyID) AS Sign,a.Contacts,a.DepartMentID,a.CreateBy,Convert(varchar(10),a.CreateAt,120) AS CreateAt,
            b.ProductMo,b.ProductID,b.ProductCdesc,b.Spec,Convert(int,b.OrderQty) AS OrderQty,b.OrderUnit,b.Weight,b.WeightUnit,b.Color,b.Price,b.PriceUnit,
            b.TotalSum,CASE WHEN ISNULL(b.ArriveDate,'')<>'' THEN CONVERT(VARCHAR(10),b.ArriveDate,120) ELSE '' END AS ArriveDate,b.Remarks,
            c.name AS VendorName,d.name AS DeptName,b.Seq
            FROM dbo.pu_BuyHead a 
            INNER JOIN dbo.pu_BuyDetails b ON a.ID=b.ID AND a.Ver=b.Ver 
            INNER JOIN bs_vendor c ON a.VendorID=c.id
            INNER JOIN bs_department d ON a.DepartMentID=d.id 
            WHERE a.ID='{0}' AND a.State<>'2'
            UNION ALL
            SELECT a.ID,CONVERT(VARCHAR(10),a.OrderDate,120) AS OrderDate,a.CurrencyID,dbo.fn_GetMoneySign(a.CurrencyID) AS Sign,a.Contacts,a.DepartMentID,a.CreateBy,Convert(varchar(10),a.CreateAt,120) AS CreateAt,
            '' AS ProductMo,b.FareID AS ProductID,b.name AS ProductCdesc,'' AS Spec,Convert(int,b.Qty) AS OrderQty,'' AS OrderUnit,0 AS Weight,'' AS WeightUnit,'' AS Color,b.Price,b.UnitCode AS PriceUnit,
            b.FareSum,'' AS ArriveDate,'' AS Remarks,c.name AS VendorName,d.name AS DeptName,'ZZZ' AS Seq
            FROM dbo.pu_BuyHead a
            INNER JOIN dbo.pu_BuyFare b ON a.ID=b.ID AND a.Ver=b.Ver 
            INNER JOIN bs_vendor c ON a.VendorID=c.id
            INNER JOIN bs_department d ON a.DepartMentID=d.id 
            WHERE a.ID='{0}' AND a.State<>'2') S
            ORDER BY S.ID,Seq", ID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<PurReport> list = CommonUtils.DataTableToList<PurReport>(dt);
            return list;            
        }

        //private static string GetMaxSeq(string OcID, int Ver, string UpperSeq)
        //{
        //    string result = "";
        //    string strSql = "";
        //    strSql = string.Format("Select MAX(Seq) AS Seq FROM oc_OrderBom Where OcID='{0}' and Ver={1} and UpperSeq='{2}'", OcID, Ver, UpperSeq);
        //    DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
        //    if (dt.Rows.Count > 0)
        //        result = dt.Rows[0]["Seq"].ToString() != "" ? (Convert.ToInt32(dt.Rows[0]["Seq"]) + 1).ToString().PadLeft(3, '0') : "001";
        //    else
        //        result = "001";
        //    return result;
        //}

    }
}