using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace VNCF.PSS.Web.Areas.Purchase.Models
{
    public class BuyHead
    {
       
        [Required]
        public string ID { get; set; }//編號
        public int Ver { get; set; }//版本
        [Required]
        public string OrderDate { get; set; }//落單日期

        [Required(ErrorMessage = "Please select")]
        [StringLength(8)]
        public string VendorID { get; set; } //供應商編號
        public string Vendor { get; set; }//供應商描述
        public string VendorAddress { get; set; }//供應商地址
        [Required]
        public string BuyerName { get; set; }//採購員名稱
        public string BuyerID { get; set; }//採購員代號
        [Required]
        public string CurrencyID { get; set; }//貨幣
        public decimal CurrencyRate { get; set; }//貨幣匯率
        public string PaymentType { get; set; }//付款方式
        public string PriceType { get; set; }//價格條件
        public decimal PaymentAmt { get; set; }//貨品金額
        public decimal OtherAmt { get; set; }//附加費金額
        public decimal TotalAmt { get; set; }//總金額
        [Required]
        public string DepartMentID { get; set; }//採購部門
        public string CustomerID { get; set; }//客戶編號
        public string CustomerCdesc { get; set; }//客戶名稱
        public string Contacts { get; set; }//聯繫人
        public string ContactsTel { get; set; }//聯繫人電話
        public string ContactsFax { get; set; }//傳真
        public string Packing { get; set; }//包裝信息

        public string State { get; set; }//狀態
        public string Remark { get; set; }//備註
        public string CreateBy { get; set; }//建檔人
        public string CreateAt { get; set; }//建檔日期
        public string UpdateBy { get; set; }//更改人
        public string UpdateAt { get; set; }//更改日期        

        public string ActionType { get; set; } //記錄操作當前行的臨時狀態
    }


    public class BuyDetails
    {
        [Required]
        public string ID { get; set; }//編號
        public int Ver { get; set; }//版本
        [Required]
        public string Seq { get; set; }//序號

        public string ProductMo { get; set; }//頁數
        public string ProductID { get; set; }//產品編號
        public string ProductCdesc { get; set; }//產品描述
        public string Spec { get; set; }//規格
        public string Color { get; set; }//顏色
        public string ArriveDate { get; set; }//交貨日期
        public decimal OrderQty { get; set; }//訂單數量
        public string OrderUnit { get; set; }//訂單單位
        public decimal Weight { get; set; }//重量
        public string WeightUnit { get; set; }//重單單位
        public decimal Price { get; set; }//單價
        public string PriceUnit { get; set; }//單價單位
        public decimal DiscountRate { get; set; }//折扣率
        public decimal DiscountAmt { get; set; }//折扣額
        public decimal TotalSum { get; set; }//總金額
        public decimal ReceiptQty { get; set; }//收貨數量
        public string ReceiptUnit { get; set; }//收貨單位
        public string Remarks { get; set; }//備註       
        public string ActionType { get; set; }//記錄操作當前行臨時狀態

    }

    public class BuyFare
    {
        [Required]
        public string ID { get; set; }//編號
        public int Ver { get; set; }//版本
        [Required]
        public string FareID { get; set; }//附加費用ID
        public string Name { get; set; }//附加費用描述
        public int Qty { get; set; }//數量
        public string UnitCode { get; set; }//重單單位
        public decimal Price { get; set; }//單價
        public decimal FareSum { get; set; }//費用金額
        public string ProductID { get; set; }//產品編號
        public string ActionType { get; set; }//記錄操作當前行臨時狀態

    }

    public class FindList
    {
        public string ID { get; set; }
        public string OrderDate { get; set; }
        public string VendorID { get; set; }
        public string Seq { get; set; }
        public string ProductMo { get; set; }
        public string ProductID { get; set; }
        public string ProductCdesc { get; set; }
        public int OrderQty { get; set; }
        public string OrderUnit { get; set; }
        public decimal Price { get; set; }
        public string PriceUnit { get; set; }
        public decimal TotalSum { get; set; }
        public string DepartMentID { get; set; }


    }

    public class PurReport
    {
        public string ID { get; set; }
        public string OrderDate { get; set; }
        public string CurrencyID { get; set; }
        public string Contacts { get; set; }
        public string DepartMentID { get; set; }
        public string CreateBy { get; set; }
        public string CreateAt { get; set; }
        public string ProductMo { get; set; }
        public string ProductID { get; set; }
        public string ProductCdesc { get; set; }
        public string Spec { get; set; }
        public int OrderQty { get; set; }
        public string OrderUnit { get; set; }
        public decimal Weight { get; set; }
        public string WeightUnit { get; set; }
        public string Color { get; set; }
        public decimal Price { get; set; }
        public string PriceUnit { get; set; }
        public decimal TotalSum { get; set; }
        public string ArriveDate { get; set; }
        public string Remarks { get; set; }
        public string VendorName { get; set; }
        public string DeptName { get; set; }
        public string Seq { get; set; }
        public string Sign { get; set; }
    }


}