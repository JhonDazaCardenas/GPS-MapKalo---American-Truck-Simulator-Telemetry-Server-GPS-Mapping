using System;
using System.Diagnostics;
using System.Security.Principal;
using System.Windows.Forms;

namespace Funbit.Ets.Telemetry.Server
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            // Verificar si es Administrador
            if (!IsAdministrator())
            {
                var psi = new ProcessStartInfo
                {
                    FileName = Application.ExecutablePath,
                    UseShellExecute = true,
                    Verb = "runas"
                };
                try { Process.Start(psi); }
                catch { MessageBox.Show("Se requieren permisos de Administrador.", "GPS MapKalo"); }
                return;
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }

        private static bool IsAdministrator()
        {
            using (var identity = WindowsIdentity.GetCurrent())
            {
                var principal = new WindowsPrincipal(identity);
                return principal.IsInRole(WindowsBuiltInRole.Administrator);
            }
        }
    }
}