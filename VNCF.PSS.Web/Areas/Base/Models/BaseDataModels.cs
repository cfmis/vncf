using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VNCF.PSS.Web.Areas.Base.Models
{
    public class BaseDataModels
    {
        public string ID { get; set; }
        public string Name { get; set; }
    }
    public class UpdateStatusModels
    {
        public string Status { get; set; }
        public string Msg { get; set; }
        public string ReturnValue { get; set; }
    }

    public class PermissonModels
    {
        public string PermissionID { get; set; }
        public bool isPermission { get; set; }
    }

    public class RoleAuthorityPowersModels
    {
        public int ID { get; set; }
        public int RoleID { get; set; }
        public int AuthorityID { get; set; }
        public int PowersID { get; set; }
        public string Remark { get; set; }
        public string CreateBy { get; set; }
        public string CreateAt { get; set; }
        public string UpdateBy { get; set; }
        public string UpdateAt { get; set; }

        public string RoleName { get; set; }
        public string AuthorityName { get; set; }
        public string Powers { get; set; }
        public string PowersDesc { get; set; }
    }

    public class ListDataModels
    {
        public string value { get; set; }
        public string label { get; set; }

    }
}