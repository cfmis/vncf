using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using VNCF.PSS.Web.Areas.Base.DAL;
using System.Text;
using CF.Framework.Utility;

namespace VNCF.PSS.Web.Areas.Base.ASHX
{
    /// <summary>
    /// Summary description for BaseDataList
    /// </summary>
    public class BaseDataList : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            //context.Response.Write("Hello World");
            GetItem(context);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        public void GetItem(HttpContext context)
        {
            string paraa = context.Request["paraa"];
            string parab = context.Request["parab"];
            string parac = context.Request["parac"];
            string para = context.Request["param"];
            string id = "", name = "";
            string search_val = "";
            if (para != null)
            {
                JArray ja = (JArray)JsonConvert.DeserializeObject(para);

                if (paraa == "get_prdtype")
                    search_val = ja[0]["search_val"].ToString().Trim();
                else
                {
                    id = ja[0]["id"].ToString().Trim();
                    name = ja[0]["name"].ToString().Trim();
                }
            }
            string ReturnValue = string.Empty;
            //BasicInformationFacade basicInformationFacade = new BasicInformationFacade();   //实例化基础信息外观  
            DataTable dt = new DataTable();
            //dt = basicInformationFacade.itemsQuery(); //根据查询条件获取结果
            switch (paraa)
            {
                case "wh_transfer":
                    dt = BaseDataDAL.GetDocFlag("wh_transfer");
                    break;
                case "loc":
                    dt = BaseDataDAL.GetLoc();
                    break;
                case "unit":
                    dt = BaseDataDAL.GetUnitReturnDataTable();
                    break;
            }


            //DataTableToJson cls = new DataTableToJson();
            if (parab == "list")
                ReturnValue = DataTableToJson.DataTableJsonReturnList(dt);
            else
            {
                if (parab == "table")
                    ReturnValue = DataTableToJson.DataTableJsonReturnExcel(dt);
                else
                    ReturnValue = DataTableToJson.DataTableJsonReturnTextBox(dt);
            }

            //ReturnValue = DataTableToJson.DataTableJsonReturnList(dt);

            context.Response.ContentType = "text/plain";
            //context.Response.ContentType = "application/json";
            context.Response.Write(ReturnValue);
            context.Response.End();
            //return ReturnValue;  
        }

    }
}