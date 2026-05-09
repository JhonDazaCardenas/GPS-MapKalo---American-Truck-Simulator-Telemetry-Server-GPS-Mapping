# GPS MapKalo - American Truck Simulator Telemetry Server + GPS Mapping

Telemetry server for **American Truck Simulator** with advanced GPS mapping integration.

<img width="1408" height="768" alt="image" src="https://github.com/user-attachments/assets/bb48635c-da07-4d29-a90f-215b373efe0e" />

<div align="center">
  <span style="background-color: #000000; border-radius: 12px; padding: 20px; display: inline-block;">
    <span style="color: #ffffff;">
      <strong>Made with ❤️ by JhonDazaCardenas in partnership with DevZeros S.A.S</strong>
    </span>
    <a href="https://devzeros.com/" target="_blank">
      <img width="113" height="113" alt="image" src="https://github.com/user-attachments/assets/d6929f04-c60c-4bcf-8452-25d7bb19212a" alt="DevZeros S.A.S" style="vertical-align: middle; margin-left: 6px;">
    </a>
  </span>
</div>

## Follow Us

Follow me on social media for updates, new features, and trucking content:

<div align="center">
  <a href="https://www.twitch.tv/jhondazac">
    <img height="48" src="https://img.icons8.com/color/480/twitch--v1.png" alt="twitch"/>
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://www.youtube.com/@JhonDazaAmbienteGIS">
    <img height="48" src="https://img.icons8.com/color/480/youtube-play.png" alt="youtube"/>
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://www.tiktok.com/@jhon.dazacardenas">
    <img height="48" src="https://img.icons8.com/color/480/tiktok--v1.png" alt="tiktok"/>
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://discord.gg/wgt2RjfzH8">
    <img height="48" src="https://img.icons8.com/color/480/discord-logo.png" alt="discord"/>
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://github.com/JhonDazaCardenas">
    <img height="48" src="https://img.icons8.com/fluency-systems-filled/96/github.png" alt="github"/>
  </a>
</div>

<div align="center">
  <span style="background-color: #000000; border-radius: 12px; padding: 20px; display: inline-block;">
    <span style="color: #ffffff;">
      <strong>Hit that follow button! 🚛💨</strong>
    </span>
  </span>
</div>

## Main Features

- Open source and free (GPL-3)
- Automated installation
- REST API for telemetry data
- HTML5 dashboard for real-time data streaming (WebSockets)
- GPS integration for real-time location tracking
- Dedicated GPS MapKalo Android app

## GPS MapKalo Features

- Real-time tracking of your assigned route
- On-screen display: Origin-Destination, Cargo type and Cargo weight
- Added damage metrics to the dashboard: Average vehicle wear (engine, transmission, cabin, chassis, wheels), Trailer Damage and Cargo Damage
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

- **American Truck Simulator with MapKalo** (only)
- Version 1.58+

### Tested Browsers

- **Opera** (recommended)
- **Brave** (recommended)
- Firefox, Chrome, Edge

## Installation

### Windows

1. Extract the ZIP anywhere
2. Run **server/GPSMapKalo.exe** as admin
3. Click **"Install"**
4. Click **"OK"**, select open Mapkalo
5. **Done**

### Linux (Debian/Ubuntu)

1. Extract ZIP
2. Run: `mono server/GPSMapKalo.exe`

### Android Users

Install **mobile/Android/GPS MapKalo.apk**. Copy to device and install via File Manager. App prevents sleep mode and remembers server IP. You can also scan the QR code shown by the server or input the IP address.

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

## HTML5 Map MapKalo

    http://localhost:25555/

Works in any modern browser.

## Donations

Support the project! GPS MapKalo is **free**. If it helps you, consider supporting development.

### Donation Options

**Bre-B - Colombian bank accounts**

[<img height="60" src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bre-B-logo.png" alt="breb"/>](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126320014CO.COM.RBM.LLA0510009204096849250014CO.COM.RBM.RED0103RBM50310013CO.COM.RBM.CU0110009204096851250013CO.COM.RBM.CA010499995204999953031705502015802CO5922JHON%20FREDY%20DAZA%20CARDEN60051100161051100162200703001080200110363180270016CO.COM.RBM.CANAL0103APP81250015CO.COM.RBM.CIVA01020382260014CO.COM.RBM.IVA01040.0083270015CO.COM.RBM.BASE01040.0084250015CO.COM.RBM.CINC01020385260014CO.COM.RBM.INC01040.0090430016CO.COM.RBM.TRXID0119000000fT1l3DZn6_yBF91460014CO.COM.RBM.SEC0124I2vx0Ujo6wN8al5LWr1PrhXu63046F27)

<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126320014CO.COM.RBM.LLA0510009204096849250014CO.COM.RBM.RED0103RBM50310013CO.COM.RBM.CU0110009204096851250013CO.COM.RBM.CA010499995204999953031705502015802CO5922JHON%20FREDY%20DAZA%20CARDEN60051100161051100162200703001080200110363180270016CO.COM.RBM.CANAL0103APP81250015CO.COM.RBM.CIVA01020382260014CO.COM.RBM.IVA01040.0083270015CO.COM.RBM.BASE01040.0084250015CO.COM.RBM.CINC01020385260014CO.COM.RBM.INC01040.0090430016CO.COM.RBM.TRXID0119000000fT1l3DZn6_yBF91460014CO.COM.RBM.SEC0124I2vx0Ujo6wN8al5LWr1PrhXu63046F27" width="250" height="250">

<br>

**PayPal - international transfers**

[<img height="75" src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="paypal"/>](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.paypal.com/qrcodes/p2pqrc/EJRS468L7ZNFC)

<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.paypal.com/qrcodes/p2pqrc/EJRS468L7ZNFC" width="250" height="250">

Scan the QR code with your payment app or click on the logos above.

## Preview

**GPS MapKalo Server:**

<img width="325" height="500" alt="image" src="https://github.com/user-attachments/assets/c24d8110-8517-4885-ad70-048e31f35026" />


**Dark mode:**

<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/03ab2c5e-24cd-4b2f-b432-0e93a865caae" />


**Clear Mode:**

<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/e3293d42-83aa-41f3-bbdb-1e4df726827c" />


**Mobile Dark mode:**

<img width="406" height="904" alt="image" src="https://github.com/user-attachments/assets/fb64d9e3-c619-4a79-82db-4c188cb7ab71" />

**Mobile Clear Mode:**

<img width="406" height="904" alt="image" src="https://github.com/user-attachments/assets/ad989c0c-77bf-4175-99eb-dc4c0b27a4e2" />

## Distribution

This package contains compiled server binaries, HTML5 dashboard, GPS MapKalo Android APK, and **complete source code**.

## Version

**GPS MapKalo 2026**

- Based on: ETS2 Telemetry Web Server 3.2.5
- Adapted for American Truck Simulator only MapKalo
- Added GPS mapping features
- Rebranded to GPS MapKalo with GPS integration

## Credits and References

- **Map (MapKalo mod):** https://github.com/ETS2LA/maps/
- **Original idea:** https://github.com/Funbit/ets2-telemetry-server
- **Inspiration:** https://github.com/TruckSim-GPS/trucksim-gps-server

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

- 📘 **Plain English summary (TLDRLegal):** [https://www.tldrlegal.com/license/gnu-general-public-license-v3-gpl-3](https://www.tldrlegal.com/license/gnu-general-public-license-v3-gpl-3)
- 📜 **Full legal text (GNU):** [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)
