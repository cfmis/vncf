using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using VNCF.PSS.Web.Areas.Base.DAL;
using System.Text;
using CF.Framework.Utility;
using System.IO;

namespace VNCF.PSS.Web.Areas.Base.ASHX
{
    /// <summary>
    /// Summary description for ShowArtwork
    /// </summary>
    public class ShowArtwork : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {

            string parameter = context.Request.QueryString["file"];

            FileStream fs = new FileStream(parameter, FileMode.Open, FileAccess.Read);
            BinaryReader br = new BinaryReader(fs);
            Byte[] bytes = br.ReadBytes((Int32)fs.Length);
            br.Close();
            fs.Close();
            context.Response.OutputStream.Write(bytes, 0, bytes.Length);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}