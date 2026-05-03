# GPS MapKalo - American Truck Simulator Telemetry Server + GPS Mapping

Telemetry server for **American Truck Simulator** with advanced GPS mapping integration.
<img width="1408" height="768" alt="image" src="https://github.com/user-attachments/assets/bb48635c-da07-4d29-a90f-215b373efe0e" />
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
- Version 1.58+

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
3. **Desktop users**: Connect to same Wi-Fi/LAN, open browser and navigate to "HTML5 App URL"
4. **Mobile users**: Use GPS MapKalo app, enter server IP or scan QR code
5. **Enjoy** your GPS dashboard!

## REST API

    GET http://localhost:25555/api/ats/telemetry

Returns JSON with latest telemetry data.

**Full reference in [Telemetry.md](Telemetry.md).**

## HTML5 Mapa MapKalo

    http://localhost:25555/

Works in any modern browser.

## Donations

Support the project! GPS MapKalo is **free**. If it helps you, consider supporting development.

### Donation Options

**Bre-B**

[<img height="60" src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bre-B-logo.png" alt="breb"/>](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126320014CO.COM.RBM.LLA0510009204096849250014CO.COM.RBM.RED0103RBM50310013CO.COM.RBM.CU0110009204096851250013CO.COM.RBM.CA010499995204999953031705502015802CO5922JHON%20FREDY%20DAZA%20CARDEN60051100161051100162200703001080200110363180270016CO.COM.RBM.CANAL0103APP81250015CO.COM.RBM.CIVA01020382260014CO.COM.RBM.IVA01040.0083270015CO.COM.RBM.BASE01040.0084250015CO.COM.RBM.CINC01020385260014CO.COM.RBM.INC01040.0090430016CO.COM.RBM.TRXID0119000000fT1l3DZn6_yBF91460014CO.COM.RBM.SEC0124I2vx0Ujo6wN8al5LWr1PrhXu63046F27)

<br>
<br>

<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126320014CO.COM.RBM.LLA0510009204096849250014CO.COM.RBM.RED0103RBM50310013CO.COM.RBM.CU0110009204096851250013CO.COM.RBM.CA010499995204999953031705502015802CO5922JHON%20FREDY%20DAZA%20CARDEN60051100161051100162200703001080200110363180270016CO.COM.RBM.CANAL0103APP81250015CO.COM.RBM.CIVA01020382260014CO.COM.RBM.IVA01040.0083270015CO.COM.RBM.BASE01040.0084250015CO.COM.RBM.CINC01020385260014CO.COM.RBM.INC01040.0090430016CO.COM.RBM.TRXID0119000000fT1l3DZn6_yBF91460014CO.COM.RBM.SEC0124I2vx0Ujo6wN8al5LWr1PrhXu63046F27" width="250" height="250">

<br>
<br>
<br>

**PayPal**

[<img height="60" src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="paypal"/>](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.paypal.com/qrcodes/p2pqrc/EJRS468L7ZNFC)

<br>
<br>

<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.paypal.com/qrcodes/p2pqrc/EJRS468L7ZNFC" width="250" height="250">

<br>
<br>

Scan the QR code with your payment app or click on the logos above.

## Follow Us

[<img height="48" src="https://img.icons8.com/color/480/twitch--v1.png" alt="twitch"/>](https://www.twitch.tv/jhondazac)
&nbsp;&nbsp;&nbsp;
[<img height="48" src="https://img.icons8.com/color/480/youtube-play.png" alt="youtube"/>](https://www.youtube.com/@JhonDazaAmbienteGIS)
&nbsp;&nbsp;&nbsp;
[<img height="48" src="https://img.icons8.com/color/480/tiktok--v1.png" alt="tiktok"/>](https://www.tiktok.com/@jhon.dazacardenas)
&nbsp;&nbsp;&nbsp;
[<img height="48" src="https://img.icons8.com/color/480/discord-logo.png" alt="discord"/>](https://discord.gg/wgt2RjfzH8)
&nbsp;&nbsp;&nbsp;
[<img height="48" src="https://img.icons8.com/fluency-systems-filled/96/github.png" alt="github"/>](https://github.com/JhonDazaCardenas)

<div align="center" style="background-color: #1e1e1e; border-radius: 12px; padding: 20px; border: 1px solid #333;">
  <p style="color: #fff; margin-bottom: 15px;">
    Made with ❤️ by JhonDazaCardenas in partnership with DevZeros S.A.S
  </p>
  <a href="https://devzeros.com/" target="_blank">
    <img src="https://devzeros.com/images/logo-devzeros.webp" alt="DevZeros S.A.S" height="40" style="filter: background-color: #1e1e1e; border-radius: 12px; padding: 20px; ">
  </a>
</div>

## Preview

GPS MapKalo Server: 
<img width="325" height="500" alt="image" src="https://github.com/user-attachments/assets/d7a1bf7b-d14b-403d-bd72-4e65adff3b0e" />

Dark mode:
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/eb99c0eb-c184-414f-932b-372452c9dae5" />

Clear Mode:
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/de82e693-149f-46d7-a745-b539c33de58c" />

Mobile Dark mode:
<img width="406" height="904" alt="image" src="https://github.com/user-attachments/assets/fb64d9e3-c619-4a79-82db-4c188cb7ab71" />

Mobile Clear Mode: 
<img width="406" height="904" alt="image" src="https://github.com/user-attachments/assets/ad989c0c-77bf-4175-99eb-dc4c0b27a4e2" />

## Distribution

This package contains compiled server binaries, HTML5 dashboard, and GPS MapKalo Android APK. Source code not included.

## Version

**GPS MapKalo 2026**

- Based on: ETS2 Telemetry Web Server 3.2.5
- Adapted for American Truck Simulator only MapKalo
- Added GPS mapping features
- Rebranded to GPS MapKalo with GPS integration
- Compiled distribution (no source code)

## Credits and References

- **Map (MapKalo mod):** https://github.com/ETS2LA/maps/
- **Original idea:** https://github.com/Funbit/ets2-telemetry-server
- **Inspiration:** https://github.com/TruckSim-GPS/trucksim-gps-server

## License

GNU General Public License v3 (GPL-3) - https://tldrlegal.com/license/gnu-general-public-license-v3-%28gpl-3%29
