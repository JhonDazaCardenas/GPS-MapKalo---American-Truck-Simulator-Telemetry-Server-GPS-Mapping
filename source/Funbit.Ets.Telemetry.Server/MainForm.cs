using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Windows.Forms;
using Funbit.Ets.Telemetry.Server.Data;
using Funbit.Ets.Telemetry.Server.Helpers;
using Funbit.Ets.Telemetry.Server.Setup;
using Microsoft.Owin.Hosting;

namespace Funbit.Ets.Telemetry.Server
{
    public partial class MainForm : Form
    {
        private System.Windows.Forms.Timer _statusTimer, _loadingTimer, _glowTimer;
        private Panel _titleBar;
        private Label _titleLabel, _serverStatusLabel;
        private Button _closeBtn, _minimizeBtn;
        private bool _dragging, _loading;
        private Point _dragStart;
        private int _loadingDots;
        private float _glowPhase;

        private Label _statusGame;
        private ComboBox _networkCombo;
        private PictureBox _qrBox;
        private RoundedButton _openMapBtn, _installBtn, _uninstallBtn, _toggleServerBtn;
        private TextBox _urlTextBox;
        private IDisposable _webServer;
        private NotifyIcon _notifyIcon;

        private readonly Color bgDark = Color.FromArgb(8, 10, 16);
        private readonly Color bgPanel = Color.FromArgb(14, 17, 26);
        private readonly Color neonBlue = Color.FromArgb(0, 230, 255);
        private readonly Color neonGreen = Color.FromArgb(0, 255, 150);
        private readonly Color neonYellow = Color.FromArgb(255, 220, 20);
        private readonly Color neonRed = Color.FromArgb(255, 70, 85);
        private readonly Color textBright = Color.FromArgb(248, 250, 255);
        private readonly Color textSoft = Color.FromArgb(180, 188, 205);
        private readonly Color textDim = Color.FromArgb(105, 114, 135);

        public MainForm()
        {
            this.SetStyle(ControlStyles.OptimizedDoubleBuffer | ControlStyles.AllPaintingInWmPaint | ControlStyles.ResizeRedraw | ControlStyles.UserPaint, true);
            this.DoubleBuffered = true;
            _loading = true;

            InitializeUI();
            InitializeNotifyIcon();
            InitializeTimer();
            RefreshNetworkInterfaces();
            StartWebServer();
            UpdateToggleButton();
            GenerateQR();
            StartLoadingAnimation();
            StartGlowAnimation();
        }

        private void InitializeNotifyIcon()
        {
            _notifyIcon = new NotifyIcon
            {
                Text = "GPS MapKalo - Servidor ejecutándose",
                Visible = false
            };
            string icoPath2 = System.IO.Path.Combine(Application.StartupPath, "Resources", "app.ico");
            if (!System.IO.File.Exists(icoPath2)) icoPath2 = System.IO.Path.Combine(Application.StartupPath, "app.ico");
            if (System.IO.File.Exists(icoPath2)) _notifyIcon.Icon = new Icon(icoPath2);
            _notifyIcon.DoubleClick += (s, e) =>
            {
                this.Show();
                this.WindowState = FormWindowState.Normal;
                _notifyIcon.Visible = false;
            };
        }

        private void StartLoadingAnimation()
        {
            _loadingDots = 0;
            _loadingTimer = new System.Windows.Forms.Timer { Interval = 350 };
            _loadingTimer.Tick += (s, e) =>
            {
                if (!_loading) { _loadingTimer.Stop(); return; }
                _loadingDots = (_loadingDots + 1) % 4;
                _serverStatusLabel.Text = $"INICIANDO{new string('.', _loadingDots)}";
            };
            _loadingTimer.Start();
        }

        private void StartGlowAnimation()
        {
            _glowTimer = new System.Windows.Forms.Timer { Interval = 50 };
            _glowTimer.Tick += (s, e) =>
            {
                _glowPhase += 0.04f;
                if (_glowPhase > Math.PI * 2) _glowPhase = 0;
                this.Invalidate(false);
            };
            _glowTimer.Start();
        }

        private void InitializeUI()
        {
            this.Text = "GPS MapKalo";
            this.Size = new Size(520, 800);
            this.FormBorderStyle = FormBorderStyle.None;
            this.ShowInTaskbar = true;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = bgDark;
            string icoPath = System.IO.Path.Combine(Application.StartupPath, "Resources", "app.ico");
            if (!System.IO.File.Exists(icoPath)) icoPath = System.IO.Path.Combine(Application.StartupPath, "app.ico");
            if (System.IO.File.Exists(icoPath)) this.Icon = new Icon(icoPath);
            this.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
            this.Region = new Region(RoundedRect(new Rectangle(0, 0, this.Width, this.Height), 24));
            this.Paint += (s, e) =>
            {
                e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                float glow = (float)(Math.Sin(_glowPhase) * 0.5 + 0.5);
                using (var pen = new Pen(Color.FromArgb((int)(45 + 35 * glow), neonBlue), 2f))
                    e.Graphics.DrawPath(pen, RoundedRect(new Rectangle(0, 0, this.Width - 1, this.Height - 1), 24));
            };

            var mainContainer = new Panel
            {
                Width = 464,
                Height = 740,
                Location = new Point(28, 28),
                BackColor = Color.Transparent
            };

            int yPos = 0;

            // ===== BARRA DE TÍTULO =====
            _titleBar = new Panel
            {
                Width = 464,
                Height = 50,
                Location = new Point(0, yPos),
                BackColor = Color.Transparent,
                Cursor = Cursors.SizeAll
            };

            // GPS MAPKALO CENTRADO
            _titleLabel = new Label
            {
                Text = "GPS MAPKALO",
                Font = new Font("Segoe UI", 15F, FontStyle.Bold),
                ForeColor = neonBlue,
                TextAlign = ContentAlignment.MiddleCenter,
                AutoSize = false,
                Width = 200,
                Location = new Point(132, 0)
            };

            // Estado del servidor centrado
            _serverStatusLabel = new Label
            {
                Text = "INICIANDO...",
                Font = new Font("Segoe UI", 8F, FontStyle.Bold),
                ForeColor = neonYellow,
                TextAlign = ContentAlignment.MiddleCenter,
                AutoSize = false,
                Width = 200,
                Location = new Point(132, 30),
                BackColor = Color.Transparent
            };

            // Botón minimizar (círculo neon amarillo) - hover más brillante
            _minimizeBtn = new CircleButton("─", Color.FromArgb(200, 200, 100), Color.FromArgb(255, 255, 100), 26, new Point(404, 6));
            _minimizeBtn.Click += (s, e) =>
            {
                this.Hide();
                _notifyIcon.Visible = true;
            };

            // Botón cerrar (círculo neon rojo) - hover más brillante
            _closeBtn = new CircleButton("✕", Color.FromArgb(200, 80, 80), Color.FromArgb(255, 100, 100), 26, new Point(434, 6));
            _closeBtn.Click += (s, e) =>
            {
                _notifyIcon?.Dispose();
                Application.Exit();
            };

            _titleBar.Controls.Add(_titleLabel);
            _titleBar.Controls.Add(_serverStatusLabel);
            _titleBar.Controls.Add(_minimizeBtn);
            _titleBar.Controls.Add(_closeBtn);
            _titleBar.MouseDown += (s, e) => { _dragging = true; _dragStart = e.Location; };
            _titleBar.MouseMove += (s, e) => { if (_dragging) this.Location = new Point(this.Location.X + e.X - _dragStart.X, this.Location.Y + e.Y - _dragStart.Y); };
            _titleBar.MouseUp += (s, e) => _dragging = false;

            yPos += 70;

            // ===== ESTADO ATS =====
            var statusPanel = CreatePanel(0, yPos, 464, 44);
            _statusGame = new Label
            {
                Text = "ATS no detectado",
                Font = new Font("Segoe UI", 10F, FontStyle.Bold),
                ForeColor = textSoft,
                Location = new Point(16, 10),
                AutoSize = true
            };
            statusPanel.Controls.Add(_statusGame);
            yPos += 60;

            // ===== RED =====
            var netPanel = CreatePanel(0, yPos, 464, 44);
            _networkCombo = new ComboBox
            {
                Width = 430,
                Height = 20,
                Location = new Point(16, 11),
                Font = new Font("Segoe UI", 9F),
                BackColor = bgDark,
                ForeColor = neonBlue,
                FlatStyle = FlatStyle.Flat,
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            _networkCombo.SelectedIndexChanged += (s, e) => GenerateQR();
            netPanel.Controls.Add(_networkCombo);
            yPos += 60;

            // ===== QR =====
            var qrPanel = CreatePanel(0, yPos, 464, 395);
            string basePath = System.IO.Path.Combine(System.Windows.Forms.Application.StartupPath, "icons");

            _qrBox = new PictureBox
            {
                Width = 200,
                Height = 200,
                Location = new Point(132, 30),
                BackColor = Color.White,
                SizeMode = PictureBoxSizeMode.CenterImage
            };
            _qrBox.Paint += QrBoxPaint;

            _openMapBtn = new RoundedButton("ABRIR GPS MAPKALO", neonBlue, 280, 46, new Point(92, 256));
            _openMapBtn.Click += (s, e) => Process.Start(_urlTextBox?.Text ?? "http://localhost:25555/");

            qrPanel.Controls.Add(_qrBox);
            qrPanel.Controls.Add(_openMapBtn);

            // ===== REDES SOCIALES =====
            var socialPanel = new Panel
            {
                Width = 280,
                Height = 44,
                Location = new Point(92, 308),
                BackColor = Color.Transparent
            };

            int btnSize = 32;
            int spacing = 10;
            int socialStartX = (280 - (btnSize * 5 + spacing * 4)) / 2;

            // GitHub
            var githubBtn = new CircleButton("GH", Color.FromArgb(200, 200, 200), Color.FromArgb(255, 255, 255), btnSize, new Point(socialStartX, 6));
            try { githubBtn.ButtonImage = Image.FromFile(System.IO.Path.Combine(basePath, "github.png")); githubBtn.Text = ""; }
            catch { }
            githubBtn.Click += (s, e) => Process.Start("https://github.com/JhonDazaCardenas");

            // YouTube
            var youtubeBtn = new CircleButton("YT", Color.FromArgb(255, 50, 50), Color.FromArgb(255, 100, 100), btnSize, new Point(socialStartX + (btnSize + spacing) * 1, 6));
            try { youtubeBtn.ButtonImage = Image.FromFile(System.IO.Path.Combine(basePath, "youtube.png")); youtubeBtn.Text = ""; }
            catch { }
            youtubeBtn.Click += (s, e) => Process.Start("https://www.youtube.com/@JhonDazaAmbienteGIS");

            // TikTok
            var tiktokBtn = new CircleButton("TT", Color.FromArgb(0, 230, 255), Color.FromArgb(255, 0, 128), btnSize, new Point(socialStartX + (btnSize + spacing) * 2, 6));
            try { tiktokBtn.ButtonImage = Image.FromFile(System.IO.Path.Combine(basePath, "tiktok.png")); tiktokBtn.Text = ""; }
            catch { }
            tiktokBtn.Click += (s, e) => Process.Start("https://www.tiktok.com/@jhon.dazacardenas");

            // Twitch
            var twitchBtn = new CircleButton("TW", Color.FromArgb(145, 70, 255), Color.FromArgb(200, 130, 255), btnSize, new Point(socialStartX + (btnSize + spacing) * 3, 6));
            try { twitchBtn.ButtonImage = Image.FromFile(System.IO.Path.Combine(basePath, "twitch.png")); twitchBtn.Text = ""; }
            catch { }
            twitchBtn.Click += (s, e) => Process.Start("https://www.twitch.tv/jhondazac");

            // Discord
            var discordBtn = new CircleButton("D", Color.FromArgb(88, 101, 242), Color.FromArgb(140, 150, 255), btnSize, new Point(socialStartX + (btnSize + spacing) * 4, 6));
            try { discordBtn.ButtonImage = Image.FromFile(System.IO.Path.Combine(basePath, "discord.png")); discordBtn.Text = ""; }
            catch { }
            discordBtn.Click += (s, e) => Process.Start("https://discord.gg/wgt2RjfzH8");

            socialPanel.Controls.Add(githubBtn);
            socialPanel.Controls.Add(youtubeBtn);
            socialPanel.Controls.Add(tiktokBtn);
            socialPanel.Controls.Add(twitchBtn);
            socialPanel.Controls.Add(discordBtn);
            qrPanel.Controls.Add(socialPanel);

            // Logo DevZeros
            var logoBox = new PictureBox
            {
                Width = 140,
                Height = 32,
                Location = new Point((464 - 140) / 2, 358),
                BackColor = Color.Transparent,
                SizeMode = PictureBoxSizeMode.Zoom,
                Cursor = Cursors.Hand
            };
            string logoPath = System.IO.Path.Combine(basePath, "logo-devzeros.png");
            if (!System.IO.File.Exists(logoPath))
                logoPath = System.IO.Path.Combine(System.Windows.Forms.Application.StartupPath, "logo-devzeros.png");
            if (System.IO.File.Exists(logoPath))
                logoBox.Image = Image.FromFile(logoPath);
            else
            {
                logoBox.Text = "DevZeros S.A.S";
                logoBox.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
                logoBox.ForeColor = textDim;
            }
            logoBox.Click += (s, e) => Process.Start("https://devzeros.com/");
            qrPanel.Controls.Add(logoBox);

            yPos += 410;

            // ===== BOTONES =====
            _installBtn = new RoundedButton("INSTALAR PLUGIN", neonBlue, 226, 46, new Point(0, yPos));
            _installBtn.Click += (s, e) => InstallPlugin();

            _uninstallBtn = new RoundedButton("DESINSTALAR", neonRed, 226, 46, new Point(238, yPos));
            _uninstallBtn.Click += (s, e) => UninstallPlugin();
            yPos += 62;

            _toggleServerBtn = new RoundedButton("ENCENDER SERVIDOR", Color.FromArgb(255, 150, 50), 464, 46, new Point(0, yPos));
            _toggleServerBtn.Click += ToggleServer;
            yPos += 56;

            // Footer
            var footerLabel = new Label
            {
                Text = "Desarrollado con ❤️ por JhonDazaCardenas en unión con DevZeros S.A.S • v1.0",
                Font = new Font("Segoe UI", 8F),
                ForeColor = textDim,
                TextAlign = ContentAlignment.MiddleCenter,
                AutoSize = false,
                Width = 464,
                Height = 20,
                Location = new Point(0, yPos)
            };

            _urlTextBox = new TextBox { Visible = false };

            mainContainer.Controls.Add(_toggleServerBtn);
            mainContainer.Controls.Add(footerLabel);
            mainContainer.Controls.Add(_installBtn);
            mainContainer.Controls.Add(_uninstallBtn);
            mainContainer.Controls.Add(qrPanel);
            mainContainer.Controls.Add(netPanel);
            mainContainer.Controls.Add(statusPanel);
            mainContainer.Controls.Add(_titleBar);
            this.Controls.Add(mainContainer);
        }

        // Efecto neon en el QR + icono central
        private void QrBoxPaint(object s, PaintEventArgs e)
        {
            var box = (PictureBox)s;
            e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;

            // Efecto glow externo (neón)
            float glow = (float)(Math.Sin(_glowPhase) * 0.5 + 0.5);
            for (int i = 0; i < 4; i++)
            {
                using (var pen = new Pen(Color.FromArgb((int)((40 - i * 10) * glow), neonBlue), 1f))
                    e.Graphics.DrawRectangle(pen, -i, -i, box.Width + i * 2 - 1, box.Height + i * 2 - 1);
            }

            // Borde principal
            using (var pen = new Pen(neonBlue, 2f))
                e.Graphics.DrawRectangle(pen, 0, 0, box.Width - 1, box.Height - 1);

            // Icono en el centro del QR
            string iconPath = System.IO.Path.Combine(Application.StartupPath, "icons", "app-icon.png");
            if (!System.IO.File.Exists(iconPath))
                iconPath = System.IO.Path.Combine(Application.StartupPath, "app.ico");
            try
            {
                Image iconImg;
                if (iconPath.EndsWith(".ico"))
                {
                    using (var ico = new Icon(iconPath, 40, 40))
                        iconImg = ico.ToBitmap();
                }
                else
                    iconImg = Image.FromFile(iconPath);
                
                int iconSize = 40;
                int x = (box.Width - iconSize) / 2;
                int y = (box.Height - iconSize) / 2;
                e.Graphics.DrawImage(iconImg, x, y, iconSize, iconSize);
                if (iconPath.EndsWith(".ico")) iconImg.Dispose();
            }
            catch { }
        }

        private Panel CreatePanel(int x, int y, int w, int h)
        {
            var p = new Panel { Width = w, Height = h, Location = new Point(x, y), BackColor = bgPanel };
            p.Paint += (s, e) =>
            {
                e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
                float glow = (float)(Math.Sin(_glowPhase + y * 0.015) * 0.35 + 0.65);
                using (var pen = new Pen(Color.FromArgb((int)(55 * glow), neonBlue), 1f))
                    e.Graphics.DrawPath(pen, RoundedRect(new Rectangle(0, 0, w - 1, h - 1), 10));
            };
            return p;
        }

        private GraphicsPath RoundedRect(Rectangle r, int radius)
        {
            var p = new GraphicsPath();
            p.AddArc(r.X, r.Y, radius * 2, radius * 2, 180, 90);
            p.AddArc(r.Width - radius * 2, r.Y, radius * 2, radius * 2, 270, 90);
            p.AddArc(r.Width - radius * 2, r.Height - radius * 2, radius * 2, radius * 2, 0, 90);
            p.AddArc(r.X, r.Height - radius * 2, radius * 2, radius * 2, 90, 90);
            p.CloseFigure();
            return p;
        }

        private void GenerateQR()
        {
            try
            {
                string url = "http://localhost:25555/";
                if (_networkCombo.SelectedItem != null)
                {
                    var t = _networkCombo.SelectedItem.ToString();
                    var i = t.LastIndexOf("•");
                    if (i >= 0) url = $"http://{t.Substring(i + 1).Trim()}:25555/";
                }
                _urlTextBox.Text = url;
                string api = $"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={Uri.EscapeDataString(url)}&bgcolor=ffffff&color=0a0a0a&margin=4";
                var req = System.Net.WebRequest.Create(api);
                using (var resp = req.GetResponse())
                using (var stream = resp.GetResponseStream())
                    _qrBox.Image = Image.FromStream(stream);
                _qrBox.Invalidate();
            }
            catch { }
        }

        private void StartWebServer()
        {
            try
            {
                _webServer = WebApp.Start<Startup>("http://+:25555/");
                _loading = false;
                _serverStatusLabel.Text = "● SERVIDOR EJECUTÁNDOSE";
                _serverStatusLabel.ForeColor = neonGreen;
                _statusGame.Text = "Servidor activo";
                _statusGame.ForeColor = neonGreen;
            }
            catch
            {
                _loading = false;
                _serverStatusLabel.Text = "● ERROR AL INICIAR";
                _serverStatusLabel.ForeColor = neonRed;
            }
        }

        private void StopServer()
        {
            if (_webServer != null)
            {
                _webServer.Dispose();
                _webServer = null;
                _serverStatusLabel.Text = "● SERVIDOR DETENIDO";
                _serverStatusLabel.ForeColor = neonRed;
                _statusGame.Text = "Servidor detenido";
                _statusGame.ForeColor = textSoft;
                UpdateToggleButton();
            }
        }

        private async void ToggleServer(object sender, EventArgs e)
        {
            if (_webServer != null)
            {
                StopServer();
                UpdateToggleButton();
            }
            else
            {
                _serverStatusLabel.Text = "INICIANDO...";
                _serverStatusLabel.ForeColor = neonYellow;
                await System.Threading.Tasks.Task.Run(() =>
                {
                    int retries = 5;
                    int delayMs = 1000;
                    for (int i = 0; i < retries; i++)
                    {
                        try
                        {
                            _webServer = WebApp.Start<Startup>("http://+:25555/");
                            this.Invoke((MethodInvoker)delegate
                            {
                                _loading = false;
                                _serverStatusLabel.Text = "● SERVIDOR EJECUTÁNDOSE";
                                _serverStatusLabel.ForeColor = neonGreen;
                                _statusGame.Text = "Servidor activo";
                                _statusGame.ForeColor = neonGreen;
                            });
                            return;
                        }
                        catch (Exception ex)
                        {
                            string errorMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                            if (i == retries - 1)
                            {
                                this.Invoke((MethodInvoker)delegate
                                {
                                    _loading = false;
                                    string shortMsg = errorMsg.Length > 30 ? errorMsg.Substring(0, 30) + "..." : errorMsg;
                                    _serverStatusLabel.Text = "● ERROR: " + shortMsg;
                                    _serverStatusLabel.ForeColor = neonRed;
                                });
                                // Log completo
                                try
                                {
                                    string logPath = System.IO.Path.Combine(
                                        System.IO.Path.GetDirectoryName(Application.ExecutablePath),
                                        "server_error.log");
                                    System.IO.File.AppendAllText(logPath,
                                        $"[{DateTime.Now}] Error reiniciando servidor:\n{ex}\n\n");
                                }
                                catch { }
                                Debug.WriteLine($"Error reiniciando servidor: {ex}");
                            }
                            else
                            {
                                System.Threading.Thread.Sleep(delayMs);
                            }
                        }
                    }
                });
                UpdateToggleButton();
            }
        }

        private void UpdateToggleButton()
        {
            if (_toggleServerBtn == null) return;
            if (_webServer != null)
            {
                var orange = Color.FromArgb(255, 150, 50);
                _toggleServerBtn.UpdateColors(
                    Color.FromArgb(20, orange),
                    orange,
                    Color.FromArgb(50, orange),
                    Color.White
                );
                _toggleServerBtn.Text = "APAGAR SERVIDOR";
            }
            else
            {
                var green = Color.FromArgb(0, 255, 150);
                _toggleServerBtn.UpdateColors(
                    Color.FromArgb(20, green),
                    green,
                    Color.FromArgb(50, green),
                    Color.White
                );
                _toggleServerBtn.Text = "ENCENDER SERVIDOR";
            }
        }

        private void InitializeTimer()
        {
            _statusTimer = new System.Windows.Forms.Timer { Interval = 2000 };
            _statusTimer.Tick += (s, e) =>
            {
                if (_loading) return;
                try
                {
                    var ats = Process.GetProcessesByName("amtrucks");
                    if (ats.Length > 0)
                    {
                        try
                        {
                            var d = Ets2TelemetryDataReader.Instance.Read();
                            _statusGame.Text = d.Game?.Connected == true ? "Conectado a ATS" : "ATS ejecutándose...";
                            _statusGame.ForeColor = d.Game?.Connected == true ? neonGreen : neonYellow;
                        }
                        catch { _statusGame.Text = "ATS ejecutándose..."; _statusGame.ForeColor = neonYellow; }
                    }
                    else { _statusGame.Text = "ATS no detectado"; _statusGame.ForeColor = textSoft; }
                }
                catch { }
            };
            _statusTimer.Start();
        }

        private void RefreshNetworkInterfaces()
        {
            _networkCombo.Items.Clear();
            var ifs = NetworkInterface.GetAllNetworkInterfaces()
                .Where(n => n.OperationalStatus == OperationalStatus.Up && n.NetworkInterfaceType != NetworkInterfaceType.Loopback)
                .Select(n => new { n.Name, IP = n.GetIPProperties().UnicastAddresses.FirstOrDefault(a => a.Address.AddressFamily == AddressFamily.InterNetwork)?.Address.ToString() })
                .Where(n => n.IP != null).ToList();
            foreach (var i in ifs) _networkCombo.Items.Add($"{i.Name}  •  {i.IP}");
            if (_networkCombo.Items.Count > 0) { _networkCombo.SelectedIndex = 0; GenerateQR(); }
        }

        private void InstallPlugin()
        {
            try { foreach (var s in SetupManager.Steps) s.Install(this); MessageBox.Show("Instalado.", "GPS MapKalo"); }
            catch (Exception ex) { MessageBox.Show($"Error: {ex.Message}", "GPS MapKalo"); }
        }

        private void UninstallPlugin()
        {
            if (_webServer != null)
            {
                MessageBox.Show("Detén el servidor primero.", "GPS MapKalo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
            if (MessageBox.Show("¿Desinstalar?", "GPS MapKalo", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) == DialogResult.Yes)
            {
                try { foreach (var s in SetupManager.Steps) s.Uninstall(this); MessageBox.Show("Desinstalado.", "GPS MapKalo"); }
                catch (Exception ex) { MessageBox.Show($"Error: {ex.Message}", "GPS MapKalo"); }
            }
        }
    }

    // Botón con bordes redondeados PERMANENTES
    public class RoundedButton : Button
    {
        private Color _nb, _hb, _nf, _hf, _bc;
        private int _r;

        public RoundedButton(string text, Color c, int w, int h, Point loc)
        {
            this.Text = text;
            this.Width = w; this.Height = h; this.Location = loc;
            _nb = Color.FromArgb(20, c); _hb = Color.FromArgb(50, c);
            _nf = c; _hf = Color.White;
            _bc = Color.FromArgb(70, c); _r = 8;
            this.BackColor = _nb; this.ForeColor = _nf;
            this.FlatStyle = FlatStyle.Flat;
            this.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            this.Cursor = Cursors.Hand;
            this.FlatAppearance.BorderSize = 0;
            this.SetStyle(ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer | ControlStyles.AllPaintingInWmPaint, true);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            e.Graphics.Clear(Color.Transparent);
            e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
            
            var rect = new Rectangle(0, 0, this.Width, this.Height);
            
            // Dibujar sombra suave (opcional)
            using (var shadowPath = RoundedRect(new Rectangle(1, 1, this.Width - 2, this.Height - 2), _r))
            using (var shadowBrush = new SolidBrush(Color.FromArgb(40, 0, 0, 0)))
                e.Graphics.FillPath(shadowBrush, shadowPath);
            
            // Dibujar fondo redondeado principal
            using (var path = RoundedRect(rect, _r))
            using (var brush = new SolidBrush(this.BackColor))
                e.Graphics.FillPath(brush, path);
            
            // Dibujar borde externo redondeado (más grosor)
            using (var path = RoundedRect(rect, _r))
            using (var pen = new Pen(_bc, 2f))
            {
                pen.LineJoin = System.Drawing.Drawing2D.LineJoin.Round;
                e.Graphics.DrawPath(pen, path);
            }
            
            // Borde interno más sutil
            var innerRect = new Rectangle(1, 1, this.Width - 2, this.Height - 2);
            using (var innerPath = RoundedRect(innerRect, _r - 1))
            using (var innerPen = new Pen(Color.FromArgb(100, Color.White), 1f))
            {
                innerPen.LineJoin = System.Drawing.Drawing2D.LineJoin.Round;
                e.Graphics.DrawPath(innerPen, innerPath);
            }
            
            // Dibujar texto con márgenes internos
            var textRect = new Rectangle(5, 5, this.Width - 10, this.Height - 10);
            TextRenderer.DrawText(e.Graphics, this.Text, this.Font, textRect, this.ForeColor,
                TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter | TextFormatFlags.NoPrefix);
        }

        protected override void OnMouseEnter(EventArgs e) { this.BackColor = _hb; this.ForeColor = _hf; base.OnMouseEnter(e); }
        protected override void OnMouseLeave(EventArgs e) { this.BackColor = _nb; this.ForeColor = _nf; base.OnMouseLeave(e); }

        private GraphicsPath RoundedRect(Rectangle r, int rad)
        {
            var p = new GraphicsPath();
            // Top-left arc
            p.AddArc(r.X, r.Y, rad * 2, rad * 2, 180, 90);
            // Top line
            p.AddLine(r.X + rad, r.Y, r.X + r.Width - rad, r.Y);
            // Top-right arc
            p.AddArc(r.X + r.Width - rad * 2, r.Y, rad * 2, rad * 2, 270, 90);
            // Right line
            p.AddLine(r.X + r.Width, r.Y + rad, r.X + r.Width, r.Y + r.Height - rad);
            // Bottom-right arc
            p.AddArc(r.X + r.Width - rad * 2, r.Y + r.Height - rad * 2, rad * 2, rad * 2, 0, 90);
            // Bottom line
            p.AddLine(r.X + r.Width - rad, r.Y + r.Height, r.X + rad, r.Y + r.Height);
            // Bottom-left arc
            p.AddArc(r.X, r.Y + r.Height - rad * 2, rad * 2, rad * 2, 90, 90);
            // Left line
            p.AddLine(r.X, r.Y + r.Height - rad, r.X, r.Y + rad);
            p.CloseFigure();
            return p;
        }

        public void UpdateColors(Color normalBack, Color normalFore, Color hoverBack, Color hoverFore)
        {
            _nb = normalBack;
            _nf = normalFore;
            _hb = hoverBack;
            _hf = hoverFore;
            this.BackColor = _nb;
            this.ForeColor = _nf;
            this.Invalidate();
        }
    }

    // Botón circular con efecto neon
    public class CircleButton : Button
    {
        private Color _normalColor, _hoverColor;
        private Color _bgColor = Color.FromArgb(8, 10, 16);
        private float _glowPhase = 0f;
        private System.Windows.Forms.Timer _glowTimer;
        private Image _buttonImage;

        public Image ButtonImage
        {
            get { return _buttonImage; }
            set { _buttonImage = value; Invalidate(); }
        }

        public CircleButton(string text, Color normalColor, Color hoverColor, int size, Point location)
        {
            this.Text = text;
            this.Width = size;
            this.Height = size;
            this.Location = location;
            this.FlatStyle = FlatStyle.Flat;
            this.FlatAppearance.BorderSize = 0;
            this.Cursor = Cursors.Hand;
            this.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            this.BackColor = Color.Transparent;
            this.ForeColor = normalColor;
            _normalColor = normalColor;
            _hoverColor = hoverColor;
            
            this.SetStyle(ControlStyles.SupportsTransparentBackColor, true);
            this.SetStyle(ControlStyles.UserPaint, true);
            this.SetStyle(ControlStyles.AllPaintingInWmPaint, true);
            this.SetStyle(ControlStyles.Opaque, false);
            this.SetStyle(ControlStyles.DoubleBuffer, true);
            
            this.Resize += (s, e) => this.Invalidate();
            
            _glowTimer = new System.Windows.Forms.Timer { Interval = 50 };
            _glowTimer.Tick += (s, e) =>
            {
                _glowPhase += 0.04f;
                if (_glowPhase > (float)Math.PI * 2) _glowPhase = 0;
                this.Invalidate();
            };
            _glowTimer.Start();
        }

        protected override void WndProc(ref Message m)
        {
            if (m.Msg == 0x0014)
            {
                m.Result = IntPtr.Zero;
                return;
            }
            base.WndProc(ref m);
        }

protected override void OnPaint(PaintEventArgs e)
        {
            e.Graphics.SmoothingMode = SmoothingMode.HighQuality;
            e.Graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            e.Graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
            
            bool isHover = this.ClientRectangle.Contains(this.PointToClient(Control.MousePosition));

            // Fondo solo para botones de texto
            if (_buttonImage == null)
            {
                using (var brush = new SolidBrush(_bgColor))
                    e.Graphics.FillEllipse(brush, 0, 0, this.Width - 1, this.Height - 1);

                Color fillColor = isHover ? Color.FromArgb(80, this.ForeColor) : Color.FromArgb(30, this.ForeColor);
                using (var brush = new SolidBrush(fillColor))
                    e.Graphics.FillEllipse(brush, 1, 1, this.Width - 3, this.Height - 3);

                using (var pen = new Pen(this.ForeColor, isHover ? 2f : 1f))
                    e.Graphics.DrawEllipse(pen, 1, 1, this.Width - 3, this.Height - 3);
            }

            // Imagen
            if (_buttonImage != null)
            {
                e.Graphics.DrawImage(_buttonImage, 0, 0, this.Width, this.Height);
            }
            else
            {
                var sf = new StringFormat
                {
                    Alignment = StringAlignment.Center,
                    LineAlignment = StringAlignment.Center
                };
                e.Graphics.DrawString(this.Text, this.Font, new SolidBrush(this.ForeColor),
                    new RectangleF(0, 0, this.Width, this.Height), sf);
            }
        }

        protected override void OnMouseEnter(EventArgs e)
        {
            this.ForeColor = _hoverColor;
            base.OnMouseEnter(e);
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            this.ForeColor = _normalColor;
            base.OnMouseLeave(e);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _glowTimer?.Stop();
                _glowTimer?.Dispose();
                _glowTimer = null;
            }
            base.Dispose(disposing);
        }
    }
}