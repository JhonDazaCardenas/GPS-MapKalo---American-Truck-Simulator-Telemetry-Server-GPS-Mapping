using System;
using System.Diagnostics;
using System.Threading;

namespace Funbit.Ets.Telemetry.Server.Helpers
{
    public static class Ets2ProcessHelper
    {
        static long _lastCheckTime;
        static bool _cachedRunningFlag;

        /// <summary>
        /// Returns last running game name: "ATS" or null if undefined.
        /// </summary>
        public static string LastRunningGameName { get; set; }

        /// <summary>
        /// Checks whether ATS game process is running right now.
        /// </summary>
        public static bool IsEts2Running
        {
            get
            {
                if (DateTime.Now - new DateTime(Interlocked.Read(ref _lastCheckTime)) > TimeSpan.FromSeconds(1))
                {
                    Interlocked.Exchange(ref _lastCheckTime, DateTime.Now.Ticks);
                    var processes = Process.GetProcesses();
                    foreach (Process process in processes)
                    {
                        try
                        {
                            // American Truck Simulator only
                            bool running = process.MainWindowTitle.StartsWith("American Truck Simulator") &&
                                        process.ProcessName == "amtrucks";
                            if (running)
                            {
                                _cachedRunningFlag = true;
                                LastRunningGameName = "ATS";
                                return _cachedRunningFlag;
                            }
                        }
                        catch
                        {
                        }
                    }
                    _cachedRunningFlag = false;
                }
                return _cachedRunningFlag;
            }
        }
    }
}