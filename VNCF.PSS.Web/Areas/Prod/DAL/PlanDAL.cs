using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Areas.Prod.Models;
using VNCF.PSS.Web.Common;
using System.Data.SqlClient;
using VNCF.PSS.Web.Areas.Base.Models;

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
            else if (LanguageID == "2")
                strSql += "c.english_name AS GoodsCname";
            else
                strSql += "e.vn_name1 AS GoodsCname";
            strSql+=" From oc_OrderHead a " +
            " Inner Join oc_OrderDetails b ON a.OcID=b.OcID" +
            " Left Join it_goods c ON b.ProductID=c.id " +
            " Left Join cd_pattern_details d ON c.blueprint_id=d.id " +
            " Left Join it_goods_vn e ON b.ProductID=e.id" +
            " Where a.OcID>='" + "" + "'";
            strSql += " AND b.ProductMo= '" + ProductMo + "'";
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
            else if (LanguageID == "2")
                strSql += "c.english_name AS GoodsCname";
            else
                strSql += "e.vn_name1 AS GoodsCname";
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
        public UpdateStatusModels UpdatePlan(PlanHead modelPlan, List<PlanDetails> listPlan)
        {
            string result = "";
            string strSql = "";
            string ProductMo = modelPlan.ProductMo;
            int Ver = modelPlan.Ver;
            bool HasMo = true;
            string UserID = DBUtility.GetDetaultUserID();
            string OpDateTime = DBUtility.ConvertDateTimeFormat(System.DateTime.Now);
            strSql += string.Format(@" SET XACT_ABORT  ON ");
            strSql += string.Format(@" BEGIN TRANSACTION ");
            if (ProductMo == "" || ProductMo == null)
            {
                HasMo = false;
                string MoType = "PLAN01";
                string MoID = "G";
                int Val = GetMoNumber(MoType, MoID) + 1;
                ProductMo = MoID + Val.ToString().PadLeft(8, '0');
                Ver = 0;
                if (Val == 1)
                    strSql += string.Format(@" Insert Into sy_mo_type (MoType,id,Val,CreateUser,CreateTime,AmendUser,AmendTime) Values (" +
                        "'{0}','{1}','{2}','{3}','{4}','{5}','{6}' )"
                        , MoType, MoID, Val, UserID, OpDateTime, UserID, OpDateTime);
                else
                    strSql += string.Format(@" Update sy_mo_type Set Val='{2}',AmendUser='{3}',AmendTime='{4}'" +
                                " Where MoType='{0}' And ID='{1}' "
                                , MoType, MoID, Val, UserID, OpDateTime);
            }
            if (modelPlan.EditFlag == 1 || HasMo==false)
            {
                if (!CheckPlanHead(ProductMo, Ver))
                    strSql += string.Format(@" Insert Into pd_PlanHead (ProductMo,Ver,CustomerID,PlanDate,OrderQty,OrderUnit
                            ,GoodsID,RequestDate,DeliveryDate,ProductRemark,MoRemark
                            ,PlanRemark,CreateUser,CreateTime,AmendUser,AmendTime)" +
                            " Values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}','{14}','{15}')"
                                , ProductMo, Ver, modelPlan.CustomerID, modelPlan.PlanDate, modelPlan.OrderQty, modelPlan.OrderUnit
                                , modelPlan.GoodsID, modelPlan.RequestDate, modelPlan.DeliveryDate
                                , modelPlan.ProductRemark, modelPlan.MoRemark, modelPlan.PlanRemark, UserID, OpDateTime, UserID, OpDateTime);
                else
                    strSql += string.Format(@" Update pd_PlanHead Set CustomerID='{2}',PlanDate='{3}',OrderQty='{4}',OrderUnit='{5}' " +
                                ",GoodsID='{6}',RequestDate='{7}',DeliveryDate='{8}',ProductRemark='{9}',MoRemark='{10}',PlanRemark='{11}'" +
                                ",CreateUser='{12}',CreateTime='{13}',AmendUser='{14}',AmendTime='{15}'" +
                                " Where ProductMo='{0}' And Ver='{1}' "
                                , ProductMo, Ver, modelPlan.CustomerID, modelPlan.PlanDate, modelPlan.OrderQty, modelPlan.OrderUnit
                                , modelPlan.GoodsID, modelPlan.RequestDate, modelPlan.DeliveryDate, modelPlan.ProductRemark, modelPlan.MoRemark, modelPlan.PlanRemark
                                , UserID, OpDateTime, UserID, OpDateTime);
            }
            if (listPlan != null)
            {
                int MaxSeq = GetDetailsMaxSeq(ProductMo, Ver);
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
                        if (!CheckPlanDetails(ProductMo, Ver, Seq))
                            strSql += string.Format(@" Insert Into pd_PlanDetails (ProductMo,Ver,Seq,GoodsID,RequestQty,RequestDate,WipID,NextWipID" +
                                ",CreateUser,CreateTime,AmendUser,AmendTime )" +
                                " Values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}')"
                                    , ProductMo, Ver, Seq, listPlan[i].GoodsID, listPlan[i].RequestQty, listPlan[i].RequestDate
                                    , listPlan[i].WipID, listPlan[i].NextWipID, UserID, OpDateTime, UserID, OpDateTime);
                        else
                            strSql += string.Format(@" Update pd_PlanDetails Set GoodsID='{3}',RequestQty='{4}',RequestDate='{5}',WipID='{6}',NextWipID='{7}' " +
                                ",CreateUser='{8}',CreateTime='{9}',AmendUser='{10}',AmendTime='{11}'" +
                                " Where ProductMo='{0}' And Ver='{1}' And Seq='{2}' "
                                    , ProductMo, Ver, Seq, listPlan[i].GoodsID, listPlan[i].RequestQty, listPlan[i].RequestDate
                                    , listPlan[i].WipID, listPlan[i].NextWipID, UserID, OpDateTime, UserID, OpDateTime);
                    }
                }
            }
            strSql += string.Format(@" COMMIT TRANSACTION ");
            UpdateStatusModels mdj = new UpdateStatusModels();
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            mdj.ReturnValue = ProductMo;
            if (result == "")
            {
                mdj.Status = "0";
            }
            else
            {
                mdj.Status = "1";
                mdj.Msg = result;
            }
            return mdj;
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
        private int GetMoNumber(string MoType,string ID)
        {
            string strSql = "";
            int Val = 0;
            strSql = "Select Val FROM sy_mo_type Where MoType='" + MoType + "' And id='" + ID + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                Val = dt.Rows[0]["Val"].ToString() != "" ? Convert.ToInt32(dt.Rows[0]["Val"]) : 0;
            else
                Val = 0;
            return Val;
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
        public List<PlanHead> GetPlanHeadByParas(string ProductMoFrom,string ProductMoTo,string PlanDateFrom,string PlanDateTo)
        {
            List<PlanHead> lsPlan = new List<PlanHead>();
            
            string strWhere = "";
            if ((ProductMoFrom==null?"":ProductMoFrom) != "" && (ProductMoTo == null ? "" : ProductMoTo) != "")
                strWhere += " And a.ProductMo>='" + ProductMoFrom + "' And a.ProductMo<='" + ProductMoTo + "'";
            if ((PlanDateFrom == null ? "" : PlanDateFrom) != "" && (PlanDateTo == null ? "" : PlanDateTo) != "")
                strWhere += " And a.PlanDate>='" + PlanDateFrom + "' And a.PlanDate<='" + PlanDateTo + "'";
            DataTable dt = GetPlanHeadReturnDataTable(strWhere);
            for (int i=0;i<dt.Rows.Count;i++)
            {
                PlanHead mdjPlan = new PlanHead();
                mdjPlan=DataTableToModel(dt.Rows[i]);
                lsPlan.Add(mdjPlan);
            }
            return lsPlan;
        }
        public PlanHead GetPlanHeadByMo(string ProductMo)
        {
            PlanHead mdjPlan = new PlanHead();
            string strWhere = " And a.ProductMo='" + ProductMo + "'";
            DataTable dt = GetPlanHeadReturnDataTable(strWhere);
            if (dt.Rows.Count > 0)
            {
                mdjPlan=DataTableToModel(dt.Rows[0]);
            }
            return mdjPlan;
         }
        private DataTable GetPlanHeadReturnDataTable(string strWhere)
        {
            PlanHead mdjPlan = new PlanHead();
            mdjPlan.ArtImageUrl = "";
            string strSql = "Select a.*,c.picture_name,";
            if (LanguageID == "0")
                strSql += "b.name AS GoodsCname";
            else if (LanguageID == "2")
                strSql += "b.english_name AS GoodsCname";
            else
                strSql += "d.vn_name1 AS GoodsCname";
            strSql += " FROM pd_PlanHead a " +
                " Left Join it_goods b ON a.GoodsID=b.id " +
                " Left Join cd_pattern c ON b.blueprint_id=c.id " +
                " Left Join it_goods_vn d ON a.GoodsID=d.id" +
                " Where a.ProductMo >=''";
            strSql += strWhere;
            strSql += " Order By a.PlanDate Desc,a.ProductMo";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            return dt;
        }
        private PlanHead DataTableToModel(DataRow dr)
        {
            PlanHead mdjPlan = new PlanHead();
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
            mdjPlan.RequestDate = dr["RequestDate"].ToString();
            mdjPlan.DeliveryDate = dr["DeliveryDate"].ToString();
            mdjPlan.CreateUser = dr["CreateUser"].ToString();
            mdjPlan.CreateTime = dr["CreateTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["CreateTime"])) : "";
            mdjPlan.AmendUser = dr["AmendUser"].ToString();
            mdjPlan.AmendTime = dr["AmendTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["AmendTime"])) : "";
            mdjPlan.ArtImageUrl = ArtImagePath + (dr["picture_name"] != null ? dr["picture_name"].ToString().Trim().Replace("\\", "/") : "");//"AAAA/A888020.bmp";// 
            return mdjPlan;
        }
        public List<PlanDetails> GetPlanDetailsByMo(string ProductMo)
        {

            string strSql = "Select a.*,";
            if (LanguageID == "0")
                strSql += "b.name AS GoodsCname";
            else if (LanguageID == "2")
                strSql += "b.english_name AS GoodsCname";
            else
                strSql += "c.vn_name1 AS GoodsCname";
            strSql+=" FROM pd_PlanDetails a "+
                " Left Join it_goods b ON a.GoodsID=b.id " +
                " Left Join it_goods_vn c ON a.GoodsID=c.id";
            strSql +=" Where ProductMo='" + ProductMo + "'";
            strSql += " Order By Seq ";
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

        public List<PlanModels> GetPlanByMo(string ProductMo)
        {
            List<PlanModels> lsPlan = new List<PlanModels>();
            string strSql = "Select a.*" +
                ",b.Seq" +
                " ,CASE WHEN LEN(d.picture_name) > 0 THEN p.picture_path_web + REPLACE(d.picture_name, '\',' / ') ELSE '' END AS ArtImage" +
                " ,b.GoodsID As DepGoodsID,b.RequestQty As RequestDepQty,b.RequestDate As RequestDepDate,b.WipID,b.NextWipID, ";
            if (LanguageID == "0")
                strSql += "c.name AS GoodsCname,f.name AS DepGoodsCname,h.Name As WipIDName,i.Name As NextWipIDName";
            else if (LanguageID == "2")
                strSql += "c.english_name AS GoodsCname,f.english_name AS DepGoodsCname,h.EngName As WipIDName,i.EngName As NextWipIDName";
            else
                strSql += "e.vn_name1 AS GoodsCname,g.vn_name1 AS DepGoodsCname,h.VieName As WipIDName,i.VieName As NextWipIDName";
            strSql += " FROM pd_PlanHead a " +
                " Inner Join pd_PlanDetails b On a.ProductMo=b.ProductMo And a.Ver=b.Ver " +
                " Left Join it_goods c ON a.GoodsID=c.id " +
                " Left Join cd_pattern d ON c.blueprint_id=d.id " +
                " Left Join it_goods_vn e ON a.GoodsID=e.id" +
                " Left Join it_goods f ON b.GoodsID=f.id " +
                " Left Join it_goods_vn g ON b.GoodsID=g.id" +
                " Left Join bs_loc h ON b.WipID=h.id" +
                " Left Join bs_loc i ON b.NextWipID=i.id" +
                " ,cd_company p" +
                " Where a.ProductMo ='" + ProductMo + "'";
            strSql += " Order By b.ProductMo,b.Seq";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            //List<PlanModels> list = CommonUtils.DataTableToList<PlanModels>(dt);
            //return list;
            for(int i=0;i<dt.Rows.Count;i++)
            {
                PlanModels mdjPlan = new PlanModels();
                DataRow dr = dt.Rows[i];
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
                mdjPlan.RequestDate = dr["RequestDate"].ToString();
                mdjPlan.DeliveryDate = dr["DeliveryDate"].ToString();
                mdjPlan.Seq = dr["Seq"].ToString();
                mdjPlan.RequestDepQty = Convert.ToInt32(dr["RequestDepQty"].ToString());
                mdjPlan.RequestDepDate = dr["RequestDepDate"].ToString();
                mdjPlan.WipID = dr["WipID"].ToString();
                mdjPlan.WipIDName = dr["WipIDName"].ToString();
                mdjPlan.NextWipID = dr["NextWipID"].ToString();
                mdjPlan.NextWipIDName = dr["NextWipIDName"].ToString();
                mdjPlan.DepGoodsID = dr["DepGoodsID"].ToString();
                mdjPlan.DepGoodsCname = dr["DepGoodsCname"].ToString();
                mdjPlan.CreateUser = dr["CreateUser"].ToString();
                mdjPlan.CreateTime = dr["CreateTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["CreateTime"])) : "";
                mdjPlan.AmendUser = dr["AmendUser"].ToString();
                mdjPlan.AmendTime = dr["AmendTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["AmendTime"])) : "";
                mdjPlan.ArtImageUrl = dr["ArtImage"].ToString().Trim();// ArtImagePath + (dr["picture_name"] != null ? dr["picture_name"].ToString().Trim().Replace("\\", "/") : "");//"AAAA/A888020.bmp";// 
                lsPlan.Add(mdjPlan);
            }
            return lsPlan;
        }

    }
}