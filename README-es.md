# GPS MapKalo - American Truck Simulator Telemetry Server + GPS Mapping

Servidor de telemetría para **American Truck Simulator** con integración avanzada de GPS mapping.

<img width="1408" height="768" alt="image" src="https://github.com/user-attachments/assets/bb48635c-da07-4d29-a90f-215b373efe0e" />

<div align="center">
  <span style="background-color: #000000; border-radius: 12px; padding: 20px; display: inline-block;">
    <span style="color: #ffffff;">
      <strong>Desarrollado con ❤️ por JhonDazaCardenas en alianza con DevZeros S.A.S</strong>
    </span>
    <a href="https://devzeros.com/" target="_blank">
      <img width="113" height="113" alt="image" src="https://github.com/user-attachments/assets/d6929f04-c60c-4bcf-8452-25d7bb19212a" alt="DevZeros S.A.S" style="vertical-align: middle; margin-left: 6px;">
    </a>
  </span>
</div>

## Síguenos

Sígueme en redes sociales para actualizaciones, nuevas funciones y contenido de camioneros:

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
      <strong>¡Dale al botón de seguir! 🚛💨</strong>
    </span>
  </span>
</div>

## Características Principales

- Código abierto y gratuito (GPL-3)
- Instalación automatizada
- API REST para datos de telemetría
- Dashboard HTML5 para transmisión de datos en tiempo real (WebSockets)
- Integración GPS para seguimiento de ubicación en tiempo real
- Aplicación Android GPS MapKalo dedicada

## Características de GPS MapKalo

- Seguimiento en tiempo real de tu ruta asignada
- Visualización en pantalla: Origen-Destino, tipo de carga y peso de la carga
- Añadidas métricas de daño al panel: Promedio de desgaste del vehículo (motor, transmisión, cabina, chasis, ruedas), Daño del remolque y Daño de la carga
- Parámetros en pantalla: Velocidad, combustible, tiempo restante, KM restantes, hora de llegada estimada
- Navegador de mapa interno (icono de lupa) para buscar ubicaciones
- Modo Automático Claro/Oscuro basado en la hora del sistema con cambio manual
- Alternar visibilidad de empresas en el mapa
- Servicios del mapa: Áreas de descanso, gasolineras, peajes
- Asistente de voz en fase beta (en desarrollo)
- Modo Libre: Ver cualquier punto del mapa
- Indicador de velocidad de conducción en pantalla
- Indicador de límite de velocidad
- Opción de pantalla completa para dispositivos móviles
- Ideal para segundas pantallas y dispositivos móviles
- Código QR integrado para conexión rápida desde la app

## Requisitos del Sistema

### Sistemas Operativos Soportados

- Windows 10, 11 (32-bit o 64-bit)
- Linux Debian, Ubuntu y derivados
- .NET Framework 4.5+

### Juegos Soportados

- **American Truck Simulator con MapKalo** (únicamente)
- Versión 1.58+

### Navegadores Probados

- **Opera** (recomendado)
- **Brave** (recomendado)
- Firefox, Chrome, Edge

## Instalación

### Windows

1. Extrae el ZIP en cualquier lugar
2. Ejecuta **server/GPSMapKalo.exe** como administrador
3. Haz clic en **"Install"**
4. Haz clic en **"OK"**, selecciona abrir MapKalo
5. **Listo**

### Linux (Debian/Ubuntu)

1. Extrae el ZIP
2. Ejecuta: `mono server/GPSMapKalo.exe`

### Usuarios de Android

Instala **mobile/Android/GPS MapKalo.apk**. Cópialo a tu dispositivo e instálalo mediante el Administrador de Archivos. La app evita el modo de suspensión y recuerda la IP del servidor. También puedes escanear el código QR que muestra el servidor o ingresar la dirección IP.

## Uso

1. Ejecuta **server/GPSMapKalo.exe** (o el servidor en Linux)
2. Ejecuta **American Truck Simulator**
3. **Usuarios de escritorio**: Conéctate a la misma Wi-Fi/LAN, abre el navegador y navega a la "URL de la App HTML5"
4. **Usuarios móviles**: Usa la app GPS MapKalo, ingresa la IP del servidor o escanea el código QR
5. **Disfruta** tu tablero GPS

## API REST

    GET http://localhost:25555/api/ats/telemetry

Devuelve JSON con los últimos datos de telemetría.

**Referencia completa en [Telemetry.md](Telemetry.md).**

## Mapa HTML5 MapKalo

    http://localhost:25555/

Funciona en cualquier navegador moderno.

## Donaciones

¡Apoya el proyecto! GPS MapKalo es **gratuito**. Si te ayuda, considera apoyar su desarrollo.

### Opciones de Donación

**Bre-B - Cuentas bancarias colombianas**

[<img height="60" src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bre-B-logo.png" alt="breb"/>](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126320014CO.COM.RBM.LLA0510009204096849250014CO.COM.RBM.RED0103RBM50310013CO.COM.RBM.CU0110009204096851250013CO.COM.RBM.CA010499995204999953031705502015802CO5922JHON%20FREDY%20DAZA%20CARDEN60051100161051100162200703001080200110363180270016CO.COM.RBM.CANAL0103APP81250015CO.COM.RBM.CIVA01020382260014CO.COM.RBM.IVA01040.0083270015CO.COM.RBM.BASE01040.0084250015CO.COM.RBM.CINC01020385260014CO.COM.RBM.INC01040.0090430016CO.COM.RBM.TRXID0119000000fT1l3DZn6_yBF91460014CO.COM.RBM.SEC0124I2vx0Ujo6wN8al5LWr1PrhXu63046F27)

<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126320014CO.COM.RBM.LLA0510009204096849250014CO.COM.RBM.RED0103RBM50310013CO.COM.RBM.CU0110009204096851250013CO.COM.RBM.CA010499995204999953031705502015802CO5922JHON%20FREDY%20DAZA%20CARDEN60051100161051100162200703001080200110363180270016CO.COM.RBM.CANAL0103APP81250015CO.COM.RBM.CIVA01020382260014CO.COM.RBM.IVA01040.0083270015CO.COM.RBM.BASE01040.0084250015CO.COM.RBM.CINC01020385260014CO.COM.RBM.INC01040.0090430016CO.COM.RBM.TRXID0119000000fT1l3DZn6_yBF91460014CO.COM.RBM.SEC0124I2vx0Ujo6wN8al5LWr1PrhXu63046F27" width="250" height="250">

<br>

**PayPal - Transferencias internacionales**

[<img height="75" src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="paypal"/>](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.paypal.com/qrcodes/p2pqrc/EJRS468L7ZNFC)

<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.paypal.com/qrcodes/p2pqrc/EJRS468L7ZNFC" width="250" height="250">

Escanea el código QR con tu app de pagos o haz clic en los logotipos de arriba.

## Vista Previa

**Servidor GPS MapKalo:**

<img width="325" height="500" alt="image" src="https://github.com/user-attachments/assets/2893ea1b-7fa6-4e09-8c1f-dad35b5c417f" />

**Modo oscuro:**

<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/eb99c0eb-c184-414f-932b-372452c9dae5" />

**Modo claro:**

<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/f23d751c-e939-41e5-9847-7f4f571d4f7d" />

**Modo oscuro móvil:**

<img width="406" height="904" alt="image" src="https://github.com/user-attachments/assets/fb64d9e3-c619-4a79-82db-4c188cb7ab71" />

**Modo claro móvil:**

<img width="406" height="904" alt="image" src="https://github.com/user-attachments/assets/ad989c0c-77bf-4175-99eb-dc4c0b27a4e2" />

## Distribución

Este paquete contiene binarios compilados del servidor, el dashboard HTML5, el APK de Android de GPS MapKalo y **el código fuente completo**.

## Versión

**GPS MapKalo 2026**

- Basado en: ETS2 Telemetry Web Server 3.2.5
- Adaptado únicamente para American Truck Simulator con MapKalo
- Se añadieron funciones de GPS mapping
- Rebranding a GPS MapKalo con integración GPS

## Créditos y Referencias

- **Mapa (mod MapKalo):** https://github.com/ETS2LA/maps/
- **Idea original:** https://github.com/Funbit/ets2-telemetry-server
- **Inspiración:** https://github.com/TruckSim-GPS/trucksim-gps-server

## Licencia

Este proyecto está bajo la **GNU General Public License v3.0 (GPL-3.0)**.

- 📘 **Resumen en lenguaje sencillo (TLDRLegal):** [https://www.tldrlegal.com/license/gnu-general-public-license-v3-gpl-3](https://www.tldrlegal.com/license/gnu-general-public-license-v3-gpl-3)
- 📜 **Texto legal completo (GNU):** [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)
