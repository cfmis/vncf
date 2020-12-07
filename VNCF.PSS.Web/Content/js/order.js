function showMsg()
{
    alert("登录名已存在1");
}

/* *
 * 商品购买记录的翻页函数
 */
function getProduct(id)
{
  Ajax.call('GetProduct', '&ProductID=' + id, gotoBuyPageResponse, 'GET', 'JSON');
}

function gotoBuyPageResponse(result)
{
  //document.getElementById("ProductCdesc").innerText = result.OrderDate;
   $("#ProductCdesc").textbox('setValue', result.ProductCdesc);
}

function getCustomer(id)
{
  Ajax.call('GetCustomer', '&ID=' + id, setCustomerValue, 'GET', 'JSON');
}

function setCustomerValue(result)
{
  //document.getElementById("ProductCdesc").innerText = result.OrderDate;
   $("#CustCname").textbox('setValue', result.CustCname);
}