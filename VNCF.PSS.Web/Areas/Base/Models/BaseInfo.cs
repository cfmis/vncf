using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNCF.PSS.Web.Areas.Base.Models
{
    public class Dept
    {
        public virtual string id { get; set; }
        public virtual string name { get; set; }
        public virtual string english_name { get; set; }

        public virtual string remark { get; set; }
        public virtual string create_by { get; set; }
        public virtual string create_date { get; set; }
        public virtual string update_by { get; set; }
        public virtual string update_date { get; set; }


        public virtual int row_number { get; set; } //行號
        public virtual int page { get; set; }//第幾頁
        public virtual int rows { get; set; } //每頁多少條記錄
        public virtual int rows_total { get; set; } //總的記錄數
    }

    public class Brand
    {
        public virtual string id { get; set; }
        public virtual string name { get; set; }
        public virtual string english_name { get; set; }
        public virtual string origin { get; set; }
        public virtual string remark { get; set; }
        public virtual string create_by { get; set; }
        public virtual string create_date { get; set; }
        public virtual string update_by { get; set; }
        public virtual string update_date { get; set; }

        public virtual int row_number { get; set; } //行號
        public virtual int page { get; set; }//第幾頁
        public virtual int rows { get; set; } //每頁多少條記錄
        public virtual int rows_total { get; set; } //總的記錄數
    }

    public class Country
    {
        public virtual string id { get; set; }
        public virtual string name { get; set; }
        public virtual string english_name { get; set; }
        public virtual string remark { get; set; }
        public virtual string create_by { get; set; }
        public virtual string create_date { get; set; }
        public virtual string update_by { get; set; }
        public virtual string update_date { get; set; }

        public virtual int row_number { get; set; } //行號
        public virtual int page { get; set; }//第幾頁
        public virtual int rows { get; set; } //每頁多少條記錄
        public virtual int rows_total { get; set; } //總的記錄數
        public virtual string action { get; set; }//操作類型:NEW--新增,EDIT--編輯

    }
    /*
     供應商基本資料
     */
    public class Vendor
    {
        public virtual string id { get; set; }
        public virtual string name { get; set; }
        public virtual string english_name { get; set; }
        public virtual string sort_name { get; set; }
        public virtual string logogram { get; set; }
        public virtual string english_logogram { get; set; }
        public virtual string area { get; set; }
        public virtual string email { get; set; }
        public virtual string type { get; set; }
        public virtual string fax { get; set; }
        public virtual string phone { get; set; }
        public virtual string c_code { get; set; }
        public virtual string payment_mode { get; set; }
        public virtual string payment_method { get; set; }
        public virtual string linkman { get; set; }
        public virtual string l_phone { get; set; }
        public virtual string l_mobile { get; set; }
        public virtual string money_id { get; set; }
        public virtual string state { get; set; }
        public virtual string add_address { get; set; }

        public virtual string remark { get; set; }
        public virtual string create_by { get; set; }
        public virtual string create_date { get; set; }
        public virtual string update_by { get; set; }
        public virtual string update_date { get; set; }

        public virtual int row_number { get; set; } //行號
        public virtual int page { get; set; }//第幾頁
        public virtual int rows { get; set; } //每頁多少條記錄
        public virtual int rows_total { get; set; } //總的記錄數
    }

    /*
     定义一个实体类
     */
    public class DataDictionary
    {
        public virtual string FieldsID { get; set; }
        public string FieldsName { get; set; }
    }

    public class BaseDescription
    {
        public string Cdesc { get; set; }
        public string Edesc { get; set; }
    }

    public class baseUnit
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class CurrentDateTime
    {
        public string current_date { get; set; }
        public string current_datetime { get; set; }
    }
}