using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VNCF.Base.Contract
{
    public class BaseDataModel
    {
    }
    public class QtyUnitRate
    {
        public string value { get; set; }
        public string label { get; set; }
        public decimal rate { get; set; }
    }

    public class SelectReport
    {
        public string reportid { get; set; }
        public string reportname { get; set; }
        public string default_print { get; set; }
    }
}
