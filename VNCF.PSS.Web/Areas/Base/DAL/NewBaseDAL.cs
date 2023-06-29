using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using CF.SQLServer.DAL;
using VNCF.PSS.Web.Areas.Base.Models;
using VNCF.PSS.Web.Common;
using System.Data.SqlClient;
using System.Text;
using VNCF.PSS.Web.Areas.Sales.Models;

namespace VNCF.PSS.Web.Areas.Base.DAL
{
    public class NewBaseDAL
    {
        public string LanguageID = DBUtility.GetDetaultLang();
        private string ArtImagePath = DBUtility.ArtImagePath;
        public List<Goods> SearchGoods(Goods searchParams)
        {
            string strSql = "Select top 1000 a.id,a.name,a.english_name,b.vn_name1,b.vn_name2,b.vn_name3 " +
            " ,c.picture_name" +
            " FROM it_goods a " +
            " LEFT JOIN it_goods_vn b ON a.id=b.id" +
            " Left Join cd_pattern c ON a.blueprint_id=c.id " +
            " ,cd_company p" +
            " Where a.type='" + "0001" + "'";
            if (searchParams.goods_id != ""&& searchParams.goods_id != null)
                strSql += " AND a.id Like '" + "%" + searchParams.goods_id + "%" + "'";
            if (searchParams.goods_cname != ""&& searchParams.goods_cname != null)
                strSql += " AND a.name Like '" + "%" + searchParams.goods_cname + "%" + "'";
            if (searchParams.goods_ename != ""&& searchParams.goods_ename != null)
                strSql += " AND a.english_name Like '" + "%" + searchParams.goods_ename + "%" + "'";
            string LangID = LanguageID;
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<Goods> lsGoods = new List<Goods>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                Goods mdj = new Goods();
                mdj.goods_id = dr["id"].ToString();
                mdj.goods_cname = dr["name"].ToString();
                mdj.goods_ename = dr["english_name"].ToString();
                mdj.goods_vname1= dr["vn_name1"].ToString();
                mdj.goods_vname2 = dr["vn_name2"].ToString();
                mdj.goods_vname3 = dr["vn_name3"].ToString();
                mdj.ArtImageUrl = ArtImagePath + (dr["picture_name"] != null ? dr["picture_name"].ToString().Trim().Replace("\\", "/") : "");//"AAAA/A888020.bmp";// 
                lsGoods.Add(mdj);
            }
            return lsGoods;
        }

        public string UpdateGoods(Goods updateParams)
        {
            string result = "";
            string strSql = "Select a.id,a.name,a.english_name " +
            " FROM it_goods a " +
            " INNER JOIN it_goods_vn b ON a.id=b.id" +
            " Where type='" + "0001" + "'";
            strSql += " AND a.id = '" + updateParams.goods_id + "'";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count == 0)
                strSql = string.Format(" Insert Into it_goods_vn (id,vn_name1,vn_name2,vn_name3) Values ('{0}','{1}','{2}','{3}')"
                    , updateParams.goods_id, updateParams.goods_vname1, updateParams.goods_vname2, updateParams.goods_vname3);
            else
                strSql = string.Format(" Update it_goods_vn Set vn_name1='{0}',vn_name2='{1}',vn_name3='{2}' Where id='{3}' "
                    , updateParams.goods_vname1, updateParams.goods_vname2, updateParams.goods_vname3, updateParams.goods_id);
            result= SQLHelper.ExecuteSqlUpdate(strSql);
            return result;
        }

        public Goods GetGoodsByID(string goods_id)
        {
            string LangID = LanguageID;
            string strSql = "Select top 100 a.id,c.picture_name,";
            if (LangID == "0")
                strSql += "a.name ";
            else
                if (LangID == "1")
                strSql += "a.english_name ";
            else
                strSql += "b.vn_name1 ";
            strSql+=" AS name,a.english_name,b.vn_name1,b.vn_name2,b.vn_name3 " +
            " FROM it_goods a " +
            " LEFT JOIN it_goods_vn b ON a.id=b.id" +
            " Left Join cd_pattern c ON a.blueprint_id=c.id " +
            " Where a.type='" + "0001" + "'";
            strSql += " AND a.id = '" + goods_id + "'";
            
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            Goods mdjGoods = new Goods();
            if(dt.Rows.Count>0)
            {
                DataRow dr = dt.Rows[0];
                mdjGoods.goods_id = dr["id"].ToString();
                mdjGoods.goods_cname = dr["name"].ToString();
                mdjGoods.goods_ename = dr["english_name"].ToString();
                mdjGoods.goods_vname1 = dr["vn_name1"].ToString();
                mdjGoods.goods_vname2 = dr["vn_name2"].ToString();
                mdjGoods.goods_vname3 = dr["vn_name3"].ToString();
                mdjGoods.ArtImageUrl = ArtImagePath + (dr["picture_name"] != null ? dr["picture_name"].ToString().Trim().Replace("\\", "/") : "");//"AAAA/A888020.bmp";// 
            }
            else
            {
                mdjGoods.goods_cname = "";
            }
            return mdjGoods;
        }
        public List<ListDataModels> GetLoc()
        {
            string strSql = "Select ID,";
            if (LanguageID == "0")
                strSql += "Name";
            else if (LanguageID == "1")
                strSql += "Engname As Name";
            else
                strSql += "VieName As Name";
            strSql += " FROM bs_Loc Order By ID";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<ListDataModels> lsModel = new List<ListDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                ListDataModels mdj = new ListDataModels();
                mdj.value = dr["id"].ToString();
                mdj.label = dr["name"].ToString();
                lsModel.Add(mdj);
            }
            return lsModel;
        }

        public List<ListDataModels> GetWorkType()
        {
            string strSql = "Select ID,";
            if (LanguageID == "0")
                strSql += "Name";
            else if (LanguageID == "1")
                strSql += "Engname As Name";
            else
                strSql += "VieName As Name";
            strSql += " FROM bs_WorkType Order By ID";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<ListDataModels> lsModel = new List<ListDataModels>();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                ListDataModels mdj = new ListDataModels();
                mdj.value = dr["id"].ToString();
                mdj.label = dr["name"].ToString();
                lsModel.Add(mdj);
            }
            return lsModel;
        }

        public List<RoleAuthorityPowersModels> GetRoleAuthorityPowers(RoleAuthorityPowersModels searchParams)
        {
            string strSql = @"Select Distinct ID,RoleID,RoleName,AuthorityID,AuthorityName,PowersID,Powers,PowersDesc,Remark FROM v_powers WHERE RoleID>0 ";
            if(searchParams.RoleID>0)
            {
                strSql += string.Format(" AND RoleID={0}", searchParams.RoleID);
            }
            if (searchParams.AuthorityID>0)
            {
                strSql += string.Format(" AND AuthorityID={0}", searchParams.AuthorityID);
            }
            if (searchParams.PowersID>0)
            {
                strSql += string.Format(" AND PowersID={0}", searchParams.PowersID);
            }
            strSql += " Order by RoleID,AuthorityID,PowersID";
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            List<RoleAuthorityPowersModels> lst = CommonUtils.DataTableToList<RoleAuthorityPowersModels>(dt);
            return lst;
                       
        }

        public string UpdateRoleAuthorityPowers(RoleAuthorityPowersModels updateParams)
        {
            string result = "";
            string strSql = "";
            string user_id = DBUtility.GetDetaultUserID();
            if (updateParams.ID == 0)
                strSql = string.Format(" Insert Into RoleAuthorityPowers(RoleID,AuthorityID,PowersID,Remark,CreateBy,CreateAt) Values ('{0}','{1}','{2}','{3}','{4}',getdate())"
                    , updateParams.RoleID, updateParams.AuthorityID, updateParams.PowersID, updateParams.Remark, user_id);
            else
                strSql = string.Format(" Update RoleAuthorityPowers Set RoleID={0},AuthorityID={1},PowersID={2},Remark='{3}',UpdateBy='{4}',UpdateAt=getdate() Where ID={5}"
                    , updateParams.RoleID, updateParams.AuthorityID, updateParams.PowersID, updateParams.Remark, user_id, updateParams.ID);
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;
        }
        public string DelRoleAuthorityPowersByID(int ID)
        {
            string result = "";
            string strSql = "";
            if (ID > 0)
            {
                strSql = string.Format("Delete FROM RoleAuthorityPowers WHERE ID={0}", ID);
                result = SQLHelper.ExecuteSqlUpdate(strSql);
            }
            return result;
        }
    }
}