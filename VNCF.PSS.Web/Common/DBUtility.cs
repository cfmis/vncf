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
        public static string within_code = "0000";
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
        public static string GetDetaultUserID()
        {
            string LoginName = "";
            try
            {
                LoginName = AdminUserContext.Current.LoginInfo.LoginName;
            }
            catch
            {
                LoginName = "admin";
            }
            return LoginName;
        }
        public static string ConvertDateFormat(DateTime OrgDateTime)
        {
            string result = OrgDateTime.ToString("yyyy-MM-dd");
            
            return result;
        }
        public static string ConvertDateTimeFormat(DateTime OrgDateTime)
        {
            string result = OrgDateTime.ToString("yyyy-MM-dd hh:MM:ss");

            return result;
        }
    }
}