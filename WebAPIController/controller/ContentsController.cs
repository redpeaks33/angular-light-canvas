using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Net.Http;

namespace WebAPIController.controller
{
    public class ContentsController : ApiController 
    {
        public string GetContents(int id)
        {
            return "Value form Server Controller";
        }
        
        public void PutContents(object data)
        {
            Console.WriteLine(data);
        }   
    }
}
