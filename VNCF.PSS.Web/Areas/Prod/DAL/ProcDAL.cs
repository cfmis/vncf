using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Areas.Prod.Models;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Common;

namespace VNCF.PSS.Web.Areas.Prod.DAL
{
    
    public class ProcDAL
    {
        public string LanguageID = DBUtility.GetDetaultLang();
        private string ArtImagePath = DBUtility.ArtImagePath;
        private string dgerp2 = DBUtility.dgerp2;
        //GetGoodsFromPlan

        public List<ListDataModels> GetGoodsFromPlan(string ProductMo)
        {
            string strSql = "Select a.GoodsID,d.picture_name,";
            if (LanguageID == "0")
                strSql += "c.name AS GoodsCname";
            else if (LanguageID == "1")
                strSql += "c.english_name AS GoodsCname";
            else
                strSql += "e.vn_name1 AS GoodsCname";
            strSql += " From pd_PlanDetails a " +
            " Left Join it_goods c ON a.GoodsID=c.id " +
            " Left Join cd_pattern d ON c.blueprint_id=d.id " +
            " Left Join it_goods_vn e ON a.GoodsID=e.id" +
            " Where a.ProductMo= '" + ProductMo + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<ListDataModels> lsGoods = new List<ListDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                ListDataModels mdj = new ListDataModels();
                mdj.label = dr["GoodsID"].ToString().Trim() + " / " + dr["GoodsCname"].ToString().Trim();
                mdj.value = dr["GoodsID"].ToString();
                lsGoods.Add(mdj);
            }
            return lsGoods;
        }
        public string UpdateProc(ProcModels objProc)
        {
            string result = "";
            string strSql = "";
            string UserID = DBUtility.GetDetaultUserID();
            string OpDateTime = DBUtility.ConvertDateTimeFormat(System.DateTime.Now);
            strSql += string.Format(@" SET XACT_ABORT  ON ");
            strSql += string.Format(@" BEGIN TRANSACTION ");
            if (objProc.ID == 0)
                strSql += string.Format(@" Insert Into pd_ProductRecords (PrdDep,ProductMo,PrdDate,GoodsID,PrdQty,PrdWeg,StartRunQty
                            ,EndRunQty,RunQty,MachineID,WorkType,WorkerID,PrdClass,PrdGroup,StartTime,EndTime,WorkHours
                            ,OtHours,LineNum,HourRunNum,HourStdQty,PerKgPcs,QcFlag,MatGoodsID,MatGoodsLot
                            ,NextDepID,DifficultyLevel,WorkCode,JobType,CreateUser,CreateTime,AmendUser,AmendTime)" +
                        " Values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}'" +
                            ", '{13}', '{14}', '{15}', '{16}', '{17}', '{18}', '{19}','{20}'" +
                            ",'{21}','{22}','{23}','{24}','{25}','{26}','{27}','{28}','{29}','{30}'" +
                            ",'{31}','{32}')"
                            , objProc.PrdDep, objProc.ProductMo, objProc.PrdDate, objProc.GoodsID, objProc.PrdQty, objProc.PrdWeg
                            , objProc.StartRunQty, objProc.EndRunQty, objProc.RunQty, objProc.MachineID, objProc.WorkType, objProc.WorkerID
                            , objProc.PrdClass, objProc.PrdGroup, objProc.StartTime, objProc.EndTime, objProc.WorkHours
                            , objProc.OtHours, objProc.LineNum, objProc.HourRunNum, objProc.HourStdQty
                            , objProc.PerKgPcs, objProc.QcFlag, objProc.MatGoodsID, objProc.MatGoodsLot
                            , objProc.NextDepID, objProc.DifficultyLevel, objProc.WorkCode, objProc.JobType
                            , UserID, OpDateTime, UserID, OpDateTime);
            else
                strSql += string.Format(@" Update pd_ProductRecords Set PrdDep='{1}',ProductMo='{2}',PrdDate='{3}',GoodsID='{4}',PrdQty='{5}'
                            ,PrdWeg='{6}',StartRunQty='{7}',EndRunQty='{8}',RunQty='{9}',MachineID='{10}',WorkType='{11}'
                            ,WorkerID='{12}',PrdClass='{13}',PrdGroup='{14}',StartTime='{15}',EndTime='{16}',WorkHours='{17}'
                            ,OtHours='{18}',LineNum='{19}',HourRunNum='{20}',HourStdQty='{21}'
                            ,PerKgPcs='{22}',QcFlag='{23}',MatGoodsID='{24}',MatGoodsLot='{25}'
                            ,NextDepID='{26}',DifficultyLevel='{27}',WorkCode='{28}',JobType='{29}'
                            ,AmendUser='{30}',AmendTime='{31}'
                            Where ID='{0}' "
                            , objProc.ID
                            , objProc.PrdDep, objProc.ProductMo, objProc.PrdDate, objProc.GoodsID, objProc.PrdQty, objProc.PrdWeg
                            , objProc.StartRunQty, objProc.EndRunQty, objProc.RunQty, objProc.MachineID, objProc.WorkType, objProc.WorkerID
                            , objProc.PrdClass, objProc.PrdGroup, objProc.StartTime, objProc.EndTime, objProc.WorkHours
                            , objProc.OtHours, objProc.LineNum, objProc.HourRunNum, objProc.HourStdQty
                            , objProc.PerKgPcs, objProc.QcFlag, objProc.MatGoodsID, objProc.MatGoodsLot
                            , objProc.NextDepID, objProc.DifficultyLevel, objProc.WorkCode, objProc.JobType
                            , UserID, OpDateTime);
            strSql += string.Format(@" COMMIT TRANSACTION ");
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;
        }

        public List<ProcModels> SearchData(int SearchType,int ID,string PrdDep,string PrdDate)
        {
            string strSql = "Select a.*,";
            if (LanguageID == "0")
                strSql += "b.name AS GoodsCname";
            else if (LanguageID == "1")
                strSql += "b.english_name AS GoodsCname";
            else
                strSql += "c.vn_name1 AS GoodsCname";
            strSql += " FROM pd_ProductRecords a " +
                " Left Join it_goods b ON a.GoodsID=b.id " +
                " Left Join it_goods_vn c ON a.GoodsID=c.id";
            strSql += " Where a.ID>=0";
            if (SearchType == 1)
            {
                if ((PrdDep == null ? "" : PrdDep) != "")
                    strSql += " AND a.PrdDep='" + PrdDep + "'";
                if ((PrdDate == null ? "" : PrdDate) != "")
                    strSql += " AND a.PrdDate='" + PrdDate + "'";
            }
            else
            {
                strSql += " AND a.ID='" + ID + "'";
            }
            strSql += " Order By a.PrdDate Desc,a.ProductMo ";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<ProcModels> lsProc = new List<ProcModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                ProcModels mdjProc = new ProcModels();
                DataRow dr = dt.Rows[i];
                mdjProc.ID = dr["ID"].ToString() == "" ? 0 : Convert.ToInt32(dr["ID"].ToString());
                mdjProc.ProductMo = dr["ProductMo"].ToString();
                mdjProc.PrdDep = dr["PrdDep"].ToString();
                mdjProc.PrdDate = dr["PrdDate"].ToString();
                mdjProc.GoodsID = dr["GoodsID"].ToString();
                mdjProc.GoodsCname = dr["GoodsCname"].ToString();
                mdjProc.PrdQty = dr["PrdQty"].ToString() == "" ? 0 : Convert.ToInt32(dr["PrdQty"].ToString());
                mdjProc.PrdWeg = dr["PrdWeg"].ToString() == "" ? 0 : Convert.ToSingle(dr["PrdWeg"].ToString());
                mdjProc.StartTime = dr["StartTime"].ToString();
                mdjProc.EndTime = dr["EndTime"].ToString();
                mdjProc.WorkHours = dr["WorkHours"].ToString() == "" ? 0 : Convert.ToSingle(dr["WorkHours"].ToString());
                mdjProc.PrdWeg = dr["OtHours"].ToString() == "" ? 0 : Convert.ToSingle(dr["OtHours"].ToString());
                mdjProc.StartRunQty = dr["StartRunQty"].ToString() == "" ? 0 : Convert.ToInt32(dr["StartRunQty"].ToString());
                mdjProc.EndRunQty = dr["EndRunQty"].ToString() == "" ? 0 : Convert.ToInt32(dr["EndRunQty"].ToString());
                mdjProc.RunQty = dr["RunQty"].ToString() == "" ? 0 : Convert.ToInt32(dr["RunQty"].ToString());
                mdjProc.LineNum = dr["LineNum"].ToString() == "" ? 0 : Convert.ToInt32(dr["LineNum"].ToString());
                mdjProc.HourRunNum = dr["HourRunNum"].ToString() == "" ? 0 : Convert.ToInt32(dr["HourRunNum"].ToString());
                mdjProc.HourStdQty = dr["HourStdQty"].ToString() == "" ? 0 : Convert.ToInt32(dr["HourStdQty"].ToString());
                mdjProc.PerKgPcs = dr["PerKgPcs"].ToString() == "" ? 0 : Convert.ToInt32(dr["PerKgPcs"].ToString());
                mdjProc.MachineID = dr["MachineID"].ToString();
                mdjProc.WorkType = dr["WorkType"].ToString();
                mdjProc.WorkerID = dr["WorkerID"].ToString();
                mdjProc.PrdClass = dr["PrdClass"].ToString();
                mdjProc.PrdGroup = dr["PrdGroup"].ToString();
                mdjProc.QcFlag = dr["QcFlag"].ToString();
                mdjProc.MatGoodsID = dr["MatGoodsID"].ToString();
                mdjProc.MatGoodsLot = dr["MatGoodsLot"].ToString();
                mdjProc.JobType = dr["JobType"].ToString();
                mdjProc.WorkCode = dr["WorkCode"].ToString();
                mdjProc.NextDepID = dr["NextDepID"].ToString();
                mdjProc.DifficultyLevel = dr["DifficultyLevel"].ToString();
                mdjProc.CreateUser = dr["CreateUser"].ToString();
                mdjProc.CreateTime = dr["CreateTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["CreateTime"])) : "";
                mdjProc.AmendUser = dr["AmendUser"].ToString();
                mdjProc.AmendTime = dr["AmendTime"].ToString().Trim() != "" ? DBUtility.ConvertDateTimeFormat(Convert.ToDateTime(dr["AmendTime"])) : "";
                lsProc.Add(mdjProc);
            }
            return lsProc;
        }
    }
}