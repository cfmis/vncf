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
    public class ListDataModels
    {
        public string value { get; set; }
        public string label { get; set; }
    }
}