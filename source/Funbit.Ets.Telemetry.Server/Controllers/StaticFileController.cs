using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Funbit.Ets.Telemetry.Server.Controllers
{
    public class StaticFileController : ApiController
    {
        const string BaseDirectory = "Html";

        [HttpGet]
        public HttpResponseMessage ServeStaticFile(string path = null)
        {
            if (string.IsNullOrEmpty(path) || path.EndsWith("/"))
                path = "index.html";

            if (path.Contains(".."))
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Pagina no encontrada");

            string ext = Path.GetExtension(path).ToLower();
            string ct = "application/octet-stream";

            if (ext == ".htm" || ext == ".html") ct = "text/html";
            else if (ext == ".css") ct = "text/css";
            else if (ext == ".js") ct = "application/javascript";
            else if (ext == ".json" || ext == ".geojson") ct = "application/json";
            else if (ext == ".png") ct = "image/png";
            else if (ext == ".jpg" || ext == ".jpeg") ct = "image/jpeg";
            else if (ext == ".gif") ct = "image/gif";
            else if (ext == ".svg") ct = "image/svg+xml";

            try
            {
                string fullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, BaseDirectory, path);

                if (!File.Exists(fullPath))
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Archivo no encontrado");

                var resp = Request.CreateResponse(HttpStatusCode.OK);
                var fi = new FileInfo(fullPath);

                if (fi.Length > 1048576)
                    resp.Content = new StreamContent(File.Open(fullPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite), 65536);
                else
                    resp.Content = new ByteArrayContent(File.ReadAllBytes(fullPath));

                resp.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(ct);

                if (path.Contains("index.html"))
                    resp.Headers.CacheControl = new CacheControlHeaderValue { NoCache = true };
                else
                    resp.Headers.CacheControl = new CacheControlHeaderValue { Public = true, MaxAge = TimeSpan.FromHours(24) };

                return resp;
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error: " + ex.Message);
            }
        }
    }
}