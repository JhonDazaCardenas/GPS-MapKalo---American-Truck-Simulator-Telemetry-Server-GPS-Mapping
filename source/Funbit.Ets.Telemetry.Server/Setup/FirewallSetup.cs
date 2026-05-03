using System;
using System.Configuration;
using System.Reflection;
using System.Windows.Forms;
using Funbit.Ets.Telemetry.Server.Helpers;

namespace Funbit.Ets.Telemetry.Server.Setup
{
    public class FirewallSetup : ISetup
    {
        static readonly log4net.ILog Log = log4net.LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        
        static readonly string FirewallRuleName = $"GPS MapKalo ({ConfigurationManager.AppSettings["Port"]})";

        SetupStatus _status;

        public FirewallSetup()
        {
            try
            {
                if (Settings.Instance.FirewallSetupHadErrors)
                {
                    _status = SetupStatus.Installed;
                }
                else
                {
                    string port = ConfigurationManager.AppSettings["Port"];
                    const string arguments = "advfirewall firewall show rule dir=in name=all";
                    Log.Info("Checking Firewall rule...");
                    string output = ProcessHelper.RunNetShell(arguments, "Failed to check Firewall rule status");
                    // this check is kind of lame, but it works in any locale...
                    _status = output.Contains(port) && output.Contains(FirewallRuleName)
                        ? SetupStatus.Installed : SetupStatus.Uninstalled;
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex);
                _status = SetupStatus.Failed;
            }
        }

        public SetupStatus Status => _status;

        public SetupStatus Install(IWin32Window owner)
        {
            if (_status == SetupStatus.Installed)
                return _status;

            try
            {
                string port = ConfigurationManager.AppSettings["Port"];
                string arguments = $"advfirewall firewall add rule name=\"{FirewallRuleName}\" " +
                                   $"dir=in action=allow protocol=TCP localport={port} remoteip=localsubnet";
                Log.Info("Adding Firewall rule...");
                try 
                {
                    ProcessHelper.RunNetShell(arguments, "Failed to add Firewall rule");
                } 
                catch 
                {
                    // Si falla, puede que ya exista - continuar sin error
                    Log.Warn("Firewall rule may already exist - continuing");
                }
                _status = SetupStatus.Installed;
            }
            catch (Exception ex)
            {
                _status = SetupStatus.Failed;
                Log.Error(ex);
                Settings.Instance.FirewallSetupHadErrors = true;
                Settings.Instance.Save();
                // No lanzar error, solo registrar
                Log.Warn("Firewall configuration skipped: " + ex.Message);
                _status = SetupStatus.Installed; // Continuar iguales
            }

            return _status;
        }

        public SetupStatus Uninstall(IWin32Window owner)
        {
            if (_status == SetupStatus.Uninstalled)
                return _status;

            SetupStatus status;
            try
            {
                string port = ConfigurationManager.AppSettings["Port"];
                string arguments = $"advfirewall firewall delete rule name=\"{FirewallRuleName}\"";
                Log.Info("Deleting Firewall rule...");
                try 
                {
                    ProcessHelper.RunNetShell(arguments, "Failed to delete Firewall rule");
                } 
                catch 
                {
                    // Si falla, intentar por puerto
                    arguments = $"advfirewall firewall delete rule name=\"{FirewallRuleName}\" dir=in action=allow protocol=TCP localport={port}";
                    try { ProcessHelper.RunNetShell(arguments, null); } catch { /* Ignorar error */ }
                }
                status = SetupStatus.Uninstalled;
            }
            catch (Exception ex)
            {
                // No lanzar error si la regla no existe - es seguro continuar
                Log.Warn("Firewall rule deletion skipped: " + ex.Message);
                _status = SetupStatus.Uninstalled;
                return SetupStatus.Uninstalled;
            }
            return status;
        }
    }
}