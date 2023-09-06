using VNCF.File.DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace FileHelper
{
   public static class FileHelp
    {
        /// <summary>
        /// 根据文件的地址,获取文件目录(json)
        /// {filename=,}
        /// </summary>
        /// <param name="basePath">网站目录</param>
        /// <param name="path">路径</param>
        /// <param name="all">是否是所有文件(true,false--第一个)</param>
        /// <returns></returns>
        public static List<object> GetFiles(string basePath, string path, bool all)
        {
            List<object> list = new List<object>();//申明文件列表object类型
            //网站目录根目录下Document\Files  为文件地址
            string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
            //获取完整地址
            string str2 = FileHelp.Standard(string.Format(@"{0}\{1}", str, path));
            //判断是否存在目录
            if (!Directory.Exists(str2))
            {
                //创建目录
                Directory.CreateDirectory(str2);
            }

            //2023/08/22
            string file_desc = string.Empty;
            string file_desc_vn = string.Empty;
            string file_name_full_path = string.Empty;
            string file_type = string.Empty;
            int index = 0;
            int key_id = 0;
            DataTable dtUpload = new DataTable();           
            //2023/08/22

            DirectoryInfo info = new DirectoryInfo(str2);
            //获取目录下所有子目录(按名字排序)
            foreach (DirectoryInfo info2 in from x in info.GetDirectories()
                                            orderby x.Name
                                            select x)
            {
                //Start 2023/08/22
                index = info2.FullName.IndexOf(@"\public");
                file_name_full_path = info2.FullName.Substring(index);
                dtUpload = FileUploadDAL.GetFileUpload(file_name_full_path);
                if (dtUpload.Rows.Count > 0)
                {
                    key_id = int.Parse(dtUpload.Rows[0]["key_id"].ToString());
                    file_desc = dtUpload.Rows[0]["file_desc"].ToString();
                    file_desc_vn = dtUpload.Rows[0]["file_desc_vn"].ToString();
                    file_type = dtUpload.Rows[0]["file_type"].ToString();
                }
                else
                {
                    key_id = 0;
                    file_desc = "";
                    file_desc_vn = "";
                    file_type = file_type = "";
                }
                //end 2023/08/12
                
                //创建匿名类: 其中filename 为文件名, extension为文件扩展名 ,图标为文件夹图片(EasyUI 图标)
                list.Add(new { filename = info2.Name,
                               extension = "",
                               typeIcon = "/Content/ofupload/themes/icons/folder.png",
                               size = "文件夹",
                               createtime = info2.CreationTime.ToString(),
                               updatetime = info2.LastWriteTime.ToString(),
                               path = info2.FullName.Replace(str, ""),

                               key_id = key_id,
                               file_desc= file_desc,
                               file_desc_vn = file_desc_vn,
                               file_type = file_type

                });
            }
            if (all)
            {
                foreach (FileInfo info3 in from x in info.GetFiles()
                                           orderby x.CreationTime
                                           select x)
                {
                    list.Add(FileHelp.CreateJsonObject(basePath, str, info3));
                }
            }
            return list;
            
        }
        
        /// <summary>
        /// 获取文件夹树
        /// </summary>
        /// <param name="basePath">根目录</param>
        /// <param name="id">地址</param>
        /// <param name="file">标记</param>
        /// <returns></returns>
        public static List<object> GetDirectoryTree(string basePath, string id, string file) {

            List<object> list = new List<object>();//申明文件列表object类型
            //网站目录根目录下Document\Files  为文件地址
            string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
            var isUserTablePng = true;
            var idArray=id.Split('\\');//将ID 分割
            if (idArray.Count()>1)
            {
                isUserTablePng = false;
              
            }
            if (id=="all")
            {
                //加载Document\Files 下所有目录
                ;
            }
            else
            {
                //加载 Id路径下所有子目录并生成 json返回
              str=  FileHelp.Standard(string.Format(@"{0}\{1}", str, id));
            }
            if (!Directory.Exists(str))
            {
                //创建目录
                Directory.CreateDirectory(str);
            }
            //获取所有的目录  
            DirectoryInfo info = new DirectoryInfo(str);
            var theGiretorises = (from x in info.GetDirectories()
                                  orderby x.Name
                                  select x).ToList();
            for (int i = 0; i < theGiretorises.Count(); i++)
            {
                DirectoryInfo info2 = theGiretorises[i];
                //获取该目录的类型: 如果该目录为文件夹  调用本方法 
                var thePath = info2.Name;
                if (id != "all")
                {
                    thePath = string.Format(@"{0}\{1}", id, info2.Name);
                }

                var children = FileHelp.GetDirectoryTree(basePath, thePath, "closed");//获取该不目录下所有子目录文档

                if (file != "closed")
                {
                    list.Add(new { id = thePath, iconCls = "folder_table", state = "open", text = info2.Name, children = children });
                }               
                else
                {                    
                    list.Add(new { id = thePath,state = "closed", text = info2.Name, children = children });
                }
            }
            return list;//返回Json结果
            
        }
        
        /// <summary>
        /// 创建目录
        /// </summary>
        /// <param name="basePath">根目录</param>
        /// <param name="path">文件相对地址</param>
        /// <returns></returns>
        public static object CreateFolder( string basePath, string path) {            
            string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
            //完整地址
            string str2 = FileHelp.Standard(string.Format(@"{0}\{1}", str, path));
            if (Directory.Exists(str2))
            {
                return new { result = "error", message = "该文件夹已经存在！" };
            }
            //创建目录
            Directory.CreateDirectory(str2);

            return new { result = "ok", message = "创建成功！" };




        }

        /// <summary>
        /// 删除文件 删除文件 返回json
        /// </summary>
        /// <param name="basePath">根目录</param>
        /// <param name="files">地址</param>
        /// <returns></returns>
        public static object Delete(string basePath, string[] files)
        {
            try
            {
                //获取地址
                string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
                foreach (string str2 in files)
                {
                    string[] strArray = str2.Split(new char[] { '*' });                   
                    string path = str + strArray[0];
                    //存在文件
                    if (File.Exists(path) && (strArray[1] == "1"))
                    {
                        //删除此文件
                        File.Delete(path);
                    }
                    else if (Directory.Exists(path) && (strArray[1] == "0"))
                    {
                        //删除文件以及其子目录文件
                        Directory.Delete(path, true);
                    }
                    else
                    {
                        //失败
                        return new { result = "error", message = strArray[0] + "-操作错误！" };
                    }
                }
                return new { result = "ok", message = "删除成功！" };
            }
            catch (Exception exception)
            {
                //删除出错
                return new { result = "error", message = exception.Message };
            }
        }
        /// <summary>
        /// 删除文件 返回bool
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public static bool  Delete(string filePath)
        {
            try
            {
               
                    //存在文件
                    if (File.Exists(filePath))
                    {
                        //删除此文件
                        File.Delete(filePath);
                    }
                    else if (Directory.Exists(filePath))
                    {
                        //删除文件以及其子目录文件
                        Directory.Delete(filePath, true);
                    }
                    else
                    {
                    //失败
                    return false;
                    }
                
                return true;
            }
            catch (Exception exception)
            {
                //删除出错
                return false;
            }
        }
        
        /// <summary>
        /// 压缩文件
        /// </summary>
        /// <param name="basePath">网站根目录</param>
        /// <param name="path">相对文件地址</param>
        /// <param name="zipName">压缩名称</param>
        /// <param name="files">文件名称  1- 文件夹  0 -- 文件</param>
        /// <returns></returns>
        public static object Zip(string basePath, string path, string zipName, string[] files) {

            string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
            string str2 = FileHelp.Standard(string.Format(@"{0}\{1}", str, path));
            string str3 = FileHelp.Standard(string.Format(@"{0}\{1}.zip", str2, zipName));
            if (File.Exists(str3))
            {
                return new { result = "error", message = "压缩文件名称已经存在！" };
            }
            try
            {
                
                    var thepath = files[0].Split('*');
                    var  Path = FileHelp.Standard(string.Format(@"{0}\{1}", str, thepath[0]));
                    if (ZIPHelper.Compress(Path, str3, true))
                    {
                        FileInfo fi = new FileInfo(str3);
                        object obj2 = FileHelp.CreateJsonObject(basePath, str, fi);
                        return new { result = "ok", data = obj2 };
                    }
                    else
                    {
                        return new { result = "error", message = "压缩错误" };
                    }
                
               
                
                
            }
            catch (Exception exception)
            {
                return new { result = "error", message = exception.Message };
            }





        }

        /// <summary>
        /// 文件移动
        /// </summary>
        /// <param name="basePath">根目录</param>
        /// <param name="path">地址</param>
        /// <param name="files">地址参数</param>
        /// <param name="user_id">user id 2023/08/17新加的</param>
        /// <returns></returns>
        public static object Move(string basePath, string path, string[] files,string user_id)
        {
            
            try
            {
                //根地址
                string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
                //完整地址
                string str2 = FileHelp.Standard(string.Format(@"{0}\{1}", str, path));

                //start added in 2023/08/17
                string currentPath = path; //目標路徑前綴部門分,不包含文件名. 例如:currentPath = "public\xxxx_target"               
                string fileName = "";
                string fileExt = "";
                // end 2023/08/17

                foreach (string str3 in files)
                {
                    string[] strArray = str3.Split(new char[] { '*' });
                    string str4 = strArray[0].Substring(strArray[0].LastIndexOf(@"\") + 1);//推薦以這種方式直取文件名2023/08/17
                    //原地址
                    string str5 = FileHelp.Standard(string.Format(@"{0}\{1}", str, strArray[0]));
                    //目标地址
                    string str6 = FileHelp.Standard(string.Format(@"{0}\{1}", str2, str4));
                    if (str5 == str6)
                    {
                        return new { result = "error", message = "目标路径与源路径不能相同！" };
                    }
                    if (File.Exists(str6) && (strArray[1] == "1"))
                    {
                        return new { result = "error", message = string.Format("目标路径已存在相同文件名的文件({0}),操作被迫中止！", str4) };
                    }

                    //start added in 2023/08/21
                    string type = strArray[1];//1:删除此文件,0:删除文件以及其子目录文件
                    int index_start = str5.IndexOf(@"\public\");
                    string file_name_full_path_source = str5.Substring(index_start); //源全路徑 "\public\xxxx_source\filename"
                    // end 2023/08/21

                    //start added in 2023/08/24
                    //例子:將\public\xxxx_source\file_name文件夾移到\public\xxxx_target\之下
                    //更新文件用途說明,必須在刪除數據庫中的源文件之前執行.
                    fileName = str4;
                    fileExt = Path.GetExtension(str5);//文件扩展名
                    int index = file_name_full_path_source.LastIndexOf(fileName);
                    string path_prefix_source = file_name_full_path_source.Substring(0, index); //源路徑前綴 例如:\public\xxxx_source\
                    string path_prefix_target = "\\" + currentPath + "\\"; //目標路徑前綴 例如:\public\xxxx_target\
                    // end 2023/08/24

                    if (File.Exists(str5) && (strArray[1] == "1"))
                    {
                        //STEP:1.是文件
                        File.Move(str5, str6); //剪切之后粘貼

                        //STEP:2.目標文件寫入數據庫2023/08/17
                        FileUploadDAL.SaveUploadOrNewFolderInfo(currentPath, fileName, fileExt, user_id, "upload");
                        
                        //STEP:3.
                        FileUploadDAL.UpdateFileDesc(file_name_full_path_source, path_prefix_source, path_prefix_target);

                        //STEP:4.刪除數據庫中的源文件
                        FileUploadDAL.DeleteFolderOrFiles(file_name_full_path_source, type);

                    }
                    else
                    {
                        //是文件夾
                        if (Directory.Exists(str6) && (strArray[1] == "0"))
                        {
                            return new { result = "error", message = string.Format("目标路径已存在相同文件夹名称({0}),操作被迫中止！", str4) };
                        }
                        if (Directory.Exists(str5) && (strArray[1] == "0"))
                        {
                            //寫入數據庫,2023/08/21 
                            //STEP:1.必須先于Directory.Move(str5, str6)執行
                            FileHelp.DireactoryMove(str5, str6, user_id);//str5:源文件夾,str6:目標文件夾 移動整個文件夾
                            
                            //STEP:2.
                            Directory.Move(str5, str6);

                            //STEP:3.例子:將\public\TEST6\TEST601文件夾移到\public\TEST5\之下                            
                            FileUploadDAL.UpdateFileDesc(file_name_full_path_source, path_prefix_source, path_prefix_target);

                            //STEP:4.刪除數據庫中的源文件
                            FileUploadDAL.DeleteFolderOrFiles(file_name_full_path_source, type);                            
                        }
                        else
                        {
                            return new { result = "error", message = strArray[0] + "-操作错误！" };
                        }
                    }
                }
                //剪切操作
                return new { result = "ok", message = "剪切成功！" };
            }
            catch (Exception exception)
            {
                //操作错误
                return new { result = "error", message = exception.Message };
            }
        }
        /// <summary>
        /// 文件复制
        /// </summary>
        /// <param name="basePath"></param>
        /// <param name="path"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        public static object Copy(string basePath, string path, string[] files,string user_id)
        {
            try
            {
                string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
                string str2 = FileHelp.Standard(string.Format(@"{0}\{1}", str, path));
                foreach (string str3 in files)
                {
                    string[] strArray = str3.Split(new char[] { '*' });
                    string str4 = strArray[0].Substring(strArray[0].LastIndexOf(@"\") + 1);
                    string str5 = FileHelp.Standard(string.Format(@"{0}\{1}", str, strArray[0]));
                    string str6 = FileHelp.Standard(string.Format(@"{0}\{1}", str2, str4));
                    if (str5 == str6)
                    {
                        return new { result = "error", message = "目标路径与源路径不能相同！" };
                    }
                    if (File.Exists(str6) && (strArray[1] == "1"))
                    {
                        return new { result = "error", message = string.Format("目标路径已存在相同文件名的文件({0}),操作被迫中止！", str4) };
                    }

                    //start added in 2023/08/17
                    string fileExt = Path.GetExtension(str6);//文件扩展名
                    string fileName = Path.GetFileName(str6);//文件名或者文件夾名
                                                             //end 2023/08/17

                    //start 更新文件說明2023/08/25 
                    //source                                    
                    int index_start = str5.LastIndexOf(@"\public\");
                    string file_name_full_path_source = str5.Substring(index_start);//源全路徑 "\public\xxxx_source\filename"
                    int index = file_name_full_path_source.LastIndexOf(fileName);
                    string path_prefix_source = file_name_full_path_source.Substring(0, index); //源路徑前綴 "\public\xxxx_source\"                      
                   
                    //target
                    index_start = str6.IndexOf(@"\public\");
                    string file_name_full_path_target = str6.Substring(index_start);//currentPath="\public\xxxx_target\filename"
                    index = file_name_full_path_target.LastIndexOf(fileName);
                    string path_prefix_target = file_name_full_path_target.Substring(0, index); //目標徑前綴 "\public\xxxx_target\"                      
                    //end 2023/08/25

                    if (File.Exists(str5) && (strArray[1] == "1"))
                    {
                        File.Copy(str5, str6); //str5:源文件,str6:目標文件

                        //當前循環對象(str3)如果是普通文件(有擴展名)
                        //str6="D:\Workspace\DMS\CF2025.Web.Admin\Document\Files\public\xxxx_target\filename"
                        index = str6.IndexOf(@"public\"); 
                        string current_path_target = str6.Substring(index); //current_path_target = "public\xxxx_target\filename"                   
                        index = current_path_target.LastIndexOf(fileName);
                        current_path_target = current_path_target.Substring(0, index - 1);//current_path_target="public\xxxx_target"
                        FileUploadDAL.SaveUploadOrNewFolderInfo(current_path_target, fileName, fileExt, user_id, "upload");

                        //更新用途說明2023/08/25
                        FileUploadDAL.UpdateFileDesc(file_name_full_path_source, path_prefix_source, path_prefix_target);
                    }
                    else
                    {
                        //當前循環對象(str3)如果是文件夾
                        if (Directory.Exists(str6) && (strArray[1] == "0"))
                        {
                            return new { result = "error", message = string.Format("目标路径已存在相同文件夹名称({0}),操作被迫中止！", str4) };
                        }
                        if (Directory.Exists(str5) && (strArray[1] == "0"))
                        {
                            //复制
                            FileHelp.DireactoryCopy(str5, str6,user_id);//str5:源文件夾,str6:目標文件夾  

                            //更新用途說明2023/08/25
                            FileUploadDAL.UpdateFileDesc(file_name_full_path_source, path_prefix_source, path_prefix_target);
                        }
                        else
                        {
                            return new { result = "error", message = strArray[0] + "-操作错误！" };
                        }
                    }
                }
                return new { result = "ok", message = "复制成功！" };
            }
            catch (Exception exception)
            {
                return new { result = "error", message = exception.Message };
            }
        }

        /// <summary>
        /// 重命名
        /// </summary>
        /// <param name="basePath">根目录</param>
        /// <param name="path">相对位置</param>
        /// <param name="oldFileName">旧名称</param>
        /// <param name="newFileName">新名称</param>
        /// <param name="type">类型</param>
        /// <returns></returns>
        public static object Rename(string basePath, string path, string oldFileName, string newFileName, string type)
        {
            try
            {
                
                string str = string.Format(@"{0}\Document\Files", basePath);
                string str2 = FileHelp.Standard(string.Format(@"{0}\{1}\{2}", str, path, oldFileName));
                string str3 = FileHelp.Standard(string.Format(@"{0}\{1}\{2}{3}", new object[] { str, path, newFileName, Path.GetExtension(oldFileName) }));
                if (type == "0")
                {
                    if (!Directory.Exists(str2))
                    {
                        return new { result = "error", message = "源文件夹已不存在！" };
                    }
                    if (Directory.Exists(str3))
                    {
                        return new { result = "error", message = "该文件夹名称已经存在！" };
                    }
                    Directory.Move(str2, str3);
                    return new { result = "ok", message = "重命名成功！" };
                }
                if (!File.Exists(str2))
                {
                    return new { result = "error", message = "源文件已不存在！" };
                }
                if (File.Exists(str3))
                {
                    return new { result = "error", message = "该文件名称已经存在！" };
                }
                File.Move(str2, str3);
                return new { result = "ok", message = "重命名成功！" };
            }
            catch (Exception exception)
            {
                return new { result = "error", message = exception.Message };
            }
        }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="basePath">根目录</param>
        /// <param name="path">相对地址</param>
        /// <returns></returns>
        public static object Upload(string basePath, string path, HttpPostedFileBase file)
        {
            try
            {               
                string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
                string destpath = FileHelp.Standard(string.Format(@"{0}\{1}", str, path));
                if (FileHelp.SaveAs(file, destpath) > 0)
                {
                    return new { result = "ok", message = "上传完成！" };
                }
                return new { result = "null", message = "未移动任何文件！" };
            }
            catch (Exception exception)
            {
                return new { result = "error", message = exception.Message };
            }
        }
        
        /// <summary>
        /// 文件保存在本地
        /// </summary>
        /// <param name="type"></param>
        /// <param name="destpath"></param>
        /// <returns></returns>
        public static  int SaveAs(HttpPostedFileBase file, string destpath)
        {
            string fileName = string.Empty;//文件名
            string dir = string.Empty;//文件相对路径
            if (file != null)
            {
                fileName = Path.GetFileName(file.FileName);
                string fileExt = Path.GetExtension(fileName);//文件扩展名
                //文件限制
                if (!Directory.Exists(destpath)) //   创建文件夹
                {
                    Directory.CreateDirectory(destpath);
                }
                try
                {
                    file.SaveAs(destpath);//存储文件
                    return 1;
                }
                catch (Exception)
                {

                    return 0;
                }

            }
            else
            {
                return 0;
            }           
                
        }

        /// <summary>
        /// 获取下载文件真实地址
        /// </summary>
        /// <param name="basePath"></param>
        /// <param name="path"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        public static string Download(string basePath, string[] paths,string newFileName)
        {
            //对于多个文件下载,先建立一个新的文件夹 将所有文件 复制到新文件夹中
            //并返回新文件夹的 地址
            //basePath 默认是     document /files
            //path  为文件的相对地址

            //第一步 ,创建一个新的文件夹

            if (!Directory.Exists(newFileName))
            {
                Directory.CreateDirectory(newFileName);
            }
            // 第二步 将文件复制到文件夹内

            foreach (var path in paths)
            {
                bool isDireactory = false;//默认 不是文件夹
                string[] thepath = path.Split('*');
                if (thepath[1]!="1")
                {
                    isDireactory = true;//为文件夹
                }               
                string str2 = FileHelp.Standard(string.Format(@"{0}\{1}", basePath, thepath[0]));//旧地址
                string str3 = FileHelp.Standard(string.Format(@"{0}\{1}", newFileName, thepath[0]));//新地址
                //判断文件是文件夹还是文件
               

                if (isDireactory)
                {                  
                    DireactoryCopy(str2, str3,"");//文件夹复制
                }
                else
                {
                    FileCopy(str2, str3);  //文件复制
                }            
              
            }

            return FileHelp.Standard(newFileName);           
        }

        /// <summary>
        /// 文件夹复制
        /// </summary>
        /// <param name="source">源文件夾</param>
        /// <param name="target">目標文件夾</param>
        /// <param name="user_id">用戶ID //2023/08/17新加</param>
        private static void DireactoryCopy(string source, string target,string user_id)
        {
            if (!target.StartsWith(source, StringComparison.CurrentCultureIgnoreCase))
            {
                DirectoryInfo info = new DirectoryInfo(source); //得到源文件夾對象相關文件信息
                DirectoryInfo info2 = new DirectoryInfo(target); 
                info2.Create();//創建空的目錄文件夾

                //數據庫要創建目標文件夾
                //string user_id = "";   增加了user_id參數
                string fileExt = ".folder";
                string str2 = info2.FullName;
                string fileName = Path.GetFileName(str2);
                int index_start = str2.IndexOf("public");
                string currentPath = str2.Substring(index_start, str2.Length - index_start);//最終得到 currentPath = "public\TEST6\123";                
                //數據庫中創建空的目標文件夾
                FileUploadDAL.CopyNewFolder(currentPath, fileName, fileExt, user_id);

                //取出源文件夾之下的全部文件(注意并不包含子文件夾中的文件)
                FileInfo[] files = info.GetFiles();
                foreach (FileInfo info3 in files)
                {
                    //取出的文件依全部復制到目標文件夾(info2)中
                    File.Copy(info3.FullName, info2.FullName + @"\" + info3.Name, true);

                    //以下是保存到數據庫部分2023/08/17                  
                    fileName = info3.Name;                    
                    fileExt = Path.GetExtension(info3.FullName);//文件扩展名                     
                    FileUploadDAL.SaveUploadOrNewFolderInfo(currentPath, fileName, fileExt, user_id, "upload");
                }
                //取出源文件夾之下的全部文件夾(注意并不包含子文件夾)
                DirectoryInfo[] directories = info.GetDirectories();
                foreach (DirectoryInfo info4 in directories)
                {
                    //再遞歸調用
                    FileHelp.DireactoryCopy(info4.FullName, info2.FullName + @"\" + info4.Name,user_id);                    
                }
            }
        }

        /// <summary>
        /// 文件夹移動
        /// </summary>
        /// <param name="source">源文件夾</param>
        /// <param name="target">目標文件夾</param>
        /// <param name="user_id">用戶ID //2023/08/17新加</param>
        private static void DireactoryMove(string source, string target, string user_id)
        {
            if (!target.StartsWith(source, StringComparison.CurrentCultureIgnoreCase))
            {
                DirectoryInfo info = new DirectoryInfo(source); //得到源文件夾對象相關文件信息
                DirectoryInfo info2 = new DirectoryInfo(target);
                
                //數據庫要創建目標文件夾
                //string user_id = "";   增加了user_id參數
                string fileExt = ".folder";
                string str2 = info2.FullName;
                string fileName = Path.GetFileName(str2);
                int index_start = str2.IndexOf("public");
                string currentPath = str2.Substring(index_start, str2.Length - index_start);//最終得到目標路徑 currentPath = "public\TEST6\123";                
                //數據庫中創建空的目標文件夾
                FileUploadDAL.CopyNewFolder(currentPath, fileName, fileExt, user_id);

                //取出源文件夾之下的全部文件(注意并不包含子文件夾中的文件)
                FileInfo[] files = info.GetFiles();
                foreach (FileInfo info3 in files)
                {
                    //取出的文件依全部復制到目標文件夾(info2)中
                    // File.Copy(info3.FullName, info2.FullName + @"\" + info3.Name, true);

                    //以下是保存到數據庫部分2023/08/17                  
                    fileName = info3.Name;
                    fileExt = Path.GetExtension(info3.FullName);//文件扩展名                     
                    FileUploadDAL.SaveUploadOrNewFolderInfo(currentPath, fileName, fileExt, user_id, "upload");
                }
                //取出源文件夾之下的全部文件夾(注意并不包含子文件夾)
                DirectoryInfo[] directories = info.GetDirectories();
                foreach (DirectoryInfo info4 in directories)
                {
                    //再遞歸調用
                    FileHelp.DireactoryMove(info4.FullName, info2.FullName + @"\" + info4.Name, user_id);
                }
            }
        }


        /// <summary>
        /// 文件复制
        /// </summary>
        /// <param name="source"></param>
        /// <param name="target"></param>
        public static void FileCopy(string source, string target) {
            
          
            bool isrewrite = true; // true=覆盖已存在的同名文件,false则反之
            System.IO.File.Copy(source, target, isrewrite);//复制文件

        }
        
        /// <summary>
        /// 创建Json结果
        /// </summary>
        /// <param name="basePath">根目录(网站)</param>
        /// <param name="rootPath">文件完整目录(Document/file)</param>
        /// <param name="fi">文件信息</param>
        /// <returns>Json结果</returns>
        private static  object CreateJsonObject(string basePath, string rootPath, FileInfo fi)
        {
            //返回 文件的扩展名
            string extension = Path.GetExtension(fi.FullName);
            //获取EasyUI 中对应文件类型的图标
            string str2 = string.Format("/Content/ofupload/themes/filetype/{0}.gif", extension.Replace(".", ""));
            //判断是否存在图标
            if (!File.Exists(basePath + str2))
            {
                //该文件类型不存在对应图标 ,标记为unknown图表
                str2 = string.Format("/Content/ofupload/themes/filetype/{0}.gif", "unknown");
            }
            //计算当前图片的大小 (由Byte转换为KB)
            double num = ((double)fi.Length) / 1024.0;

            
            //Start added in 2023/08/22
            int index = 0,key_id=0;
            string file_desc = string.Empty;
            string file_name_full_path = string.Empty;
            string file_desc_vn = string.Empty;
            string file_type = string.Empty;
            index = fi.FullName.IndexOf(@"\public");
            file_name_full_path = fi.FullName.Substring(index);
            DataTable dtUpload = FileUploadDAL.GetFileUpload(file_name_full_path);
            if (dtUpload.Rows.Count > 0)
            {
                key_id = int.Parse(dtUpload.Rows[0]["key_id"].ToString());
                file_desc = dtUpload.Rows[0]["file_desc"].ToString();
                file_desc_vn = dtUpload.Rows[0]["file_desc_vn"].ToString();
                file_type = dtUpload.Rows[0]["file_type"].ToString();
            }
            else
            {
                key_id = 0;
                file_desc = "";
                file_desc_vn = "";
                file_type = "";
            }
            //end 2023/08/12


            //返回JsonResult
            return new { filename = fi.Name,
                extension = extension,
                typeIcon = str2,
                size = num.ToString("0.00") + " KB",
                createtime = fi.CreationTime.ToString(),
                updatetime = fi.LastWriteTime.ToString(),
                path = fi.FullName.Replace(rootPath, ""),
                key_id = key_id,
                file_desc = file_desc,
                file_desc_vn = file_desc_vn,
                file_type = file_type
            };
        }
        
        /// <summary>
        /// 标准替换
        /// 将\\替换为\
        /// </summary>
        /// <param name="fileName">文件名(带有\\)</param>
        /// <returns>标准文件名</returns>
        public  static string Standard(string fileName)
        {
            //由于ASP.NET 获取地址带有\\  该地址不能应用与文件夹操作  
            //将\\转换为\ 即可
            while (fileName.IndexOf(@"\\") >= 0)
            {
                fileName = fileName.Replace(@"\\", @"\");
            }
            return fileName;
        }


        //初始化后文件夾及文件,檢查是否已存在,不存在則插入.
        //public static List<object> IntFiles(string basePath, string path)
        public static object IntFiles(string basePath, string path,string user_id)
        {
            try
            {
                //网站目录根目录下Document\Files  为文件地址
                string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
                //获取完整地址
                string str2 = FileHelp.Standard(string.Format(@"{0}\{1}", str, path));
                //判断是否存在目录
                if (Directory.Exists(str2))
                {
                    string file_name_full_path = string.Empty;
                    string file_type = string.Empty;
                    string fileExt = string.Empty;
                    string path_prefix = string.Empty;
                    string fileName = string.Empty;
                    int index = 0;
                    int parent_key_id = 0;

                    DataTable dt = new DataTable();
                    //獲取當前路徑下的目錄、文件信息
                    DirectoryInfo info = new DirectoryInfo(str2);

                    //獲取當前路徑下的文件
                    foreach (FileInfo info3 in from x in info.GetFiles() orderby x.CreationTime select x)
                    {
                        //Start 2023/08/22
                        index = info3.FullName.IndexOf(@"\public\");
                        file_name_full_path = info3.FullName.Substring(index);
                        fileName = info3.Name;
                        fileExt = info3.Extension;
                        index = file_name_full_path.LastIndexOf(fileName);
                        path_prefix = file_name_full_path.Substring(0, index);
                        dt = FileUploadDAL.GetFileUpload(file_name_full_path);
                        if (dt.Rows.Count == 0)
                        {
                            //找不到
                            //查找父節點
                            if (path_prefix == "\\public\\")
                            {
                                //已是根目錄下的文件
                                parent_key_id = 0;//設置父節點
                            }
                            else
                            {
                                path_prefix = path_prefix.Substring(0, path_prefix.Length - 1);//父層全路徑,少最右邊的"\"杠
                                dt = FileUploadDAL.GetFileUpload(path_prefix);
                                parent_key_id = int.Parse(dt.Rows[0]["key_id"].ToString());
                            }
                            FileUploadDAL.InsertRecord(fileName, fileExt, parent_key_id, file_name_full_path, user_id);
                        }
                    }

                    //获取當前目錄下所有子目錄(按名字排序)
                    foreach (DirectoryInfo info2 in from x in info.GetDirectories() orderby x.Name select x)
                    {
                        index = info2.FullName.IndexOf(@"\public\");
                        file_name_full_path = info2.FullName.Substring(index);
                        fileName = info2.Name;
                        fileExt = ".folder";
                        index = file_name_full_path.LastIndexOf(fileName);
                        path_prefix = file_name_full_path.Substring(0, index);
                        dt = FileUploadDAL.GetFileUpload(file_name_full_path);
                        if (dt.Rows.Count == 0)
                        {
                            if (path_prefix == "\\public\\")
                            {
                                //已是根目錄下的文件
                                parent_key_id = 0;//設置父節點
                            }
                            else
                            {
                                path_prefix = path_prefix.Substring(0, path_prefix.Length - 1);//父層全路徑,少最右邊的"\"杠
                                dt = FileUploadDAL.GetFileUpload(path_prefix);
                                parent_key_id = int.Parse(dt.Rows[0]["key_id"].ToString());
                            }
                            FileUploadDAL.InsertRecord(fileName, fileExt, parent_key_id, file_name_full_path, user_id);
                        }

                        IntFiles(basePath, file_name_full_path, user_id);
                    }//foreach info2                     
                }
                return new { result = "ok", message = "目錄初始化成功！" };
            }
            catch (Exception exception)
            {
                return new { result = "error", message = exception.Message };
            }           
            
        }

    }
}
