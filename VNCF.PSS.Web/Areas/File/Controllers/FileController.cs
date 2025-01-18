using VNCF.PSS.Web.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FileHelper;
using System.IO;
using VNCF.File.DAL;
using VNCF.File.Contract;


namespace VNCF.PSS.Web.Areas.File.Controllers
{
    public class FileController : AdminControllerBase
    {
        // GET: File/File      
        public ActionResult Index()
        {
            ViewData["user_id"] = this.LoginInfo.LoginName.ToString();
            return View();
        }

        public ActionResult InitFolderStruct()
        {
            ViewBag.user_id = this.LoginInfo.LoginName.ToString();
            return View();
        }

        /// <summary>
        /// 是否具有管理共享文件夹权限
        /// </summary>
        /// <returns></returns>
        public JsonResult AdminShare()
        {
            object obj = new { result = "true" };
            return Json(obj, "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 具有管理共享文件权限，只用于判断无其他用处
        /// </summary>
        /// <returns></returns>
        public string Share()
        {
            return "ok";
        }

        /// <summary>
        /// 获取当前目录文件及文件夹列表
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public JsonResult GetFiles(string path)
        {
            string basePath = Server.MapPath("~");
            //得到文件夹路径
            //var data = FileHelper.FileHelp.GetFiles(basePath, path, true);            
            return Json(FileHelp.GetFiles(basePath, path, true), "text/html", JsonRequestBehavior.AllowGet);
        }       

        /// <summary>
        /// 获取目录结构
        /// </summary>
        /// <returns></returns>
        public JsonResult GetDirectory(string id, string file)
        {
            string basePath = Server.MapPath("~");
            if (id == null)
            {
                id = "all";
                file = "open";
            }

            try
            {
                //var dd = (FileHelper.FileHelp.GetDirectoryTree(basePath, id, file));
                return Json(FileHelper.FileHelp.GetDirectoryTree(basePath, id, file), "text/html", JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {

                return Json(new { result = "no" });
            }

        }

        /// <summary>
        /// 创建目录
        /// </summary>
        /// <param name="basePath"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        public JsonResult CreateFolder(string path)
        {
            string basePath = Server.MapPath("~");
            //return Json(FileHelp.CreateFolder(basePath, path), "text/html", JsonRequestBehavior.AllowGet);//原代碼

            //以下為新的代碼,因要保存新建的文件夾信息到數據庫            
            var jsonData = FileHelp.CreateFolder(basePath, path);
            string strData = jsonData.ToString();
            if (strData.Contains("result = ok"))
            {
                //文件夾創建成功之后再寫入數據庫
                string user_id = this.LoginInfo.LoginName.ToString();
                //path:public\TEST4
                string fileExt = ".folder";
                string fileName = Path.GetFileName(path);//獲取TEST4文件名               
                FileUploadDAL.SaveUploadOrNewFolderInfo(path, fileName, fileExt, user_id, "folder");
            }
            return Json(jsonData, "text/html", JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public JsonResult Save(string file)
        {
            string[] files = file.Split('|');
            string key_id = "";
            string file_desc = "";
            string file_desc_vn = "";
            string user_id = this.LoginInfo.LoginName.ToString();
            List<UpdateDesc> lstUpdateDesc = new List<UpdateDesc>();
            foreach (string str2 in files)
            {
                UpdateDesc lst = new UpdateDesc();
                string[] strArray = str2.Split(new char[] { '*' });
                key_id = strArray[0];
                file_desc = strArray[1];
                file_desc_vn = strArray[2];//1:删除此文件,0:删除文件以及其子目录文件
                lst.key_id = key_id;
                lst.file_desc = file_desc;
                lst.file_desc_vn = file_desc_vn;
                lstUpdateDesc.Add(lst);
            }
            var jsonData = FileUploadDAL.UpdateDesc(lstUpdateDesc, user_id);
            return Json(jsonData, "text/html", JsonRequestBehavior.AllowGet);
        }


        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="basePath"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        public JsonResult Delete(string file)
        {
            string basePath = Server.MapPath("~");
            string[] files = file.Split('|');
            // return Json(FileHelp.Delete(basePath, files), "text/html", JsonRequestBehavior.AllowGet);//原代碼

            //以下這寫刪除數據文件的代碼
            var jsonData = FileHelp.Delete(basePath, files);//物理刪除
            string strData = jsonData.ToString();
            //數據庫刪除
            if (strData.Contains("result = ok"))
            {
                //获取地址
                string str = FileHelp.Standard(string.Format(@"{0}\Document\Files", basePath));
                foreach (string str2 in files)
                {
                    string[] strArray = str2.Split(new char[] { '*' });
                    string path = str + strArray[0];
                    string file_name_full_path = strArray[0];//文件全路徑
                    string type = strArray[1];//1:删除此文件,0:删除文件以及其子目录文件
                    FileUploadDAL.DeleteFolderOrFiles(file_name_full_path, type);
                }
            }
            return Json(jsonData, "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 文件移动 (剪切粘貼)
        /// </summary>
        /// <returns></returns>
        public JsonResult Move(string path, string file)
        {
            string user_id = this.LoginInfo.LoginName.ToString();//新增加2023/08/23
            string basePath = Server.MapPath("~");
            string[] files = file.Split('|');
            return Json(FileHelp.Move(basePath, path, files, user_id), "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 文件复制
        /// </summary>
        /// <returns></returns>
        public JsonResult Copy(string path, string file)
        {
            string basePath = Server.MapPath("~");
            string[] files = file.Split('|');
            string user_id = this.LoginInfo.LoginName.ToString();//2023/08/17 添加此字段
            return Json(FileHelp.Copy(basePath, path, files, user_id), "text/html", JsonRequestBehavior.AllowGet);//2023/08/17 添加user_id
        }

        /// <summary>
        /// 重命名
        /// </summary>
        /// <param name="oldFileName"></param>
        /// <param name="newFileName"></param>
        /// <returns></returns>
        public JsonResult Rename(string path, string oldFileName, string newFileName, string type, string fileExt)
        {
            string basePath = Server.MapPath("~");
            //return Json(FileHelp.Rename(basePath, path, oldFileName, newFileName, type), "text/html", JsonRequestBehavior.AllowGet); //原代碼

            //重命名寫入數據
            var jsonData = FileHelp.Rename(basePath, path, oldFileName, newFileName, type);
            string strData = jsonData.ToString();
            //數據庫刪除
            if (strData.Contains("result = ok"))
            {
                string oldFileNameFullPath = "\\" + path + "\\" + oldFileName;
                string newFileNameFullPath = string.Empty;
                if (type == "1")
                {
                    newFileName += fileExt; //非文件夾時加上擴展名.
                }
                newFileNameFullPath = "\\" + path + "\\" + newFileName;
                FileUploadDAL.RenameFolderOrFiles(oldFileNameFullPath, newFileNameFullPath, oldFileName, newFileName, type);
            }
            return Json(jsonData, "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 压缩文件和文件夹
        /// </summary>
        /// <param name="oldFileName"></param>
        /// <param name="newFileName"></param>
        /// <returns></returns>
        public JsonResult Zip(string path, string zipName, string file)
        {
            string basePath = Server.MapPath("~");
            string[] files = file.Split('|');
            //压缩文件
            var resultJson = FileHelp.Zip(basePath, path, zipName, files);
            //return Json(resultJson, "text/html", JsonRequestBehavior.AllowGet);源代碼,注銷于2023/08/21

            //寫入數據庫部分2023/08/21
            string strData = resultJson.ToString();
            if (strData.Contains("result = ok"))
            {
                string currentPath = path;
                string fileName = zipName + ".zip";
                string user_id = this.LoginInfo.LoginName.ToString();//2023/08/17 添加此字段                
                string fileExt = ".zip";
                FileUploadDAL.SaveUploadOrNewFolderInfo(currentPath, fileName, fileExt, user_id, "upload");
            }
            return Json(resultJson, "text/html", JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 上傳文件
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public JsonResult Upload(HttpPostedFileBase file)
        {
            string user_id = this.LoginInfo.LoginName.ToString();
            //上傳文件
            string basePath = Server.MapPath("~");//根地址
            var currentPath = Request["currentPath"];//获取文件保存的相对地址
            //文件保存的绝对位置
            string thePath = string.Format(@"{0}Document\Files\{1}", basePath, currentPath);
            if (file != null)
            {
                string fileName = Path.GetFileName(file.FileName);//文件名
                string fileExt = Path.GetExtension(fileName);//文件扩展名
                if (!Directory.Exists(thePath)) //   创建文件夹
                {
                    Directory.CreateDirectory(thePath);
                }
                string filePathName = thePath + "\\" + fileName; //絕對路徑
                file.SaveAs(filePathName);//保存上傳的文件
                //將相關上傳的文件信息寫入數據庫
                FileUploadDAL.SaveUploadOrNewFolderInfo(currentPath, fileName, fileExt, user_id, "upload");
                var result = Json(new { state = "ok", path = filePathName }, JsonRequestBehavior.DenyGet);
                return result;
            }

            return Json(new { state = "no", path = "null" }, JsonRequestBehavior.DenyGet);
        }

        /// <summary>
        /// 下载选择文件
        /// <param name="path">在Files文件夹下的地址</param>
        /// <param name="file"></param>
        /// </summary>
        public void Download(string path, string file)
        {
            //文件名数组
            string[] files = file.Split('|');
            string basePath = Server.MapPath("~");
            basePath = string.Format(@"{0}Document", basePath);
            path = string.Format(@"{0}\Files\{1}", basePath, path);

            //--start新增代碼2023/08/09因都是對要下載的文件進行壓縮才下載,因客戶端不一定安裝有壓縮軟件,所以不需進行壓縮,一次只限下載一個文件處理.
            string[] fileAry = file.Split('*');
            string fileNameSingle = string.Format(@"{0}\{1}", path, fileAry[0]);
            fileNameSingle = FileHelp.Standard(fileNameSingle);//去掉斜杠,轉換成標準的文件名
            GetDocument(fileNameSingle);
            return;
            //--end 2023/08/09

            /* **以下為舊代碼
            //新文件夹名
            string newFileName = string.Format(@"{0}\Temp\临时文件_{1}", basePath, DateTime.Now.ToString("yyyyMMddhhmmss"));
            //文件个数大于2
            if (files.Count() > 1)
            {
                string fileName = FileHelp.Download(path, files, newFileName);
                GetDocument(fileName, true);
            }
            else
            {
                string[] thepath = files[0].Split('*');
                string fileName = string.Format(@"{0}\{1}", path, thepath[0]);
                //下载文件
                GetDocument(fileName, false);
            }
            */

        }


        /// <summary>
        /// 压缩文件并返回文件
        /// </summary>
        /// <param name="path">绝对路径</param>
        private void GetDocument(string path, bool isDelete)
        {
            string basePath = Server.MapPath("~");
            //原始文件夹地址
            string oldFilePath = FileHelp.Standard(path);
            //压缩文件名
            string zipName = string.Format("下载_{0}", DateTime.Now.ToString("yyyyMMddhhmmss"));
            //新地址
            var filePath = string.Format(@"{0}\Document\Temp\{1}.zip", basePath, zipName).Replace(@"\\", @"\");
            //生成压缩文件
            if (ZIPHelper.Compress(oldFilePath, filePath, true))
            {
                FileStream fs = new FileStream(filePath, FileMode.Open);
                byte[] bytes = new byte[(int)fs.Length];
                fs.Read(bytes, 0, bytes.Length);
                fs.Close();
                //是否删除原文件
                if (isDelete)
                {
                    FileHelp.Delete(path);
                }
                //删除生成的压缩文件
                FileHelp.Delete(filePath);
                Response.ContentType = "application/octet-stream";
                //通知浏览器下载文件而不是打开
                Response.AddHeader("Content-Disposition", "attachment; filename=" + HttpUtility.UrlEncode(filePath, System.Text.Encoding.UTF8));
                Response.BinaryWrite(bytes);
                Response.Flush();
                Response.End();
            }
            else
            {
                Response.ContentType = "application/ text/html";
                Response.Flush();
                Response.End();
                Response.ClearHeaders();
            }
        }

        /// <summary>
        /// 返回單一文件
        /// </summary>
        /// <param name="filePath">绝对文件名稱(包含路徑)</param>
        private void GetDocument(string filePath)
        {
            string fileName = Path.GetFileName(filePath); //忽略路徑,取出實際的文件名
            FileStream fs = new FileStream(filePath, FileMode.Open);
            byte[] bytes = new byte[(int)fs.Length];
            fs.Read(bytes, 0, bytes.Length);
            fs.Close();
            Response.ContentType = "application/octet-stream";
            //通知浏览器下载文件而不是打开            
            Response.AddHeader("Content-Disposition", "attachment; filename=" + HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8));
            Response.BinaryWrite(bytes);
            Response.Flush();
            Response.End();
        }

        public JsonResult IntFiles(string path)
        {
            string user_id = this.LoginInfo.LoginName.ToString();
            string basePath = Server.MapPath("~");
            //得到文件夹路径          
            return Json(FileHelp.IntFiles(basePath, path, user_id), "text/html", JsonRequestBehavior.AllowGet);
        }
    }
}