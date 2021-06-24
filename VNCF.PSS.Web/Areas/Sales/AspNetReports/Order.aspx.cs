using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
//using Microsoft.Reporting.WebForms;
using VNCF.PSS.Web.Areas.Sales.DAL;

namespace VNCF.PSS.Web.AspNetReports
{
    public partial class Order : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                //Data_Binding();
            }
        }
        //private void Data_Binding()
        //{
        //    string ID = Request.QueryString["ID"];
        //    this.ReportViewer1.Reset();
        //    this.ReportViewer1.LocalReport.Dispose();
        //    this.ReportViewer1.LocalReport.DataSources.Clear();
        //    Microsoft.Reporting.WebForms.ReportDataSource reportDataSource = new Microsoft.Reporting.WebForms.ReportDataSource();
        //    reportDataSource.Name = "VNCFDS";
        //    //Dgsql2DBContext db = new Dgsql2DBContext();
        //    //var model = new so_online_order_details();
        //    //int id = 1023;
        //    //List<so_online_order_details> lsModel = new List<so_online_order_details>();
        //    //lsModel = db.so_online_order_details.ToList();
        //    var lsModel = OrderDAL.GetOcDetailsByID(ID);
        //    double TotOrderQty = 0;
        //    double TotalAmountUSD = 0;
        //    for (int i = 0; i < lsModel.Count; i++)
        //    {
        //        TotalAmountUSD += lsModel[i].Amount;
        //        TotOrderQty += lsModel[i].OrderQty;
        //        lsModel[i].ArtImage = "file:///" + Server.MapPath(lsModel[i].ArtImage.Trim());
        //    }
        //    reportDataSource.Value = lsModel;// Db.BaseUser.Find(id);
        //    this.ReportViewer1.LocalReport.ReportPath = Server.MapPath("/Areas/Sales/RDLCReports/Order.rdlc");
        //    this.ReportViewer1.LocalReport.EnableExternalImages = true;
        //    this.ReportViewer1.LocalReport.DataSources.Add(reportDataSource);
        //    string path= "file:///" + Server.MapPath("~") + "Images\\login.jpg";
        //    string path1 = "file:///" + "art\\artwork\\" + "AAAA\\A888020.bmp";
        //    string imgAdd_s = "/art/artwork/"+"AAAA/A888020.bmp";
        //    path1 = "file:///" + Server.MapPath(imgAdd_s);

        //    ReportParameter[] Paras = new ReportParameter[6];
        //    Paras[0] = new ReportParameter("Image1", path);
        //    Paras[1] = new ReportParameter("TotalAmount", TotalAmountUSD.ToString());
        //    Paras[2] = new ReportParameter("TotOrderQty", TotOrderQty.ToString());
        //    Paras[3] = new ReportParameter("Image2", path1);
        //    Paras[4] = new ReportParameter("path", path);
        //    Paras[5] = new ReportParameter("path1", path1);
        //    //ReportParameter rpTotalAmountUSD = new ReportParameter("TotalAmount", TotalAmountUSD.ToString());
        //    //ReportParameter rpTotOrderQty = new ReportParameter("TotOrderQty", TotOrderQty.ToString());
        //    //this.ReportViewer1.LocalReport.SetParameters(new ReportParameter[] { rpTotOrderQty,rpTotalAmountUSD });
        //    this.ReportViewer1.LocalReport.SetParameters(Paras);
            
        //    this.ReportViewer1.LocalReport.Refresh();
        //}
    }
}