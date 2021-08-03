using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Areas.Prod.Models;
using VNCF.PSS.Web.Common;
using System.Data.SqlClient;

namespace VNCF.PSS.Web.Areas.Prod.DAL
{
    public class PlanDAL
    {
        public string LanguageID = DBUtility.GetDetaultLang();
        private string ArtImagePath = DBUtility.ArtImagePath;
        private string dgerp2 = DBUtility.dgerp2;
        public PlanDAL()
        {
            ////string LangID = "0";
            //try
            //{
            //    LanguageID = AdminUserContext.Current.LoginInfo.LanguageID;
            //}
            //catch
            //{
            //    LanguageID = "0";
            //}
        }
        public PlanHead GetOrderByMo(string ProductMo)
        {
            string strSql = "Select a.OcID,a.OrderDate,a.CustomerID,b.ProductMo,b.ProductID,b.OrderQty,b.OrderUnit,b.ProductRemark" +
                ",d.picture_name,";
            if (LanguageID == "0")
                strSql += "c.name AS GoodsCname";
            else if (LanguageID == "1")
                strSql += "c.english_name AS GoodsCname";
            else
                strSql += "d.vn_name1 AS GoodsCname";
            strSql+=" From oc_OrderHead a " +
            " Inner Join oc_OrderDetails b ON a.OcID=b.OcID" +
            " Left Join it_goods c ON b.ProductID=c.id " +
            " Left Join cd_pattern_details d ON c.blueprint_id=d.id " +
            " Left Join it_goods_vn e ON b.ProductID=e.id" +
            " Where a.OcID>='" + "" + "'";
            strSql += " AND b.ProductMo= '" + ProductMo + "'";
            string LangID = LanguageID;
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            DataRow dr = dt.Rows[0];
            PlanHead mdj = new PlanHead();
            mdj.ProductMo= dr["ProductMo"].ToString();
            mdj.OrderDate = dr["OrderDate"].ToString();
            mdj.CustomerID = dr["CustomerID"].ToString();
            mdj.GoodsID = dr["ProductID"].ToString();
            mdj.GoodsCname = dr["GoodsCname"].ToString();
            mdj.OrderQty = Convert.ToDecimal(dr["OrderQty"].ToString());
            mdj.OrderUnit = dr["OrderUnit"].ToString();
            mdj.ProductRemark = dr["ProductRemark"].ToString();
            mdj.ArtImageUrl = ArtImagePath + (dr["picture_name"] != null ? dr["picture_name"].ToString().Trim().Replace("\\", "/") : "");//"AAAA/A888020.bmp";// 
            return mdj;
        }

        public List<PlanHead> GetPlanFromOrderByMo(string ProductMo)
        {
            string strSql = "Select a.OcID,a.OrderDate,a.CustomerID,b.ProductMo,b.ProductID,b.OrderQty,b.OrderUnit,b.ProductRemark" +
                ",d.picture_name,";
            if (LanguageID == "0")
                strSql += "c.name AS GoodsCname";
            else if (LanguageID == "1")
                strSql += "c.english_name AS GoodsCname";
            else
                strSql += "d.vn_name1 AS GoodsCname";
            strSql += " From oc_OrderHead a " +
            " Inner Join oc_OrderDetails b ON a.OcID=b.OcID" +
            " Left Join it_goods c ON b.ProductID=c.id " +
            " Left Join cd_pattern_details d ON c.blueprint_id=d.id " +
            " Left Join it_goods_vn e ON b.ProductID=e.id" +
            " Where a.OcID>='" + "" + "'";
            strSql += " AND b.ProductMo= '" + ProductMo + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<PlanHead> listPlan = new List<PlanHead>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[0];
                PlanHead mdj = new PlanHead();
                mdj.ProductMo = dr["ProductMo"].ToString();
                mdj.OrderDate = dr["OrderDate"].ToString();
                mdj.CustomerID = dr["CustomerID"].ToString();
                mdj.GoodsID = dr["ProductID"].ToString();
                mdj.GoodsCname = dr["GoodsCname"].ToString();
                mdj.OrderQty = Convert.ToDecimal(dr["OrderQty"].ToString());
                mdj.OrderUnit = dr["OrderUnit"].ToString();
                mdj.ProductRemark = dr["ProductRemark"].ToString();
                mdj.ArtImageUrl = ArtImagePath + (dr["picture_name"] != null ? dr["picture_name"].ToString().Trim().Replace("\\", "/") : "");//"AAAA/A888020.bmp";// 
                listPlan.Add(mdj);
            }
            return listPlan;
        }
        public string UpdatePlan(PlanHead modelPlan, List<PlanDetails> listPlan)
        {
            string result = "";
            string strSql = "";
            string UserID = DBUtility.GetDetaultUserID();
            string OpDateTime = DBUtility.ConvertDateTimeFormat(System.DateTime.Now);
            strSql += string.Format(@" SET XACT_ABORT  ON ");
            strSql += string.Format(@" BEGIN TRANSACTION ");
            if (modelPlan.EditFlag == 1)
            {
                if (!CheckPlanHead(modelPlan.ProductMo, modelPlan.Ver))
                    strSql += string.Format(@" Insert Into pd_PlanHead (ProductMo,Ver,CustomerID,PlanDate,OrderQty,OrderUnit,ProductRemark
                            ,MoRemark,PlanRemark,CreateUser,CreateTime,AmendUser,AmendTime)" +
                            " Values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}')"
                                , modelPlan.ProductMo, modelPlan.Ver, modelPlan.CustomerID, modelPlan.PlanDate, modelPlan.OrderQty, modelPlan.OrderUnit
                                , modelPlan.ProductRemark, modelPlan.MoRemark, modelPlan.PlanRemark, UserID, OpDateTime, UserID, OpDateTime);
                else
                    strSql += string.Format(@" Update pd_PlanHead Set CustomerID='{2}',PlanDate='{3}',OrderQty='{4}',OrderUnit='{5}' " +
                                ",ProductRemark='{6}',MoRemark='{7}',PlanRemark='{8}'" +
                                ",CreateUser='{9}',CreateTime='{10}',AmendUser='{11}',AmendTime='{12}'" +
                                " Where ProductMo='{0}' And Ver='{1}' "
                                , modelPlan.ProductMo, modelPlan.Ver, modelPlan.CustomerID, modelPlan.PlanDate
                                , modelPlan.OrderQty, modelPlan.OrderUnit, modelPlan.ProductRemark, modelPlan.MoRemark, modelPlan.PlanRemark
                                , UserID, OpDateTime, UserID, OpDateTime);
            }
            if (listPlan != null)
            {
                int MaxSeq = GetDetailsMaxSeq(modelPlan.ProductMo, modelPlan.Ver);
                for (int i = 0; i < listPlan.Count; i++)
                {
                    if (listPlan[i].EditFlag == 1)
                    {
                        string Seq = "";
                        if (listPlan[i].Seq == null)
                        {
                            MaxSeq += 1;
                            Seq = MaxSeq.ToString().PadLeft(3, '0');
                        }
                        else
                            Seq = listPlan[i].Seq;
                        if (!CheckPlanDetails(listPlan[i].ProductMo, listPlan[i].Ver, Seq))
                            strSql += string.Format(@" Insert Into pd_PlanDetails (ProductMo,Ver,Seq,GoodsID,RequestQty,RequestDate,WipID,NextWipID" +
                                ",CreateUser,CreateTime,AmendUser,AmendTime )" +
                                " Values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}')"
                                    , listPlan[i].ProductMo, listPlan[i].Ver, Seq, listPlan[i].GoodsID, listPlan[i].RequestQty, listPlan[i].RequestDate
                                    , listPlan[i].WipID, listPlan[i].NextWipID, UserID, OpDateTime, UserID, OpDateTime);
                        else
                            strSql += string.Format(@" Update pd_PlanDetails Set GoodsID='{3}',RequestQty='{4}',RequestDate='{5}',WipID='{6}',NextWipID='{7}' " +
                                ",CreateUser='{8}',CreateTime='{9}',AmendUser='{10}',AmendTime='{11}'" +
                                " Where ProductMo='{0}' And Ver='{1}' And Seq='{2}' "
                                    , listPlan[i].ProductMo, listPlan[i].Ver, Seq, listPlan[i].GoodsID, listPlan[i].RequestQty, listPlan[i].RequestDate
                                    , listPlan[i].WipID, listPlan[i].NextWipID, UserID, OpDateTime, UserID, OpDateTime);
                    }
                }
            }
            strSql += string.Format(@" COMMIT TRANSACTION ");
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;
        }
        private bool CheckPlanHead(string ProductMo,int Ver)
        {
            bool result = true;
            string strSql = "Select ProductMo FROM pd_PlanHead Where ProductMo='" + ProductMo + "' And Ver='" + Ver + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = true;
            else
                result = false;
            return result;
        }
        private bool CheckPlanDetails(string ProductMo, int Ver,string Seq)
        {
            bool result = true;
            string strSql = "Select ProductMo FROM pd_PlanDetails Where ProductMo='" + ProductMo + "' And Ver='" + Ver + "' And Seq='" + Seq + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = true;
            else
                result = false;
            return result;
        }
        private int GetDetailsMaxSeq(string ProductMo,int Ver)
        {
            int result = 1;
            string strSql = "";
            strSql = "Select MAX(Seq) AS Seq FROM pd_PlanDetails Where ProductMo='" + ProductMo + "' And Ver='" + Ver + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = dt.Rows[0]["Seq"].ToString() != "" ? Convert.ToInt32(dt.Rows[0]["Seq"]) : 0;
            else
                result = 1;
            return result;
        }
        public PlanHead GetPlanHeadByMo(string ProductMo)
        {
            PlanHead mdjPlan = new PlanHead();
            mdjPlan.ArtImageUrl = "";
            string strSql = "Select a.*,c.picture_name,";
            if (LanguageID == "0")
                strSql += "b.name AS GoodsCname";
            else if (LanguageID == "1")
                strSql += "b.english_name AS GoodsCname";
            else
                strSql += "c.vn_name1 AS GoodsCname";
            strSql += " FROM pd_PlanHead a " +
                " Left Join it_goods b ON a.GoodsID=b.id " +
                " Left Join cd_pattern_details c ON b.blueprint_id=c.id " +
                " Left Join it_goods_vn d ON a.GoodsID=d.id" +
                " Where a.ProductMo ='" + ProductMo + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
            {
                DataRow dr = dt.Rows[0];
                mdjPlan.ProductMo = dr["ProductMo"].ToString();
                mdjPlan.Ver = Convert.ToInt32(dr["Ver"].ToString());
                mdjPlan.PlanDate = dr["PlanDate"].ToString();
                mdjPlan.CustomerID = dr["CustomerID"].ToString();
                mdjPlan.MoRemark = dr["MoRemark"].ToString();
                mdjPlan.PlanRemark = dr["PlanRemark"].ToString();
                mdjPlan.ProductRemark = dr["ProductRemark"].ToString();
                mdjPlan.GoodsID = dr["GoodsID"].ToString();
                mdjPlan.GoodsCname = dr["GoodsCname"].ToString();
                mdjPlan.OrderQty = Convert.ToInt32(dr["OrderQty"].ToString());
                mdjPlan.OrderUnit = dr["OrderUnit"].ToString();
                mdjPlan.CreateUser = dr["CreateUser"].ToString();
                mdjPlan.CreateTime = dr["CreateTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["CreateTime"])) : "";
                mdjPlan.AmendUser = dr["AmendUser"].ToString();
                mdjPlan.AmendTime = dr["AmendTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["AmendTime"])) : "";
                mdjPlan.ArtImageUrl = ArtImagePath + (dr["picture_name"] != null ? dr["picture_name"].ToString().Trim().Replace("\\", "/") : "");//"AAAA/A888020.bmp";// 
            }
            return mdjPlan;
         }
        public List<PlanDetails> GetPlanDetailsByMo(string ProductMo)
        {

            string strSql = "Select a.*,";
            if (LanguageID == "0")
                strSql += "b.name AS GoodsCname";
            else if (LanguageID == "1")
                strSql += "b.english_name AS GoodsCname";
            else
                strSql += "c.vn_name1 AS GoodsCname";
            strSql+=" FROM pd_PlanDetails a "+
                " Left Join it_goods b ON a.GoodsID=b.id " +
                " Left Join it_goods_vn c ON a.GoodsID=c.id";
            strSql +=" Where ProductMo='" + ProductMo + "'";
            strSql += " Order By Seq ";
            var len = ProductMo.Length;
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<PlanDetails> lsPlanDetails = new List<PlanDetails>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                PlanDetails mdjPlanDetails = new PlanDetails();
                DataRow dr = dt.Rows[i];
                mdjPlanDetails.ProductMo = dr["ProductMo"].ToString();
                mdjPlanDetails.Ver = Convert.ToInt32(dr["Ver"].ToString());
                mdjPlanDetails.Seq = dr["Seq"].ToString();
                mdjPlanDetails.GoodsID = dr["GoodsID"].ToString();
                mdjPlanDetails.GoodsCname = dr["GoodsCname"].ToString();
                mdjPlanDetails.WipID = dr["WipID"].ToString();
                mdjPlanDetails.NextWipID = dr["NextWipID"].ToString();
                mdjPlanDetails.RequestQty = Convert.ToInt32(dr["RequestQty"].ToString());
                mdjPlanDetails.RequestDate = dr["RequestDate"].ToString();
                mdjPlanDetails.CreateUser = dr["CreateUser"].ToString();
                mdjPlanDetails.CreateTime = dr["CreateTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["CreateTime"])) : "";
                mdjPlanDetails.AmendUser = dr["AmendUser"].ToString();
                mdjPlanDetails.AmendTime = dr["AmendTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["AmendTime"])) : "";
                lsPlanDetails.Add(mdjPlanDetails);
            }
            return lsPlanDetails;
        }
    }
}