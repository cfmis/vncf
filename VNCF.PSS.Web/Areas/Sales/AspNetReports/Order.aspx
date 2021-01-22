<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Order.aspx.cs" Inherits="VNCF.PSS.Web.AspNetReports.Order" %>

<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=12.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title></title>
    <style>
        html,body,form,#div1 {
            height: 100%; 
        }
    </style>

</head>
<body>
    <form id="form1" runat="server">
        <div class="div1">
    
        <asp:ScriptManager ID="ScriptManager1" runat="server" EnablePartialRendering="false">
        </asp:ScriptManager>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                
                <rsweb:ReportViewer ID="ReportViewer1" Width="100%" Height="100%" runat="server">
                </rsweb:ReportViewer>
                
            </ContentTemplate>

        </asp:UpdatePanel>
    
    </div>
    </form>
</body>
</html>
