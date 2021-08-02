using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNCF.PSS.Web.Common
{
    public class DBUtility
    {
        public static string ArtImagePath = "/art/artwork/";
        public static string dgerp2 = "dgerp2.cferp.dbo.";

        public static string GetDetaultLang()
        {
            string LanguageID = "0";
            try
            {
                LanguageID = AdminUserContext.Current.LoginInfo.LanguageID;
            }
            catch
            {
                LanguageID = "0";
            }
            return LanguageID;
        }
    }
}