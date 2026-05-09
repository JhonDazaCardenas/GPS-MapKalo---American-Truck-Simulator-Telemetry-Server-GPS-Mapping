# GPS MapKalo - American Truck Simulator Telemetry Server + GPS Mapping

Telemetry server for American Truck Simulator with advanced GPS mapping integration for the MapKalo Colombia map.

================================================================================
FOLDER STRUCTURE
================================================================================

|-----------| contains the GPS MapKalo Android app with GPS mapping
|  mobile   |
|-----------| (GPS MapKalo.apk = installation)
|-----------|
|  server   | contains compiled server and HTML5 dashboard
|-----------|

Note: This is a compiled distribution. Source code is not included.

Simply run "server/GPSMapKalo.exe" to start the server and connect your HTML5 mobile dashboard or GPS MapKalo Android app!

================================================================================
SYSTEM REQUIREMENTS
================================================================================

- Windows 10, 11 (32-bit or 64-bit)
- Linux Debian, Ubuntu and derivatives
- .NET Framework 4.5+

Supported game:
- American Truck Simulator with MapKalo (only)
- Version 1.58+

Tested browsers:
- Opera (recommended)
- Brave (recommended)
- Firefox, Chrome, Edge

================================================================================
INSTALLATION
================================================================================

Windows:
1. Extract ZIP anywhere
2. Run server/GPSMapKalo.exe as admin
3. Click "Install"
4. When done, click "OK", select open Mapkalo
5. Done

Linux (Debian/Ubuntu):
1. Extract ZIP
2. Run: mono server/GPSMapKalo.exe

Android:
1. Install mobile/Android/GPS MapKalo.apk
2. Enter server IP (without http:// and port)
3. Or scan the QR code shown by the server

================================================================================
USAGE
================================================================================

1. Run server/GPSMapKalo.exe (or server on Linux)
2. Run American Truck Simulator
3. Desktop users: Connect to same Wi-Fi/LAN, open browser and navigate to "HTML5 App URL"
4. Mobile users: Use GPS MapKalo app, enter server IP or scan QR code
5. Enjoy your GPS dashboard!

================================================================================
REST API
================================================================================

GET http://localhost:25555/api/ats/telemetry

Returns JSON with latest telemetry data.

Full reference in Telemetry.md.

================================================================================
HTML5 DASHBOARD
================================================================================

http://localhost:25555/

Works in any modern browser.

================================================================================
DONATIONS
================================================================================

Support the project! GPS MapKalo is free. If it helps you, consider supporting development.

- Bre-B (Colombian bank accounts)
- PayPal (international transfers)

Scan the QR code with your payment app or click on the logos in the full README.md.

================================================================================
FOLLOW US
================================================================================

Follow me on social media for updates, new features, and trucking content:

- Twitch: https://www.twitch.tv/jhondazac
- YouTube: https://www.youtube.com/@JhonDazaAmbienteGIS
- TikTok: https://www.tiktok.com/@jhon.dazacardenas
- Discord: https://discord.gg/wgt2RjfzH8
- GitHub: https://github.com/JhonDazaCardenas

Hit that follow button! 🚛💨

================================================================================
PREVIEW
================================================================================

GPS MapKalo Server, Dark mode, Clear mode, Mobile Dark mode, Mobile Clear mode.
See full README.md for images.

================================================================================
VERSION
================================================================================

GPS MapKalo 2026

- Based on: ETS2 Telemetry Web Server 3.2.5
- Adapted for American Truck Simulator only with MapKalo
- Added GPS mapping features
- Rebranded to GPS MapKalo with GPS integration
- Compiled distribution (no source code)

================================================================================
CREDITS AND REFERENCES
================================================================================

Developed by DevZeros S.A.S in partnership with JhonDazaCardenas (2026)

Project references:
- Map (MapKalo mod): https://github.com/ETS2LA/maps/
- Original idea: https://github.com/Funbit/ets2-telemetry-server
- Inspiration: https://github.com/TruckSim-GPS/trucksim-gps-server

================================================================================
LICENSE
================================================================================

GNU General Public License v3 (GPL-3). Read LICENSE file for details.