using System;
using System.Net.Http.Formatting;
using System.Web.Http;
using Funbit.Ets.Telemetry.Server.Helpers;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Owin;

namespace Funbit.Ets.Telemetry.Server
{
    public class Startup
    {
        public void Configuration(IAppBuilder appBuilder)
        {
            HttpConfiguration config = new HttpConfiguration();

            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter());
            config.Formatters
                  .JsonFormatter
                  .SerializerSettings = JsonHelper.RestSettings;

            // Rutas con atributos (para /api/ets2/telemetry)
            config.MapHttpAttributeRoutes();

            // Ruta por defecto para archivos estáticos (DEBE ir DESPUÉS de MapHttpAttributeRoutes)
            config.Routes.MapHttpRoute(
                name: "StaticFiles",
                routeTemplate: "{*path}",
                defaults: new
                {
                    controller = "StaticFile",
                    action = "ServeStaticFile",
                    path = "index.html"
                }
            );

            config.EnsureInitialized();

            // Configurar SignalR SOLO si no se ha configurado antes
            var signalRConfig = GlobalHost.Configuration;
            if (signalRConfig.KeepAlive == null)
            {
                signalRConfig.ConnectionTimeout = TimeSpan.FromSeconds(12);
                signalRConfig.DisconnectTimeout = TimeSpan.FromSeconds(9);
                signalRConfig.KeepAlive = TimeSpan.FromSeconds(3);
            }
            appBuilder.MapSignalR();

            appBuilder.UseWebApi(config);
            appBuilder.UseCors(CorsOptions.AllowAll);
        }
    }
}