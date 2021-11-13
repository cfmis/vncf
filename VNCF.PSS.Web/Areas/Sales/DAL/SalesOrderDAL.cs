using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using VNCF.PSS.Web.Areas.Sales.Models;
using VNCF.PSS.Web.Areas.Base.Models;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Common;

using System.IO;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;

namespace VNCF.PSS.Web.Areas.Sales.DAL
{
    public class SalesOrderDAL
    {
        static string strRemoteDB = "DGERP2.cferp.dbo.";//SQLHelper.RemoteDB;//
        static string ArtImagePath = DBUtility.ArtImagePath;
        public static string UpdateOcHead(Order_Head model)
        {
            string result = "";
            string strSql = "";
            string user_id = AdminUserContext.Current.LoginInfo.LoginName;

            strSql += string.Format(@" SET XACT_ABORT  ON ");
            strSql += string.Format(@" BEGIN TRANSACTION ");
            string OcID = "";
            //if (model.OcID == "" || model.OcID == null)
            //{
            //    Random rd = new Random();
            //    string dateTimeStr = System.DateTime.Now.ToString("yyyy/MM/dd hh:MM:dd");
            //    OcID = dateTimeStr.Substring(0, 4) + dateTimeStr.Substring(5, 2) + dateTimeStr.Substring(8, 2)
            //        + dateTimeStr.Substring(11, 2) + dateTimeStr.Substring(14, 2) + dateTimeStr.Substring(17, 2);// rd.Next(1, 1000000000).ToString();
            //}
            //else
            //    OcID = model.OcID;
            OcID = model.OcID;
            if (!CheckOcHead(OcID))
                strSql += string.Format(
                  @" Insert Into oc_OrderHead (OcID,Ver,OrderDate,CustomerID,CustomerCdesc,CustomerEdesc,OrderType,ReceivedDate,ForeignFirm,Area,
                  SallerID,Season,Contacts,ContactsTel,ContactsFax,ContactsEmail,Merchandisers,MerchandisersTel,MerchandisersEmail,CurrencyID,CurrencyRate,
                  DeliveredPort,DestinationPort,PoNo,PaymentType,PriceType, Transport,DiscountRate,Discount,TaxNo,Tax,ProductAmount,TotalAmount
                  ,BankAccount,State,Remark,CreateBy,CreateAt, CustomerAddress,SendAddress,CountryID) Values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}',
                  '{16}','{17}','{18}','{19}','{20}','{21}','{22}','{23}','{24}','{25}','{26}','{27}',{28},'{29}','{30}',{31},{32},'{33}','{34}','{35}','{36}',getdate(),'{37}','{38}','{39}')",
                  OcID, model.Ver, model.OrderDate, model.CustomerID, model.CustomerCdesc, model.CustomerEdesc, model.OrderType, model.ReceivedDate, model.ForeignFirm, model.Area, model.SallerID,
                  model.Season, model.Contacts, model.ContactsTel, model.ContactsFax, model.ContactsEmail, model.Merchandisers, model.MerchandisersTel, model.MerchandisersEmail, model.CurrencyID,
                  model.CurrencyRate, model.DeliveredPort, model.DestinationPort, model.PoNo, model.PaymentType, model.PriceType, model.Transport, model.DiscountRate, model.Discount, model.TaxNo,
                  model.Tax, model.ProductAmount, model.TotalAmount, model.BankAccount, model.State, model.Remark, user_id, model.CustomerAddress, model.SendAddress, model.CountryID);

            else
                strSql += string.Format(
               @"UPDATE oc_OrderHead SET Ver='{0}',OrderDate='{1}',CustomerID='{2}',CustomerCdesc='{3}',CustomerEdesc='{4}',OrderType='{5}',ReceivedDate='{6}',ForeignFirm='{7}',Area='{8}',
                SallerID='{9}',Season='{10}',Contacts='{11}',ContactsTel='{12}',ContactsFax='{13}',ContactsEmail='{14}',Merchandisers='{15}',MerchandisersTel='{16}',MerchandisersEmail='{17}',
                CurrencyID='{18}',CurrencyRate={19},DeliveredPort='{20}',DestinationPort='{21}',PoNo='{22}',PaymentType='{23}',PriceType='{24}',Transport='{25}',DiscountRate={26},Discount={27},
                TaxNo='{28}',Tax={29},ProductAmount={30},TotalAmount={31},BankAccount='{32}',State='{33}',Remark='{34}',UpdateBy='{35}',UpdateAt=getdate(),
                CustomerAddress='{36}',SendAddress='{37}',CountryID='{38}'
                WHERE OcID='{39}'",
                model.Ver, model.OrderDate, model.CustomerID, model.CustomerCdesc, model.CustomerEdesc, model.OrderType, model.ReceivedDate, model.ForeignFirm, model.Area,
                model.SallerID, model.Season, model.Contacts, model.ContactsTel, model.ContactsFax, model.ContactsEmail, model.Merchandisers, model.MerchandisersTel,
                model.MerchandisersEmail, model.CurrencyID, model.CurrencyRate, model.DeliveredPort, model.DestinationPort, model.PoNo, model.PaymentType, model.PriceType,
                model.Transport, model.DiscountRate, model.Discount, model.TaxNo, model.Tax, model.ProductAmount, model.TotalAmount, model.BankAccount, model.State, model.Remark, user_id,
                model.CustomerAddress, model.SendAddress, model.CountryID, model.OcID);

            strSql += string.Format(@" COMMIT TRANSACTION ");
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            if (result == "")
                result = "OK";
            else
                result = "ERROR";

            return result;
        }

        public static string UpdateHeadAmountByID(Order_Head model)
        {
            string result = "";
            string strSql = "";
            strSql += string.Format(@" SET XACT_ABORT  ON ");
            strSql += string.Format(@" BEGIN TRANSACTION ");            
            string user_id = AdminUserContext.Current.LoginInfo.LoginName;
            strSql += string.Format(
                @" Update oc_OrderHead SET TotalAmount={0},ProductAmount={1},Discount={2},UpdateBy='{3}',UpdateAt=GETDATE() 
                  WHERE OcID='{4}'", model.TotalAmount, model.ProductAmount, model.Discount,user_id, model.OcID);
            strSql += string.Format(@" COMMIT TRANSACTION ");
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            if (result == "")
                result = "OK";
            else
                result = "ERROR";
            return result;
        }
        
        private static bool CheckOcHead(string OcID)
        {
            bool result = true;
            string strSql = "Select OcID FROM oc_OrderHead Where OcID='" + OcID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = true;
            else
                result = false;
            return result;
        }

        //返回明細資料
        public static List<Order_Details> GetOcDetailsByID(string OcID)
        {
            string strSql =
                @"Select a.OcID, a.Ver, a.Seq, a.ProductMo, a.ProductMoVer, a.ProductID, a.ProductCdesc, a.BrandID, a.CustProductID, a.CustProductName, a.CustColorID,a. CustColorName, 
                a.CustSize,a.OrderQty, a.OrderUnit, a.Price, a.PriceUnit, a.RateDiscount, a.AmountDiscount, a.AmountProduct,a.MoState, a.Remarks, Convert(Varchar(10),a.PlanCompleteDate,111) AS PlanCompleteDate, 
                Convert(Varchar(10),a.ArriveDate,111) AS ArriveDate, Convert(Varchar(10),a.FactoryShipOutDate,111) AS FactoryShipOutDate, a.MoType, a.MoDept, a.MoGroup, a.StyleNo, 
                a.ContractID, a.GetColorSample, a.IsFree,a.IsPrint, a.OcRemark, a.InvoiceRemark, a.PlateRemark, a.ProductRemark,b.name,b.english_name,c.picture_name" +
                " FROM oc_OrderDetails a with(nolock)" +
                " Left Join it_goods b ON a.ProductID=b.id" +
                " Left Join cd_pattern c On b.blueprint_id=c.id" +
                " Where a.OcID='" + OcID + "'";
            strSql += " ORDER BY a.Seq Asc";

            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<Order_Details> lsDetails = new List<Order_Details>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                Order_Details mdj = new Order_Details();
                DataRow dr = dt.Rows[i];
                mdj.OcID = dr["OcID"].ToString();
                mdj.Ver = int.Parse(dr["Ver"].ToString());
                mdj.Seq = dr["Seq"].ToString();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.ProductMoVer = dr["ProductMoVer"].ToString();
                mdj.ProductID = dr["ProductID"].ToString();
                mdj.ProductCdesc = dr["ProductCdesc"].ToString();
                mdj.BrandID = dr["BrandID"].ToString();
                mdj.StyleNo = dr["StyleNo"].ToString();
                mdj.CustProductID = dr["CustProductID"].ToString();
                mdj.CustProductName = dr["CustProductName"].ToString();
                mdj.CustColorID = dr["CustColorID"].ToString();
                mdj.CustColorName = dr["CustColorName"].ToString();
                mdj.CustSize = dr["CustSize"].ToString();
                mdj.OrderQty = Convert.ToInt32(dr["OrderQty"]);
                mdj.OrderUnit = dr["OrderUnit"].ToString();
                mdj.Price = Convert.ToDecimal(dr["Price"]);
                mdj.PriceUnit = dr["PriceUnit"].ToString();
                mdj.RateDiscount = Convert.ToDecimal(string.IsNullOrEmpty(dr["RateDiscount"].ToString()) ? "0.00" : dr["RateDiscount"]);
                mdj.AmountDiscount = Convert.ToDecimal(string.IsNullOrEmpty(dr["AmountDiscount"].ToString()) ? "0.00" : dr["AmountDiscount"]);
                mdj.AmountProduct = Convert.ToDecimal(string.IsNullOrEmpty(dr["AmountProduct"].ToString()) ? "0.00" : dr["AmountProduct"]); //,AmountAfterDiscount
                mdj.MoState = dr["MoState"].ToString();
                mdj.Remarks = dr["Remarks"].ToString();
                mdj.PlanCompleteDate = dr["PlanCompleteDate"].ToString();
                mdj.ArriveDate = dr["ArriveDate"].ToString();
                mdj.FactoryShipOutDate = dr["FactoryShipOutDate"].ToString();
                mdj.MoType = dr["MoType"].ToString();
                mdj.MoDept = dr["MoDept"].ToString();
                mdj.MoGroup = dr["MoGroup"].ToString();
                mdj.ContractID = dr["ContractID"].ToString();
                mdj.GetColorSample = dr["GetColorSample"].ToString();
                mdj.IsFree = dr["IsFree"].ToString();
                mdj.IsPrint = dr["IsPrint"].ToString();
                mdj.OcRemark = dr["OcRemark"].ToString();
                mdj.InvoiceRemark = dr["InvoiceRemark"].ToString();
                mdj.PlateRemark = dr["PlateRemark"].ToString();
                mdj.ProductRemark = dr["ProductRemark"].ToString();
                //mdj.ArtImage = "file:/" + "/192.168.168.15/cf_artwork/Artwork/" + dr["picture_name"].ToString().Trim().Replace("\\", "/");
                mdj.ArtImage = ArtImagePath + dr["picture_name"].ToString().Trim().Replace("\\", "/");
                lsDetails.Add(mdj);
            }
            return lsDetails;
        }

        //返回SalesBOM明細資料
        //public static List<SalesBom> GetSalesBomByID(string OcID,int Ver,string UpperSeq,string ProductID)
        public static List<SalesBom> GetSalesBomByID(SalesBom model)
        {
            /*
            string strSql =string.Format(
                @"Select a.OcID, a.Ver,a.UpperSeq, a.Seq, a.PrimaryKey,a.ProductID, b.name as ProductCdesc, a.Dosage, a.UnitCode, a.Remark,
                Isnull(a.ActualToHKQty,0) AS ActualToHKQty,Convert(Varchar(10),a.ActualToHKDate,111) AS ActualToHKDate 
                FROM oc_OrderBom a Left Join it_goods b ON a.ProductID=b.id                
                Where a.OcID='{0}' and Ver={1} and UpperSeq='{2}' ORDER BY a.Seq",model.OcID,model.Ver,model.UpperSeq);
            */
            //2021-03-12改為從geo查出SalesBOM
            string strSql = string.Format(
               @"SELECT '' AS OcID,'0' AS Ver,'' AS UpperSeq,'' AS Seq,B.primary_key AS PrimaryKey,B.goods_id AS ProductID,C.name AS ProductCdesc,
                Convert(int,B.dosage) AS Dosage,B.unit_code AS UnitCode,'' AS Remark,0 AS ActualToHKQty,'' AS ActualToHKDate
                FROM {0}it_bom_mostly A 
                INNER JOIN {0}it_bom B ON A.within_code=B.within_code AND A.id=B.id AND A.exp_id=B.exp_id
                INNER JOIN {0}it_goods C ON B.within_code=C.within_code AND B.goods_id=C.id
                WHERE A.within_code='0000'", strRemoteDB);
            if (!string.IsNullOrEmpty(model.ProductID))
            {
                strSql += string.Format(" AND A.id Like '{0}%'", model.ProductID);
            }
            else
            {
                strSql += " AND 1=0";//返回空數據
            }

            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<SalesBom> lsDetails = new List<SalesBom>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                SalesBom mdj = new SalesBom();
                DataRow dr = dt.Rows[i];
                mdj.OcID = dr["OcID"].ToString();
                mdj.Ver = int.Parse(dr["Ver"].ToString());
                mdj.UpperSeq = dr["UpperSeq"].ToString();
                mdj.Seq = dr["Seq"].ToString();
                mdj.PrimaryKey = dr["PrimaryKey"].ToString();
                mdj.ProductID = dr["ProductID"].ToString();
                mdj.ProductCdesc = dr["ProductCdesc"].ToString();
                mdj.Dosage = int.Parse(dr["Dosage"].ToString());
                mdj.UnitCode = dr["UnitCode"].ToString();
                mdj.Remark = dr["Remark"].ToString();
                mdj.ActualToHKQty = Convert.ToInt32(dr["ActualToHKQty"]);
                mdj.ActualToHKDate = dr["ActualToHKDate"].ToString();

                lsDetails.Add(mdj);
            }
            return lsDetails;
        }

        public static Order_Head GetOcHeadByID(string OcID)
        {
            string strSql =
            @"SELECT OcID,Ver,Convert(Varchar(10),OrderDate,111) AS OrderDate,CustomerID,CustomerCdesc,CustomerEdesc,OrderType,Convert(Varchar(10),ReceivedDate,111) AS ReceivedDate,
            ForeignFirm,Area,SallerID,Season,Contacts,ContactsTel,ContactsFax,ContactsEmail,Merchandisers,MerchandisersTel,MerchandisersEmail,CurrencyID,CurrencyRate,DeliveredPort,DestinationPort,
            PoNo,PaymentType,PriceType,Transport,DiscountRate,Discount,TaxNo,Tax,ProductAmount,TotalAmount,BankAccount,State,Remark,CreateBy,CreateAt,UpdateBy,UpdateAt, 
            CustomerAddress,SendAddress,CountryID
            FROM dbo.oc_OrderHead Where OcID='" + OcID + "'";
            Order_Head mdj = new Order_Head();
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
            {
                DataRow dr = dt.Rows[0];
                mdj.OcID = dr["OcID"].ToString();
                mdj.Ver = Convert.ToInt32(dr["Ver"]);
                mdj.OrderDate = dr["OrderDate"].ToString();
                mdj.CustomerID = dr["CustomerID"].ToString();
                mdj.CustomerCdesc = dr["CustomerCdesc"].ToString();
                mdj.CustomerEdesc = dr["CustomerEdesc"].ToString();
                mdj.OrderType = dr["OrderType"].ToString();
                mdj.ReceivedDate = dr["ReceivedDate"].ToString();
                mdj.ForeignFirm = dr["ForeignFirm"].ToString();
                mdj.Area = dr["Area"].ToString();
                mdj.SallerID = dr["SallerID"].ToString();
                mdj.Season = dr["Season"].ToString();
                mdj.Contacts = dr["Contacts"].ToString();
                mdj.ContactsTel = dr["ContactsTel"].ToString();
                mdj.ContactsFax = dr["ContactsFax"].ToString();
                mdj.ContactsEmail = dr["ContactsEmail"].ToString();
                mdj.Merchandisers = dr["Merchandisers"].ToString();
                mdj.MerchandisersTel = dr["MerchandisersTel"].ToString();
                mdj.MerchandisersEmail = dr["MerchandisersEmail"].ToString();
                mdj.CurrencyID = dr["CurrencyID"].ToString();
                mdj.CurrencyRate = dr["CurrencyRate"].ToString();
                mdj.DeliveredPort = dr["DeliveredPort"].ToString();
                mdj.DestinationPort = dr["DestinationPort"].ToString();
                mdj.PoNo = dr["PoNo"].ToString();
                mdj.PaymentType = dr["PaymentType"].ToString();
                mdj.PriceType = dr["PriceType"].ToString();
                mdj.Transport = dr["Transport"].ToString();
                mdj.DiscountRate = decimal.Parse(string.IsNullOrEmpty(dr["DiscountRate"].ToString()) ? "0.00" : dr["DiscountRate"].ToString());
                mdj.Discount = decimal.Parse(string.IsNullOrEmpty(dr["Discount"].ToString()) ? "0.00" : dr["Discount"].ToString());
                mdj.TaxNo = dr["TaxNo"].ToString();
                mdj.Tax = decimal.Parse(string.IsNullOrEmpty(dr["Tax"].ToString()) ? "0.00" : dr["Tax"].ToString());
                mdj.ProductAmount = decimal.Parse(string.IsNullOrEmpty(dr["ProductAmount"].ToString()) ? "0.00" : dr["ProductAmount"].ToString());
                mdj.TotalAmount = decimal.Parse(string.IsNullOrEmpty(dr["TotalAmount"].ToString()) ? "0.00" : dr["TotalAmount"].ToString());
                mdj.BankAccount = dr["BankAccount"].ToString();
                mdj.State = dr["State"].ToString();
                mdj.Remark = dr["Remark"].ToString();
                mdj.CreateBy = dr["CreateBy"].ToString();
                mdj.CreateAt = dr["CreateAt"].ToString();
                mdj.UpdateBy = dr["UpdateBy"].ToString();
                mdj.UpdateAt = dr["UpdateAt"].ToString();
                mdj.CustomerAddress = dr["CustomerAddress"].ToString();
                mdj.SendAddress = dr["SendAddress"].ToString();
                mdj.CountryID = dr["CountryID"].ToString();

            }

            return mdj;
        }
        public static List<Order_Head> GetOcHeadReturnList(Order_Head model)
        {
            string strSql =
                @"Select top 1000 a.OcID,a.Ver,Convert(varchar(10),a.OrderDate,120) as OrderDate,a.CustomerID,a.State, isnull(b.RateDiscount,0) as RateDiscount,
                Isnull(b.AmountDiscount,0.00) as AmountDiscount,Isnull(b.AmountProduct,0.00) as AmountProduct,b.ProductMo,b.ProductID,b.ProductCdesc,
                Isnull(b.OrderQty,0) AS OrderQty,b.OrderUnit,Isnull(b.Price,0.00) as Price,b.PriceUnit,b.MoState
                FROM oc_OrderHead a with(nolock) Left Join oc_OrderDetails b with(nolock) On a.OcID=b.OcID AND a.Ver=b.Ver Where 1>0 ";
            if (!string.IsNullOrEmpty(model.OcID))
            {
                strSql += " AND a.OcID Like '%" + model.OcID + "%'";
            }
            if (!string.IsNullOrEmpty(model.OrderDate))
            {
                strSql += " AND a.OrderDate='" + model.OrderDate + "'";
            }
            if (!string.IsNullOrEmpty(model.ReceivedDate))
            {
                strSql += " AND a.ReceivedDate='" + model.ReceivedDate + "'";
            }
            if (!string.IsNullOrEmpty(model.Area))
            {
                strSql += " AND a.Area Like '%" + model.Area + "%'";
            }
            if (!string.IsNullOrEmpty(model.CustomerID))
            {
                strSql += " AND a.CustomerID Like '%" + model.CustomerID + "%'";
            }
            if (!string.IsNullOrEmpty(model.ForeignFirm))
            {
                strSql += " AND a.ForeignFirm Like '%" + model.ForeignFirm + "%'";
            }
            if (!string.IsNullOrEmpty(model.Season))
            {
                strSql += " AND a.Season Like '%" + model.Season + "%'";
            }
            if (!string.IsNullOrEmpty(model.SallerID))
            {
                strSql += " AND a.SallerID Like '%" + model.SallerID + "%'";
            }
            strSql += " AND a.state<>'2'";
            if (!string.IsNullOrEmpty(model.ContractID))
            {
                strSql += " AND b.ContractID Like '%" + model.ContractID + "%'";
            }
            if (!string.IsNullOrEmpty(model.BrandID))
            {
                strSql += " AND b.BrandID Like '%" + model.BrandID + "%'";
            }
            if (!string.IsNullOrEmpty(model.ProductMo))
            {
                strSql += " AND b.ProductMo Like '%" + model.ProductMo + "%'";
            }
            if (!string.IsNullOrEmpty(model.ProductID))
            {
                strSql += " AND b.ProductID Like '%" + model.ProductID + "%'";
            }
            //if (string.IsNullOrEmpty(model.OcID) && string.IsNullOrEmpty(model.OrderDate) && string.IsNullOrEmpty(model.ReceivedDate) &&
            //    string.IsNullOrEmpty(model.Area) && string.IsNullOrEmpty(model.CustomerID) && string.IsNullOrEmpty(model.ForeignFirm) &&
            //    string.IsNullOrEmpty(model.Season) && string.IsNullOrEmpty(model.SallerID) && string.IsNullOrEmpty(model.ContractID) &&
            //    string.IsNullOrEmpty(model.BrandID) && string.IsNullOrEmpty(model.ProductMo) && string.IsNullOrEmpty(model.ProductID)
            //    )
            //{
            //    strSql += " AND 1=0 ";//返加空數據
            //}
            //else
            //{
            //
            //}

            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<Order_Head> lsOrder = new List<Order_Head>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                Order_Head mdj = new Order_Head();
                mdj.OcID = dr["OcID"].ToString();
                mdj.Ver = Convert.ToInt32(dr["Ver"]);
                mdj.OrderDate = dr["OrderDate"].ToString();
                mdj.State = dr["State"].ToString();
                mdj.CustomerID = dr["CustomerID"].ToString();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.MoState = dr["MoState"].ToString();
                mdj.ProductID = dr["ProductID"].ToString();
                mdj.ProductCdesc = dr["ProductCdesc"].ToString();
                mdj.OrderQty = Convert.ToInt32(dr["OrderQty"]);
                mdj.OrderUnit = dr["OrderUnit"].ToString();
                mdj.Price = string.IsNullOrEmpty(dr["Price"].ToString()) ? 0 : decimal.Parse(dr["Price"].ToString());
                mdj.PriceUnit = dr["PriceUnit"].ToString();
                mdj.RateDiscount = string.IsNullOrEmpty(dr["RateDiscount"].ToString()) ? 0 : decimal.Parse(dr["RateDiscount"].ToString());
                mdj.AmountDiscount = string.IsNullOrEmpty(dr["AmountDiscount"].ToString()) ? 0 : decimal.Parse(dr["AmountDiscount"].ToString());
                mdj.AmountProduct = string.IsNullOrEmpty(dr["AmountProduct"].ToString()) ? 0 : decimal.Parse(dr["AmountProduct"].ToString());

                lsOrder.Add(mdj);
            }
            return lsOrder;
        }
        public static string UpdateOcDetails(Order_Details model)
        {
            string result = "";
            string strSql_i = "";
            string strSql_u = "";
            string Seq = GetMaxSeq(model.OcID);
            strSql_i += string.Format(@" SET XACT_ABORT ON ");
            strSql_i += string.Format(@" BEGIN TRANSACTION ");
            strSql_i += string.Format(
               @" Insert Into oc_OrderDetails(OcID, Ver, Seq, ProductMo, ProductMoVer, ProductID, ProductCdesc, BrandID, CustProductID, CustProductName, CustColorID, CustColorName, CustSize, 
                OrderQty, OrderUnit, Price, PriceUnit, RateDiscount, AmountDiscount, AmountProduct, Remarks, PlanCompleteDate, ArriveDate, FactoryShipOutDate, 
                MoType, MoDept, MoGroup, StyleNo, ContractID, GetColorSample, IsFree, OcRemark, InvoiceRemark, PlateRemark, ProductRemark,MoState,IsPrint) Values (
               '{0}','{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}', '{10}', '{11}', '{12}', {13}, '{14}', {15}, '{16}', {17}, {18}, {19}, 
               '{20}','{21}', '{22}', '{23}', '{24}', '{25}', '{26}', '{27}', '{28}', '{29}', '{30}','{31}', '{32}', '{33}', '{34}','{35}','{36}')",
               model.OcID, model.Ver, Seq, model.ProductMo, model.ProductMoVer, model.ProductID, model.ProductCdesc, model.BrandID, model.CustProductID, model.CustProductName,
               model.CustColorID, model.CustColorName, model.CustSize, model.OrderQty, model.OrderUnit, model.Price, model.PriceUnit, model.RateDiscount, model.AmountDiscount, model.AmountProduct,
               model.Remarks, model.PlanCompleteDate, model.ArriveDate, model.FactoryShipOutDate, model.MoType, model.MoDept, model.MoGroup, model.StyleNo, model.ContractID,
               model.GetColorSample, model.IsFree == "1" ? "1" : "0", model.OcRemark, model.InvoiceRemark, model.PlateRemark, model.ProductRemark, model.MoState, model.IsPrint == "1" ? "1" : "0");
            //model.GetColorSample, model.IsFree == "on" ? "1" : "0", model.OcRemark, model.InvoiceRemark, model.PlateRemark, model.ProductRemark, model.MoState,model.IsPrint == "on" ? "1" : "0");
            /*20210312取消插入新記錄時自動添加SalesBOM
            strSql_i += string.Format(
               @" Insert Into oc_OrderBom(OcID, Ver, UpperSeq,Seq,PrimaryKey,ProductID,Dosage,UnitCode) Values('{0}','{1}', '{2}', '{3}','{4}','{5}',{6},'{7}')",
               model.OcID, model.Ver, Seq,"001","1", model.ProductID,1,"PCS");
            */
            strSql_i += string.Format(@" COMMIT TRANSACTION ");

            strSql_u = string.Format(
               @"Update oc_OrderDetails 
               Set ProductMo='{3}',ProductMoVer='{4}',ProductID='{5}',ProductCdesc='{6}',BrandID ='{7}',CustProductID='{8}',CustProductName='{9}',CustColorID='{10}',CustColorName='{11}', 
               CustSize='{12}',OrderQty={13},OrderUnit='{14}',Price={15}, PriceUnit='{16}',RateDiscount={17},AmountDiscount={18},AmountProduct={19} ,Remarks='{20}',PlanCompleteDate='{21}',
               ArriveDate='{22}',FactoryShipOutDate='{23}',MoType='{24}',MoDept='{25}',MoGroup='{26}',StyleNo='{27}',ContractID='{28}',GetColorSample='{29}',IsFree='{30}',
               OcRemark='{31}',InvoiceRemark='{32}',PlateRemark='{33}',ProductRemark='{34}',MoState='{35}',IsPrint='{36}'
               WHERE OcID='{0}' And Ver='{1}' And Seq='{2}'", model.OcID, model.Ver, model.Seq,
               model.ProductMo, model.ProductMoVer, model.ProductID, model.ProductCdesc, model.BrandID, model.CustProductID, model.CustProductName, model.CustColorID, model.CustColorName, model.CustSize,
               model.OrderQty, model.OrderUnit, model.Price, model.PriceUnit, model.RateDiscount, model.AmountDiscount, model.AmountProduct, model.Remarks, model.PlanCompleteDate, model.ArriveDate,
               model.FactoryShipOutDate, model.MoType, model.MoDept, model.MoGroup, model.StyleNo, model.ContractID, model.GetColorSample, model.IsFree == "1" ? "1" : "0", model.OcRemark,
               model.InvoiceRemark, model.PlateRemark, model.ProductRemark, model.MoState, model.IsPrint == "1" ? "1" : "0");
            //model.FactoryShipOutDate, model.MoType, model.MoDept, model.MoGroup, model.StyleNo, model.ContractID, model.GetColorSample, model.IsFree == "on" ? "1" : "0", model.OcRemark,
            //model.InvoiceRemark, model.PlateRemark, model.ProductRemark, model.MoState, model.IsPrint == "on" ? "1" : "0");

            if (model.ActionType == "NEW")
                result = SQLHelper.ExecuteSqlUpdate(strSql_i);
            else
                result = SQLHelper.ExecuteSqlUpdate(strSql_u);
            return result;
        }
        private static string GetMaxSeq(string OcID)
        {
            string result = "";
            string strSql = "";
            strSql = string.Format("Select MAX(Seq) AS Seq FROM oc_OrderDetails Where OcID='{0}'", OcID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = dt.Rows[0]["Seq"].ToString() != "" ? (Convert.ToInt32(dt.Rows[0]["Seq"]) + 1).ToString().PadLeft(3, '0') : "001";
            else
                result = "001";
            return result;
        }

        public static string DeleteOcDetails(string OcID, int Ver, string Seq)
        {
            string result = "";
            string strSql = string.Format(@"Delete FROM oc_OrderDetails Where OcID='{0}' and ver={1} AND Seq='{2}'", OcID, Ver, Seq);
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;
        }

        public static string CancelOcDetails(string OcID, int Ver, string Seq)
        {
            string result = "";
            string strSql = string.Format(@"UPDATE oc_OrderDetails SET MoState='2' WHERE OcID='{0}' and ver={1} AND Seq='{2}'", OcID, Ver, Seq);
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;
        }

        //返回數量單位資料
        public static List<baseUnit> GetQtyUnitReturnList()//string GetQtyUnitReturnList()//
        {
            string strSql = "Select id,id as name FROM bs_unit Where kind ='05'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<baseUnit> lstUnit = new List<baseUnit>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                baseUnit objModel = new baseUnit();
                objModel.id = dt.Rows[i]["id"].ToString();
                objModel.name = dt.Rows[i]["name"].ToString();
                lstUnit.Add(objModel);
            }
            return lstUnit;
        }

        //返回貨幣匯率
        public static decimal GetCurrencyRateByID(string strCurrencyID)
        {
            decimal decRate = 0;
            string strSql = string.Format(
                @"SELECT A.exchange_rate FROM bs_exchange_rate A,
                (Select id, max(days) as days FROM bs_exchange_rate Where state <> '2' group by id) S
                WHERE A.id = S.id And A.days = S.days AND A.id = '{0}'", strCurrencyID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
            {
                decRate = decimal.Parse(dt.Rows[0]["exchange_rate"].ToString());
            }
            else
            {
                decRate = 0;
            }

            return decRate;
        }

        //返回客戶中英文描述
        public static BaseDescription GetCustomerByID(string strCustomerID)
        {
            string strSql = string.Format("Select name,english_name FROM dbo.bs_customer with(nolock) Where id='{0}' and state <>'2'", strCustomerID);
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

        //返回客戶信息
        public static CustomerInfo GetCustomerInfoByID(string strCustomerID)
        {
            string strSql = string.Format(
                @"SELECT A.id, A.name as CustomerCdesc,A.english_name as CustomerEdesc,A.shipment_s_address as CustomerAddress,
                A.shipment_s_address as SendAddress,A.c_code AS CountryID,A.shipment_linkman AS Contacts,A.shipment_phone AS ContactsTel,
                A.shipment_fax AS ContactsFax,A.shipment_email AS ContactsEmail,A.money_id as CurrencyID,S.exchange_rate AS CurrencyRate
                From bs_customer A 
	                INNER JOIN (SELECT aa.id,aa.exchange_rate      
				                FROM bs_exchange_rate aa 
				                INNER JOIN (SELECT id,Max(days) as days FROM bs_exchange_rate group by id) bb on aa.id=bb.id and aa.days=bb.days
				                ) S ON A.money_id=S.id
                WHERE A.id='{0}' and A.state <>'2'",strCustomerID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);

            CustomerInfo objModel = new CustomerInfo();
            if (dt.Rows.Count > 0)
            {
                objModel.Id = dt.Rows[0]["id"].ToString();
                objModel.CustomerCdesc = dt.Rows[0]["CustomerCdesc"].ToString();
                objModel.CustomerEdesc = dt.Rows[0]["CustomerEdesc"].ToString();
                objModel.CustomerAddress = dt.Rows[0]["CustomerAddress"].ToString();
                objModel.SendAddress = dt.Rows[0]["SendAddress"].ToString();
                objModel.CountryID = dt.Rows[0]["CountryID"].ToString();
                objModel.Contacts = dt.Rows[0]["Contacts"].ToString();
                objModel.ContactsTel = dt.Rows[0]["ContactsTel"].ToString();
                objModel.ContactsFax = dt.Rows[0]["ContactsFax"].ToString();
                objModel.ContactsEmail = dt.Rows[0]["ContactsEmail"].ToString();
                objModel.CurrencyID = dt.Rows[0]["CurrencyID"].ToString();
                objModel.CurrencyRate = string.IsNullOrEmpty(dt.Rows[0]["CurrencyRate"].ToString()) ? 0 : decimal.Parse(dt.Rows[0]["CurrencyRate"].ToString());
            }
            else
            {
                objModel.Id = "";
                objModel.CustomerCdesc = "";
                objModel.CustomerEdesc = "";
                objModel.CustomerAddress = "";
                objModel.SendAddress = "";
                objModel.CountryID = "";
                objModel.Contacts = "";
                objModel.ContactsTel = "";
                objModel.ContactsFax = "";
                objModel.ContactsEmail = "";
                objModel.CurrencyID = "";
                objModel.CurrencyRate = 0;
            }
            return objModel;
        }

        //返回貨品中英文描述
        public static BaseDescription GetProductByID(string strProductID)
        {
            string strSql = string.Format(@"Select name,english_name FROM {0}it_goods with(nolock) Where id='{1}' and state <>'2'", strRemoteDB, strProductID);
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

        //最大單據號
        public static string GetMaxOcID(string strArea)
        {
            strArea = strArea + "CO";
            string strSql = string.Format("Select dbo.fn_GetMaxOcID('{0}') as max_id", strArea);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            string id = dt.Rows.Count > 0 ? dt.Rows[0]["max_id"].ToString() : "";
            return id;
        }

        public static string GetMoSerialNo(string strMoType, string strMoDept, string strMoGroup)
        {
            string strMaxMo = "";
            string strSql = string.Format("SELECT pkey, bill_code FROM sys_bill_max Where bill_id='SO02' AND bill_text1='{0}' AND bill_text2='{1}' AND bill_text3='{2}'", strMoType, strMoDept, strMoGroup);
            string strSql_u = "";
            DataTable dtblMaxMo = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dtblMaxMo.Rows.Count > 0)
            {
                strMaxMo = dtblMaxMo.Rows[0]["bill_code"].ToString().Substring(0, 3) + (int.Parse(dtblMaxMo.Rows[0]["bill_code"].ToString().Substring(3, 6)) + 1).ToString("000000");
                strSql_u = string.Format(@"Update sys_bill_max set bill_code='{0}' WHERE pkey={1}", strMaxMo, dtblMaxMo.Rows[0]["pkey"]);
            }
            else
            {
                strMaxMo = strMoType + strMoDept + strMoGroup + "000001";
                strSql_u = string.Format(@"Insert Into sys_bill_max(bill_id,bill_code,bill_text1,bill_text2,bill_text3) values('{0}','{1}','{2}','{3}','{4}')", "SO02", strMaxMo, strMoType, strMoDept, strMoGroup);
            }
            SQLHelper.ExecuteSqlUpdate(strSql_u);
            return strMaxMo;
        }


        //返回數量單位轉換率
        public static decimal GetQuantityUnitRateByID(string strID)
        {
            decimal decRate = 0;
            string strSql = string.Format("Select rate from it_coding where id='*' and basic_unit='PCS' and unit_code='{0}' and state ='0'", strID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
            {
                decRate = decimal.Parse(dt.Rows[0]["rate"].ToString());
            }
            else
            {
                decRate = 0;
            }
            return decRate;
        }

        //返回明細的總金額
        public static decimal GetTotalAmountByID(string strOcID, int Ver, string Seq)
        {
            decimal decTotalAmount = 0;
            string strSql = string.Format("Select Sum(AmountProduct) As AmountProduct From oc_OrderDetails With(nolock) WHERE OcID='{0}' And Ver={1} And Seq<>'{2}' AND MoState<>'2' And IsFree=0", strOcID, Ver, Seq);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
            {
                decTotalAmount = string.IsNullOrEmpty(dt.Rows[0]["AmountProduct"].ToString()) ? 0 : decimal.Parse(dt.Rows[0]["AmountProduct"].ToString());
            }
            else
            {
                decTotalAmount = 0;
            }
            return decTotalAmount;
        }


        //返回SalesBOM
        public static List<SalesBom> GetSalesBomByID(string strOcID, int Ver)
        {
            string strSql = string.Format("Select a.*,b.name as ProductCdesc,b.do_color From oc_OrderBom a With(nolock),it_goods b WHERE a.ProductID=b.id and a.OcID='{0}' And a.Ver={1}", strOcID, Ver);
            List<SalesBom> lstBom = new List<SalesBom>();
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                SalesBom objModel = new SalesBom();
                objModel.OcID = dt.Rows[i]["OcID"].ToString();
                objModel.Ver = int.Parse(dt.Rows[i]["Ver"].ToString());
                objModel.UpperSeq = dt.Rows[i]["UpperSeq"].ToString();
                objModel.Seq = dt.Rows[i]["Seq"].ToString();
                objModel.PrimaryKey = dt.Rows[i]["PrimaryKey"].ToString();
                objModel.ProductID = dt.Rows[i]["ProductID"].ToString();
                objModel.ProductCdesc = dt.Rows[i]["ProductCdesc"].ToString();
                objModel.Dosage = int.Parse(dt.Rows[i]["Dosage"].ToString());
                objModel.UnitCode = dt.Rows[i]["UnitCode"].ToString();
                objModel.Remark = dt.Rows[i]["Remark"].ToString();
                objModel.DoColor = dt.Rows[i]["do_color"].ToString();
                objModel.ActualToHKQty = string.IsNullOrEmpty(dt.Rows[i]["ActualToHKQty"].ToString()) ? 0 : decimal.Parse(dt.Rows[i]["ActualToHKQty"].ToString());
                objModel.ActualToHKDate = dt.Rows[i]["ActualToHKDate"].ToString();
                lstBom.Add(objModel);
            }
            return lstBom;
        }

        public static string UpdateSalesBom(SalesBom model)
        {
            string result = "";
            string strSql_i = "";
            string strSql_u = "";
            string Seq = GetMaxSeq(model.OcID, model.Ver, model.UpperSeq);
            strSql_i = string.Format(
               @"Insert Into oc_OrderBom(OcID,Ver,UpperSeq,Seq,PrimaryKey,ProductID,Dosage,UnitCode,Remark) Values ('{0}','{1}', '{2}', '{3}', '{4}', '{5}', {6}, '{7}', '{8}')",
               model.OcID, model.Ver, model.UpperSeq, Seq, model.PrimaryKey, model.ProductID, model.Dosage, model.UnitCode, model.Remark);
            strSql_u = string.Format(
               @"Update oc_OrderBom Set PrimaryKey='{4}',ProductID='{5}',Dosage={6},UnitCode='{7}',Remark ='{8}' WHERE OcID='{0}' And Ver='{1}' And UpperSeq='{2}' And Seq='{3}'",
               model.OcID, model.Ver, model.UpperSeq, model.Seq, model.PrimaryKey, model.ProductID, model.Dosage, model.UnitCode, model.Remark);

            if (model.ActionType == "NEW")
                result = SQLHelper.ExecuteSqlUpdate(strSql_i);
            else
                result = SQLHelper.ExecuteSqlUpdate(strSql_u);
            return result;
        }

        private static string GetMaxSeq(string OcID, int Ver, string UpperSeq)
        {
            string result = "";
            string strSql = "";
            strSql = string.Format("Select MAX(Seq) AS Seq FROM oc_OrderBom Where OcID='{0}' and Ver={1} and UpperSeq='{2}'", OcID, Ver, UpperSeq);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = dt.Rows[0]["Seq"].ToString() != "" ? (Convert.ToInt32(dt.Rows[0]["Seq"]) + 1).ToString().PadLeft(3, '0') : "001";
            else
                result = "001";
            return result;
        }

        public static string DeleteSalesBomByID(string OcID, int Ver, string UpperSeq, string Seq)
        {
            string result = "";
            string strSql_d = string.Format(@"DELETE FROM oc_OrderBom Where OcID='{0}' And Ver={1} And UpperSeq='{2}' And Seq='{3}'", OcID, Ver, UpperSeq, Seq);
            result = SQLHelper.ExecuteSqlUpdate(strSql_d);
            return result;
        }

        //產品編碼查詢
        public static List<ItemInfo> FindItemReturnList(string ProductID, string Type)
        {
            List<ItemInfo> lstItem = new List<ItemInfo>();           
            //2021-03-13 改為只取BOM數據
            string strSql = "";
            if (Type == "3")
            {
                //BOM表中提取
                strSql = string.Format(
                @"Select top 500 A.goods_id as ProductID,B.name as ProductCdesc,B.english_name as ProductEdesc,'成品(Finished Product)' AS Type
                From {0}it_bom_mostly A with(nolock) 
                INNER JOIN {0}it_goods B With(nolock) ON A.within_code=B.within_code AND A.goods_id=B.id
                WHERE A.within_code='0000' ", strRemoteDB);
                if (string.IsNullOrEmpty(ProductID))
                    strSql += " AND A.id Like 'F0-%' And A.type = '0002' and A.state <> '2'";
                else
                    strSql += string.Format(" AND A.id Like '%{0}%' And A.type='0002' and A.state<>'2'", ProductID);
            }
            else
            {
                //基本資料中提取
                strSql = string.Format(
                @"Select top 500 id as ProductID,name as ProductCdesc,english_name as ProductEdesc,
                Case modality
                    When '0' then '自制(Made)'
                    When '1' then '委外加工(Consign)'
                    When '2' then '採購(Purcharse)'
                    When '3' then '成品(Finished Product)'
                    ELSE ''
                End as Type
                From {0}it_goods With(nolock) 
                WHERE within_code='0000' ", strRemoteDB);
                if (string.IsNullOrEmpty(ProductID))
                    strSql += string.Format(" And modality='{0}' and state<>'2'",Type);
                else
                    strSql += string.Format(" And id Like '%{0}%' And modality='{1}' and state<>'2'", ProductID, Type);
            }

            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                ItemInfo objModel = new ItemInfo();
                objModel.ProductID = dt.Rows[i]["ProductID"].ToString();
                objModel.ProductCdesc = dt.Rows[i]["ProductCdesc"].ToString();
                objModel.ProductEdesc = dt.Rows[i]["ProductEdesc"].ToString();
                objModel.Type = dt.Rows[i]["Type"].ToString();
                lstItem.Add(objModel);
            }            
            return lstItem;
        }

        //GEO中查詢越南採購信息
        public static List<PurchaseInfo> ImportOrderFromGeo(PurchaseInfo model)
        {
            List<PurchaseInfo> lstItem = new List<PurchaseInfo>();
            if (model != null)
            {
                string strSql = string.Format(
                @"SELECT Top 500 A.id,A.ver,A.vendor_id AS VendorID,CONVERT(VARCHAR(10),A.order_date,120) AS OrderDate,
                B.mo_id AS ProductMo,B.goods_id AS ProductID,B.goods_name As ProductCdesc,Convert(int,B.order_qty) AS OrderQty,B.unit_code AS UnitCode,
                Isnull(B.sec_qty,0.0) AS SecQty,B.sec_unit AS SecUnit,C.english_name AS ProductEdesc,D.name AS VendorName
                FROM {0}po_buy_manage A with(nolock)
                INNER JOIN {0}po_buy_details B with(nolock) ON A.within_code=B.within_code and A.id=B.id
                INNER JOIN {0}it_goods C ON B.within_code=C.within_code and B.goods_id=C.id
                INNER JOIN {0}it_vendor D ON A.within_code=D.within_code AND A.vendor_id=D.id
                WHERE A.within_code='0000' ", strRemoteDB);//and A.id='DWH033895' and A.state<>'2'";
                if (!string.IsNullOrEmpty(model.VendorID))
                {
                    strSql += " AND A.vendor_id like '" + model.VendorID + "%'";
                }
                if (!string.IsNullOrEmpty(model.ID))
                {
                    strSql += " AND A.id like '" + model.ID + "%'";
                }
                if (!string.IsNullOrEmpty(model.OrderDate))
                {
                    strSql += " AND A.order_date >='" + model.OrderDate + "'";
                }
                if (!string.IsNullOrEmpty(model.OrderDateEnd))
                {
                    strSql += " AND A.order_date <='" + model.OrderDateEnd + "'";
                }
                //strSql += " and A.state<>'2' AND A.vendor=''";
                strSql += " and A.state<>'2' ";
                if (!string.IsNullOrEmpty(model.ProductMo))
                {
                    strSql += " AND B.mo_id ='" + model.ProductMo + "'";
                }
                if (!string.IsNullOrEmpty(model.ProductID))
                {
                    strSql += " AND B.goods_id like '%" + model.ProductID + "%'";
                }
                DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    PurchaseInfo objModel = new PurchaseInfo();
                    objModel.VendorID = dt.Rows[i]["VendorID"].ToString();
                    objModel.VendorName = dt.Rows[i]["VendorName"].ToString();
                    objModel.ID = dt.Rows[i]["id"].ToString();
                    objModel.Ver = int.Parse(dt.Rows[i]["Ver"].ToString());
                    objModel.OrderDate = dt.Rows[i]["OrderDate"].ToString();
                    objModel.ProductMo = dt.Rows[i]["ProductMo"].ToString();
                    objModel.ProductID = dt.Rows[i]["ProductID"].ToString();
                    objModel.ProductCdesc = dt.Rows[i]["ProductCdesc"].ToString();
                    objModel.ProductEdesc = dt.Rows[i]["ProductEdesc"].ToString();
                    objModel.OrderQty = int.Parse(dt.Rows[i]["OrderQty"].ToString());
                    objModel.Weight = Decimal.Parse(dt.Rows[i]["SecQty"].ToString());
                    lstItem.Add(objModel);
                }
            }
            return lstItem;
        }

        //返回生成的OC單據編號
        public static PurchaseInfo GetBuildOCID(PurchaseInfo model)
        {
            string user_id = AdminUserContext.Current.LoginInfo.LoginName;
            string strSql = string.Format("EXECUTE usp_build_oc_from_geo '{0}',{1},'{2}'", model.ID, model.Ver, user_id);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            PurchaseInfo objModel = new PurchaseInfo();
            if (dt.Rows.Count > 0)
            {
                objModel.ID = dt.Rows[0]["id"].ToString();
            }
            else
            {
                objModel.ID = "";
            }
            return objModel;
        }

        //PI
        public static List<OcReport> GetReportReturnList(string ID)
        {
            List<OcReport> lstModel = new List<OcReport>();
            string strSql = string.Format(
                @"SELECT A.*,dbo.fn_GetMoneySign(A.CustomerID) AS Sign,B.*,
                CASE WHEN LEN(D.picture_name)>0 THEN E.picture_path_web+REPLACE(D.picture_name,'\','/') ELSE '' END AS ArtImage
                FROM oc_OrderHead A with(nolock)
                INNER JOIN oc_OrderDetails B with(nolock) ON A.OcID=B.OcID and A.Ver=B.Ver
                LEFT JOIN it_goods C ON B.ProductID = C.id
                LEFT JOIN cd_pattern D On C.blueprint_id=D.id,
                cd_company E
                WHERE A.OcID='{0}'", ID);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<OcReport> list = CommonUtils.DataTableToList<OcReport>(dt);
            return list;
            //string CurrencyID = "";
            //for (int i = 0; i < dt.Rows.Count; i++)
            //{
            //    OcReport objModel = new OcReport();
            //    objModel.OcID = dt.Rows[i]["OcID"].ToString();
            //    objModel.Ver = int.Parse(dt.Rows[i]["Ver"].ToString());
            //    objModel.CustomerID = dt.Rows[i]["CustomerID"].ToString();
            //    objModel.CustomerCdesc = dt.Rows[i]["CustomerCdesc"].ToString();
            //    //objModel.OrderDate =DateTime.Parse(dt.Rows[i]["OrderDate"].ToString()).ToShortDateString().ToString();
            //    //objModel.OrderDate = string.Format("{0:d}", dt.Rows[i]["OrderDate"]);//2005-11-5
            //    objModel.OrderDate = string.Format("{0:u}", dt.Rows[i]["OrderDate"]).Substring(0,10);//2005-11-05 14:23:23Z
            //    objModel.ProductMo = dt.Rows[i]["ProductMo"].ToString();
            //    objModel.ProductID = dt.Rows[i]["ProductID"].ToString();
            //    objModel.ProductCdesc = dt.Rows[i]["ProductCdesc"].ToString();
            //    objModel.CustProductID = dt.Rows[i]["CustProductID"].ToString();
            //    objModel.OrderQty = int.Parse(dt.Rows[i]["OrderQty"].ToString());
            //    objModel.Price = Decimal.Parse(dt.Rows[i]["Price"].ToString());
            //    objModel.CustColorID = dt.Rows[i]["CustColorID"].ToString();
            //    objModel.Contacts = dt.Rows[i]["Contacts"].ToString();
            //    objModel.ContactsTel = dt.Rows[i]["ContactsTel"].ToString();
            //    objModel.ContactsFax = dt.Rows[i]["ContactsFax"].ToString();
            //    objModel.PoNo = dt.Rows[i]["PoNo"].ToString();
            //    objModel.Season = dt.Rows[i]["Season"].ToString();
            //    objModel.Merchandisers = dt.Rows[i]["Merchandisers"].ToString();
            //    objModel.MerchandisersTel = dt.Rows[i]["MerchandisersTel"].ToString();
            //    objModel.MerchandisersEmail = dt.Rows[i]["MerchandisersEmail"].ToString();
            //    objModel.StyleNo = dt.Rows[i]["StyleNo"].ToString();
            //    objModel.AmountProduct = decimal.Parse(dt.Rows[i]["AmountProduct"].ToString());
            //    objModel.CurrencyID = dt.Rows[i]["CurrencyID"].ToString();
            //    objModel.OrderUnit = dt.Rows[i]["OrderUnit"].ToString();
            //    objModel.PriceUnit = dt.Rows[i]["PriceUnit"].ToString();
            //    objModel.ArriveDate = string.Format("{0:u}", dt.Rows[i]["ArriveDate"]).Substring(0, 10);
            //    objModel.FactoryShipOutDate = string.Format("{0:u}", dt.Rows[i]["FactoryShipOutDate"]).Substring(0, 10);
            //    objModel.CreateBy = dt.Rows[i]["CreateBy"].ToString();
            //    CurrencyID = dt.Rows[i]["CurrencyID"].ToString();
            //    switch(CurrencyID)
            //    {
            //        case "HKD":
            //            objModel.Sign = "$";
            //            break;
            //        case "USD":
            //            objModel.Sign = "$";
            //            break;
            //        case "RMB":
            //            objModel.Sign = "￥";
            //            break;
            //        default:
            //            objModel.Sign = "";
            //            break;
            //    }                
            //    lstModel.Add(objModel);
            //}
            //return lstModel;

        }

        ///// <summary>
        ///// 测试是否能访问其他项目目录下的文件
        ///// </summary>
        ///// <returns></returns>
        //public static string GetImage(string artwork)
        //{
        //    string path = "";          
        //    artwork = "TTTT/TOMM002.BMP";
        //    try
        //    {
        //         path = System.Web.HttpContext.Current.Server.MapPath(string.Format("~/art/Artwork/{0}", artwork));
        //    }
        //    catch (System.Exception ex)
        //    {
        //        path = "报错了！" + ex.ToString();
        //    }
        //    return path;            
        //}
        

    }
}