# GPS MapKalo - American Truck Simulator Telemetry Server + GPS Mapping

Telemetry server for **American Truck Simulator** with advanced GPS mapping integration.

**By DevZeros S.A.S in partnership with JhonDazaCardenas**

## Main Features

- Open source and free (GPL-3)
- Automated installation
- REST API for telemetry data
- HTML5 dashboard for real-time data streaming (WebSockets)
- GPS integration for real-time location tracking
- Dedicated GPS MapKalo Android app

## GPS MapKalo Features

- Real-time tracking of your assigned route
- On-screen display: Origin-Destination, Cargo type, Cargo weight
- On-screen parameters: Speed, Fuel tank, Time remaining, KM remaining, ETA
- Internal map browser (magnifier icon) to search locations
- Automatic Light/Dark mode based on system time with manual toggle
- Toggle visibility of companies on the map
- Map services: Rest areas, Gas stations, Tolls
- Beta voice assistant (in development)
- Free Mode: View any map point
- On-screen driving speed display
- Speed limit indicator
- Full screen option for mobile devices
- Ideal for second screens and mobile devices
- Built-in QR code for quick app connection

## System Requirements

### Supported OS

- Windows 10, 11 (32-bit or 64-bit)
- Linux Debian, Ubuntu and derivatives
- .NET Framework 4.5+

### Supported Games

- **American Truck Simulator** (only)
- Version 1.40+

### Tested Browsers

- **Opera** (recommended)
- **Brave** (recommended)
- Firefox, Chrome, Edge

## Installation

### Windows

1. Extract the ZIP anywhere
2. Run **server/GPSMapKalo.exe**
3. Click **"Install"**
4. Click **"OK"**, select network interface
5. **Done**

### Linux (Debian/Ubuntu)

1. Extract ZIP
2. Run: `mono server/GPSMapKalo.exe`

### Android Users

Install **mobile/Android/GPS MapKalo.apk**. Copy to device and install via File Manager. App prevents sleep mode and remembers server IP. You can also scan the QR code shown by the server.

## Usage

1. Run **server/GPSMapKalo.exe** (or server on Linux)
2. Run **American Truck Simulator**
3. **Desktop users**: Connect to same Wi-Fi/LAN, open browser and navigate to "*HTML5 App URL*"
4. **Mobile users**: Use GPS MapKalo app, enter server IP or scan QR code
5. **Enjoy** your GPS dashboard!

## REST API

    GET http://localhost:25555/api/ats/telemetry

Returns JSON with latest telemetry data.

**Full reference in [Telemetry.md](Telemetry.md).**

## HTML5 Dashboard

    http://localhost:25555/

Works in any modern browser.

## Donations

Support the project! GPS MapKalo is **free**. If it helps you, consider supporting development.

### Donation Options

| Method | Logo |
|--------|-------|
| 🏦 Bre-B | <img width="24" height="24" src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bre-B-logo.png" alt="breb"/> |
| 💳 PayPal | <img width="24" height="24" src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="paypal"/> |

Scan the QR code with your payment app.

## Follow Us

| Platform | Link |
|------------|--------|
| 🔴 Twitch | [jhondazac](https://www.twitch.tv/jhondazac) |
| 📺 YouTube | [JhonDazaAmbienteGIS](https://www.youtube.com/@JhonDazaAmbienteGIS) |
| 🎵 TikTok | [@jhon.dazacardenas](https://www.tiktok.com/@jhon.dazacardenas) |
| 💬 Discord | [Join server](https://discord.gg/wgt2RjfzH8) |
| 🐙 GitHub | [JhonDazaCardenas](https://github.com/JhonDazaCardenas) |

**Made with ❤️ by JhonDazaCardenas in partnership with [DevZeros S.A.S](https://devzeros.com/)**

## Preview

![Dashboard GPS](https://imgur.com/a/OWleCzK)
![Map](https://imgur.com/a/hXfa2rf)
![Navigation](https://imgur.com/a/N5244A9)
![Route](https://imgur.com/a/27lVTgu)
![Panel](https://imgur.com/a/338ydDm)

## Screen Capture

![Entry](https://imgur.com/a/i8519S5)

## Distribution

This package contains compiled server binaries, HTML5 dashboard, and GPS MapKalo Android APK. Source code not included.

## Version

**GPS MapKalo 2026**
- Based on: ETS2 Telemetry Web Server 3.2.5
- Adapted for American Truck Simulator only
- Added GPS mapping features
- Rebranded to GPS MapKalo with GPS integration
- Compiled distribution (no source code)

## Credits and References

- **Map (MapKalo mod):** [ETS2LA/maps](https://github.com/ETS2LA/maps/)
- **Original idea:** [Funbit/ets2-telemetry-server](https://github.com/Funbit/ets2-telemetry-server)
- **Inspiration:** [TruckSim-GPS/trucksim-gps-server](https://github.com/TruckSim-GPS/trucksim-gps-server)

## License

[GNU General Public License v3 (GPL-3)](https://tldrlegal.com/license/gnu-general-public-license-v3-%28gpl-3%29)