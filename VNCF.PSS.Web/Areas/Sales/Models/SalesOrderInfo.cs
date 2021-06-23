using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace VNCF.PSS.Web.Areas.Sales.Models
{
    public class Order_Head
    {
        [Required]
        public string OcID { get; set; }//編號
        public int Ver { get; set; }//版本
        [Required]
        public string OrderDate { get; set; }//落單日期

        [Required(ErrorMessage = "Please select")]
        [StringLength(8)]       
        public string CustomerID { get; set; } //客戶編號
        public string CustomerCdesc { get; set; }//客戶描述
        public string CustomerEdesc { get; set; }//客戶描述(英文)
        public string OrderType { get; set; }//訂單類型
        public string ReceivedDate { get; set; }//接單日期
        [Required]
        public string ForeignFirm { get; set; }//洋行編號
        [Display(Name = "Area(區域)")]
        [Required(ErrorMessage="{0}Can not be empty")]
        public string Area { get; set; }//區域
        [Required]
        public string SallerID { get; set; }//營業員
        public string Season { get; set; }//季度
        [Required]
        public string Contacts { get; set; }//聯繫人
        public string ContactsTel { get; set; }//聯繫人電話
        public string ContactsFax { get; set; }//傳真
        public string ContactsEmail { get; set; }//郵箱
        [Required]
        public string Merchandisers { get; set; }//營業員
        public string MerchandisersTel { get; set; }//營業員電話
        public string MerchandisersEmail { get; set; }//營業員郵箱
        [Required]
        public string CurrencyID { get; set; }//貨幣
        public string CurrencyRate { get; set; }//貨幣匯率
        public string DeliveredPort { get; set; }//裝貨港口
        public string DestinationPort { get; set; }//目的港口
        
        [Required]
        public string PoNo { get; set; } //PO No.
        public string PaymentType { get; set; }//付款方式
        [Required]
        public string PriceType { get; set; }//價格條件
        public string Transport { get; set; }//運輸方式
        public decimal DiscountRate { get; set; }//折扣率
        public decimal Discount { get; set; }//折扣額
        public string TaxNo { get; set; }//稅款編號
        public decimal Tax { get; set; }//稅款金額
        public decimal ProductAmount { get; set; }//貨品金額
        public decimal TotalAmount { get; set; }//總金額
        public string BankAccount { get; set; }//銀行賬號
        public string State { get; set; }//狀態
        public string Remark { get; set; }//備註
        public string CreateBy { get; set; }//建檔人
        public string CreateAt { get; set; }//建檔日期
        public string UpdateBy { get; set; }//更改人
        public string UpdateAt { get; set; }//更改日期


        //增加明細表字段,查詢之用,,
        public string ContractID { get; set; }
        public string BrandID { get; set; }
        public string ProductMo { get; set; }
        public string ProductID { get; set; }
        public string ProductCdesc { get; set; }
        public decimal OrderQty { get; set; }
        public string OrderUnit { get; set; }
        public decimal Price { get; set; }
        public string PriceUnit { get; set; }
        public decimal RateDiscount { get; set; }
        public decimal AmountDiscount { get; set; }
        public decimal AmountProduct { get; set; }

        public string ActionType { get; set; } //記錄操作當前行的臨時狀態

    }

    public class Order_Details
    {
        public string OcID { get; set; }//編號
        public int Ver { get; set; }//版本
        public string Seq { get; set; }//序號

        [Display(Name = "MO")]
        [Required(ErrorMessage = "{0}Can not be empty")]
        [StringLength(9)]
        public string ProductMo { get; set; }//頁數
        public string ProductMoVer { get; set; }//頁數版本        
        public string MoState { get; set; }//狀態
        [Required]
        [StringLength(20)]
        public string ProductID { get; set; }//產品編號
        public string ProductCdesc { get; set; }//產品描述
        public string BrandID { get; set; }//牌子編號
        public string StyleNo { get; set; }//款號
        public string CustProductID { get; set; }//客戶產品編號
        public string CustProductName { get; set; }//客戶產品名稱
        public string CustColorID { get; set; }//客戶顏色編號
        public string CustColorName { get; set; }//客戶顏色名稱
        public string CustSize { get; set; }//客戶Size
        
        [Required]
        public decimal OrderQty { get; set; }//訂單數量
        [Required]
        public string OrderUnit { get; set; }//訂單數量單位

        [Display(Name = "Price(價格)")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "{0}Can not be empty")]
        //[Column(TypeName = "money")] //指定字段映射到数据库表的列名。
        [Range(0.001, 9999, ErrorMessage = "{0}Must be greater than{1},And less than{2}")]
        public decimal Price { get; set; }//單價
        [Required]
        public string PriceUnit { get; set; }//單價單位

        public decimal RateDiscount { get; set; }//折扣率
        public decimal AmountDiscount { get; set; }//折扣額
        public decimal AmountAfterDiscount { get; set; }//折扣后金額
        [Required]
        public decimal AmountProduct { get; set; }//貨品金額
        public string PlanCompleteDate { get; set; }//計劃完成日期
        public string ArriveDate { get; set; }//交貨日期
        public string FactoryShipOutDate { get; set; }//交客日期        
        
        public string MoType { get; set; }//制單種類
        public string MoDept { get; set; }//生產部門
        public string MoGroup { get; set; }//組別
        public string ContractID { get; set; }//PO/NO.
        public string GetColorSample { get; set; }//取色辦
        public string IsFree { get; set; }//是否免費
        public string IsPrint { get; set; }//是否列印

        public string Remarks { get; set; }//備註
        public string OcRemark { get; set; }//OC備註
        public string InvoiceRemark { get; set; }//OC備註
        public string PlateRemark { get; set; }//電鍍備註
        public string ProductRemark { get; set; }//生產備註
        
        public string ActionType { get; set; }//記錄操作當前行臨時狀態
        public string ArtImage { get; set; }//圖樣路徑
    }
    public class SalesBom
    {
        public string OcID { get; set; }//編號
        public int Ver { get; set; }//版本
        public string UpperSeq { get; set; }
        public string Seq { get; set; }//序號
        public string PrimaryKey { get; set; }//序號
        public string ProductID { get; set; }//序號
        public string ProductCdesc { get; set; }//序號
        public int Dosage { get; set; }//用量
        public string UnitCode { get; set; }//單位
        public string Remark { get; set; }//備註
        public string DoColor { get; set; }//顏色做法
        public decimal ActualToHKQty { get; set; }//實際回港數量
        public string ActualToHKDate { get; set; }//實際回港日期
        public string ActionType { get; set; }//記錄操作當前行的臨時狀態
    }

    public class ItemInfo
    {        
        public string ProductID { get; set; }//產品編號
        public string ProductCdesc { get; set; }//產品描述
        public string ProductEdesc { get; set; }//產品描述
        public string Type { get; set; }//類型
    }

    public class PurchaseInfo
    {       
        public string VendorID { get; set; }//供應商編號
        public string VendorName { get; set; }//供應商名稱
        public string ID { get; set; }//採購單號
        public int Ver { get; set; } //版本
        public string OrderDate { get; set; }//訂單日期
        public string ProductMo { get; set; }//頁數
        public string ProductID { get; set; }//產品編號
        public string ProductCdesc { get; set; }//產品描述
        public string ProductEdesc { get; set; }//產品描述
        public int OrderQty { get; set; }//訂單數量
        public string UnitCode { get; set; }//單位
        public decimal Weight { get; set; }//重量
        public string SecUnit { get; set; }//重量單位
        public string OrderDateEnd { get; set; }//訂單日期
    }

    public class OcReport
    {
        public string OcID { get; set; }//編號
        public int Ver { get; set; }//版本      
        public string OrderDate { get; set; }//落單日期       
        public string CustomerID { get; set; } //客戶編號
        public string CustomerCdesc { get; set; }//客戶描述
        public string Contacts { get; set; }//聯繫人
        public string ContactsTel { get; set; }//聯繫人電話
        public string ContactsFax { get; set; }//傳真
        public string PoNo { get; set; } //PO No.
        public string Season { get; set; }//季度        
        public string Remark { get; set; }//附帶條款
        public string ShipMark { get; set; }//船嘜
        public string ReceivedDate { get; set; }//接單日期       
        public string CurrencyID { get; set; }//貨幣          
        public string SallerID { get; set; }//營業員
        public string SallerName { get; set; }
        public string Merchandisers { get; set; }//營業員
        public string MerchandisersTel { get; set; }//營業員電話
        public string MerchandisersEmail { get; set; }//營業員郵箱
        public string CreateBy { get; set; }
        public string BankAccount { get; set; }//銀行賬號
        public string Sign{ get; set; }//貨幣符號 
        //明細
        public string Seq { get; set; }//序號
        public string ProductMo { get; set; }//頁數
        public string ProductID { get; set; }//產品編號
        public string ProductCdesc { get; set; }//產品描述
        public string BrandID { get; set; }//牌子編號
        public string StyleNo { get; set; }//款號
        public string ContractID { get; set; }//po
        public string CustProductID { get; set; }//客戶產品編號        
        public string CustColorID { get; set; }//客戶顏色編號
        public string ArriveDate { get; set; }//交貨日期
        public string FactoryShipOutDate { get; set; }//交客日期
        public decimal OrderQty { get; set; }//訂單數量
        public string OrderUnit { get; set; }//訂單數量單位              
        public decimal Price { get; set; }//單價     
        public string PriceUnit { get; set; }//單價單位           
        public decimal AmountProduct { get; set; }//貨品金額
        public string DeliveryMode { get; set; }//送貨方式
        public string OcRemark { get; set; }//OC備註
        public string ArtImage { get; set; }//圖樣路徑


    }

}