/**
 * 採購單
*/

//提取採購員名稱
function getBuyerName() {
    var id = $("#BuyerID").val();
    if (id) {
        id = id.toLocaleUpperCase();
        $("#BuyerID").textbox("setValue", id);//賦值
        Ajax.call('GetBuyerName', '&strBuyerID=' + id, setBuyerName, 'GET', 'JSON');
    }
}
function setBuyerName(result) {
    $("#BuyerID").textbox("setValue", result.BuyerID);
    $("#BuyerName").textbox("setValue", result.BuyerName);
    if (result.BuyerName == "") {
        $("#BuyerID").textbox("setValue", "");
        $("#BuyerID").textbox("setValue", "");
    }
}

//設置供應商信息
function getVendorInfo() {
    var id = $("#VendorID").combobox("getValue");
    if (id) {
        Ajax.call('GetVendorData', '&strVendorID=' + id, setVendorInfo, 'GET', 'JSON');
    }
}
function setVendorInfo(result) {
    $("#VendorAddress").textbox("setValue", result.VendorAddress);
    $("#Contacts").textbox("setValue", result.Contacts);
    $("#ContactsTel").textbox("setValue", result.ContactsTel);
    $("#ContactsFax").textbox("setValue", result.ContactsFax);
    $("#Vendor").val(result.Vendor)
}