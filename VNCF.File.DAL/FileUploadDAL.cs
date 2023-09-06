using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
//using VNCF.Base.DAL;
using CF.Core.Config;
using CF.SQLServer.DAL;
using VNCF.File.Contract;

namespace VNCF.File.DAL
{
    public static class FileUploadDAL
    {
        //static SQLHelper sh = new SQLHelper(CachedConfigContext.Current.DaoConfig.Cms);//2023/8/28 CANCEL
        //static PubFunDAL pubFun = new PubFunDAL();
        public static file_upload GetHeadByID(string key_id)
        {
            file_upload mdjHead = new file_upload();
            string strSql = string.Format(
                @"Select key_id,file_name,file_type,file_desc,file_desc_vn,parent_key_id,file_name_full_path,create_by,create_date,update_by,update_date FROM FileUpload with(nolock) Where key_id='{0}'", key_id);
            //DataTable dt = sh.ExecuteSqlReturnDataTable(strSql);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
            {
                DataRow dr = dt.Rows[0];
                mdjHead.key_id = dr["key_id"].ToString();
                mdjHead.file_name = dr["file_name"].ToString();
                mdjHead.file_type = dr["file_type"].ToString();
                mdjHead.file_desc = dr["file_desc"].ToString();
                mdjHead.file_desc_vn = dr["file_desc_vn"].ToString();
                mdjHead.parent_key_id = dr["parent_key_id"].ToString();
                mdjHead.file_name_full_path = dr["file_name_full_path"].ToString();                
                mdjHead.create_by = dr["create_by"].ToString();
                mdjHead.update_by = dr["update_by"].ToString();
                mdjHead.create_date = dr["create_date"].ToString();
                mdjHead.update_date = dr["update_date"].ToString();               
            }
            return mdjHead;
        }

        
        //更新描述
        public static object UpdateDesc(List<UpdateDesc> lstUpdateDesc,string user_id)
        {
            string result = string.Empty;
            string str = "";
            StringBuilder sbSql = new StringBuilder(" SET XACT_ABORT ON ");
            sbSql.Append(" BEGIN TRANSACTION ");
            foreach (var item in lstUpdateDesc)
            {
                str = string.Format(
                    @" UPDATE FileUpload with(ROWLOCK) 
                       SET file_desc='{1}',file_desc_vn='{2}',update_by='{3}',update_date=getdate() 
                       WHERE key_id='{0}'",item.key_id, item.file_desc, item.file_desc_vn, user_id);
                sbSql.Append(str);
            }
            sbSql.Append(@" COMMIT TRANSACTION ");
            //result = sh.ExecuteSqlUpdate(sbSql.ToString());
            result = SQLHelper.ExecuteSqlUpdate(sbSql.ToString());
            sbSql.Clear();
            if (result == "")
            {
                return new { result = "ok", message = "保存成功！" };
            }
            else
            {
                return new { result = "error", message = "保存失敗！" };
            }            
            
        }

        public static bool CheckIdIsExists(string tableName, string id)
        {
            bool result = false;
            string strSql = string.Format(@"Select key_id FROM {0} with(nolock) Where key_id='{1}'", tableName, id);
            //DataTable dt = sh.ExecuteSqlReturnDataTable(strSql);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            if (dt.Rows.Count > 0)
                result = true;
            else
                result = false;
            return result;
        }

        //保存
        public static string Save(file_upload headData, string user_id)
         {
            string str = "";
            StringBuilder sbSql = new StringBuilder(" SET XACT_ABORT ON ");
            sbSql.Append(" BEGIN TRANSACTION ");
            string key_id = headData.key_id;
            if (headData.head_status == "NEW")//全新的單據
            {
                bool key_id_exists = CheckIdIsExists("FileUpload", key_id);
                if (key_id_exists)
                {
                    //已存在此單據號,覆蓋更新之前的記錄                    
                    //更新表頭
                    str = string.Format(
                    @" UPDATE FileUpload with(ROWLOCK) 
                       SET parent_key_id='{1}',file_type='{2}',file_desc='{3}',file_desc_vn='{4}',file_name_full_path='{5}',update_by='{6}',update_date=getdate() 
                       WHERE key_id='{0}'",
                       headData.key_id, headData.parent_key_id, headData.file_type, headData.file_desc, headData.file_desc_vn,headData.file_name_full_path, headData.update_by);                    
                }
                else
                {
                    //插入表頭   
                    str = string.Format(
                    @" Insert Into FileUpload(key_id,file_name,file_type,file_desc,file_desc_vn,parent_key_id,file_name_full_path,create_by,create_date) VALUES
                    ('{0}','{1}','{2}','{3}','{4}','{5}','{6}',{7},getdate())",
                    headData.key_id,headData.file_name,headData.file_type,headData.file_desc,headData.file_desc_vn,headData.parent_key_id, headData.file_name_full_path, headData.create_by);                   
                }                             
                sbSql.Append(str);
            }
            else //已保存移交退回單的基礎上進行增刪改
            {
                //更新表頭
                str = string.Format(
                    @" UPDATE FileUpload with(ROWLOCK) 
                       SET parent_key_id='{1}',file_type='{2}',file_desc='{3}',file_desc_vn='{4}',file_name_full_path='{5}',update_by='{6}',update_date=getdate() 
                       WHERE key_id='{0}'",
                       headData.key_id, headData.parent_key_id, headData.file_type, headData.file_desc, headData.file_desc_vn, headData.file_name_full_path, headData.update_by);
                sbSql.Append(str);                
            }
            sbSql.Append(@" COMMIT TRANSACTION ");
            //string result = sh.ExecuteSqlUpdate(sbSql.ToString());
            string result = SQLHelper.ExecuteSqlUpdate(sbSql.ToString());
            sbSql.Clear();
            return result;
        }// --end save

        /// <summary>
        /// 
        /// </summary>
        /// <param name="currentPath">當前相對路徑</param>
        /// <param name="fileName">文件或文件夾名</param>
        /// <param name="fileExt">文件擴展或</param>
        /// <param name="user_id">當前用戶ID</param>
        /// <param name="type">upload--上傳文件;folder--創建空的文件夾</param>
        /// <returns></returns>
        public static string SaveUploadOrNewFolderInfo(string currentPath,string fileName,string fileExt,string user_id,string type)
        {
            string result = string.Empty;
            string strsql = string.Empty;
            if (type == "upload")
            {
                //上傳文件
                currentPath = "\\" + currentPath;
            }
            else
            {
                //type == "folder"
                //只是創建空的文件夾
                //文件夾的處理方式有點不同,查當前文件名的前一層路徑
                //public\Test4  //根目錄下的文件夾
                //public\Test4\Test401   //Test4之下的子文件夾
                string strReplace = "\\" + fileName; //strReplace值是:"\Test4" 或者是:"\Test401,為要替換掉的字符串"

                //注意是替換最后一次出現的位置,不可以用Replace,避免同名被替換掉
                //最終想要的表達式:\public\Test4--->取得:\public; \public\Test4\Test401--->取得:\public\Test4
                int lastIndex = currentPath.LastIndexOf(strReplace);
                currentPath = "\\" + currentPath.Substring(0, lastIndex); 
            }
            
            //先檢查對應的文件夾或者文件名完整路徑是否已存在.       
            string file_name_full_path = currentPath + "\\" + fileName;// 文件的相對完整路徑名稱
            //file_name_full_path--文件的相對完整路徑名稱 是唯一的,如果已存在,說明已上傳功,不會再新增進來.
            strsql = string.Format(@"SELECT '1' FROM FileUpload WHERE file_name_full_path='{0}'", file_name_full_path);
            //DataTable dt = sh.ExecuteSqlReturnDataTable(strsql);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strsql);
            //判斷唯一的完整路徑是否已存在
            if (dt.Rows.Count > 0)
            {
                //文件或文件夾相對完整路徑名稱已存在
                result = "";
            }
            else
            {
                //查找出父級完整的路徑
                int parent_key_id = 0;//0為根節點
                strsql = string.Format(@"SELECT key_id FROM FileUpload Where file_name_full_path='{0}'", currentPath);
                //dt = sh.ExecuteSqlReturnDataTable(strsql);
                dt = SQLHelper.ExecuteSqlReturnDataTable(strsql);
                parent_key_id = (dt.Rows.Count > 0) ? int.Parse(dt.Rows[0]["key_id"].ToString()) : 0;              
                //新增
                strsql = string.Format(
                 @"Insert into FileUpload([file_name],file_type,parent_key_id,file_name_full_path ,create_by ,create_date) VALUES
                  ('{0}','{1}',{2},'{3}','{4}',getdate())", fileName, fileExt, parent_key_id, file_name_full_path, user_id);
                //result = sh.ExecuteSqlUpdate(strsql);
                result = SQLHelper.ExecuteSqlUpdate(strsql);
            }
            return result;
        }

        //復制文件夾時創建空的目標文件夾.
        public static string CopyNewFolder(string currentPath, string fileName, string fileExt, string user_id)
        {
            //傳過來的參數:currentPath = "public\TEST6\123";123是要創建的文件夾
            string result = string.Empty;
            string strsql = string.Empty;
            int index_start = currentPath.LastIndexOf(fileName);
            string strParentPath = "\\" + currentPath.Substring(0, index_start-1);//當前文件名的前面的路徑:\\public\TEST6
            int parent_key_id = 0;
            strsql = string.Format(@"SELECT key_id FROM FileUpload Where file_name_full_path='{0}'", strParentPath);
            //DataTable dt = sh.ExecuteSqlReturnDataTable(strsql);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strsql);
            parent_key_id = int.Parse(dt.Rows[0]["key_id"].ToString());
            string file_name_full_path = strParentPath + "\\" + fileName;
            //新增
            strsql = string.Format(
             @"Insert into FileUpload([file_name],file_type,parent_key_id,file_name_full_path ,create_by ,create_date) VALUES
                  ('{0}','{1}',{2},'{3}','{4}',getdate())", fileName, fileExt, parent_key_id, file_name_full_path, user_id);
            //result = sh.ExecuteSqlUpdate(strsql);
            result = SQLHelper.ExecuteSqlUpdate(strsql);
            return result;
        }

        //更新文件描述
        public static string UpdateFileDesc(string file_name_full_path, string path_prefix_source, string path_prefix_target)
        {
            string result = "";
            int rtn = 0;
            SqlParameter[] paras = new SqlParameter[]{
                new SqlParameter("@file_name_full_path_source",file_name_full_path),
                new SqlParameter("@path_prefix_source",path_prefix_source),
                new SqlParameter("@path_prefix_target",path_prefix_target)
            };
            CommandType cmdType = CommandType.StoredProcedure;
            //rtn = sh.ExecuteNonQuery("", cmdType, "p_update_file_desc", paras);
            rtn = SQLHelper.ExecuteNonQuery("", cmdType, "p_update_file_desc", paras);
            return result;
        }

        //刪除文件夾及其下的子文件夾及全部文件
        /// <summary>
        /// 
        /// </summary>
        /// <param name="file_name_full_path"></param>
        /// <param name="type">1--文件;0--遞規冊除文件夾及子文件夾及其下之文件"</param>
        /// <returns></returns>
        public static string DeleteFolderOrFiles(string file_name_full_path ,string type)
        {
            string result = "";
            int rtn = 0;
            SqlParameter[] paras = new SqlParameter[]{
                new SqlParameter("@file_name_full_path",file_name_full_path),
                new SqlParameter("@type",type)
            };
            CommandType cmdType = CommandType.StoredProcedure;
            //rtn = sh.ExecuteNonQuery("", cmdType, "p_recursion_del", paras);
            rtn = SQLHelper.ExecuteNonQuery("", cmdType, "p_recursion_del", paras);

            return result;
        }

        public static string RenameFolderOrFiles(string old_folder_full_path,string new_folder_full_path,string old_file_name,string new_file_name,string type)
        {
            string result = "";
            int rtn = 0;
            SqlParameter[] paras = new SqlParameter[]{
                 new SqlParameter("@old_folder_full_path",old_folder_full_path),
                 new SqlParameter("@new_folder_full_path",new_folder_full_path),
                 new SqlParameter("@old_file_name",old_file_name),
                 new SqlParameter("@new_file_name",new_file_name),
                 new SqlParameter("@type",type)
            };
            CommandType cmdType = CommandType.StoredProcedure;
            //rtn = sh.ExecuteNonQuery("", cmdType, "p_recursion_rename_folder", paras);
            rtn = SQLHelper.ExecuteNonQuery("", cmdType, "p_recursion_rename_folder", paras);
            return result;
        }

        public static DataTable GetFileUpload(string fullName)
        {
            string strSql = string.Format(@"SELECT [key_id],file_type,file_desc,file_desc_vn FROM FileUpload WHERE file_name_full_path='{0}'", fullName);
            //DataTable dt = sh.ExecuteSqlReturnDataTable(strSql);
            DataTable dt = SQLHelper.ExecuteSqlReturnDataTable(strSql);
            return dt;
        }

        //注銷
        public static string DeleteHead(file_upload head, string user_id)
        {
            string result = "";
            string strSql = string.Format(@"Delete FROM FileUpload with(Rowlock) WHERE key_id='{0}'", head.key_id);
            //result = sh.ExecuteSqlUpdate(strSql);
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;//成功返回空格
        }

        //初始化時插入目錄文件信息
        public static string InsertRecord(string fileName,string fileExt,int parent_key_id,string file_name_full_path, string user_id)
        {
            string result = "";
            string strSql = string.Format(
            @"Insert into FileUpload([file_name],file_type,parent_key_id,file_name_full_path ,create_by ,create_date) VALUES
             ('{0}','{1}',{2},'{3}','{4}',getdate())", fileName, fileExt, parent_key_id, file_name_full_path, user_id);
            result = SQLHelper.ExecuteSqlUpdate(strSql);
            return result;//成功返回空格
        }

        //檢查當前用戶對應操作權限
        public static string CheckAuthority(string user_id)
        {
            string result = string.Empty;

            return result;
        }
    }
}
