# GPS MapKalo - American Truck Simulator Telemetry Server + GPS Mapping

Servidor de telemetría para **American Truck Simulator** con integración de GPS mapping avanzado.

<img width="1408" height="768" alt="image" src="https://github.com/user-attachments/assets/bb48635c-da07-4d29-a90f-215b373efe0e" />

<div align="center"> <span style="background-color: #000000 ; border-radius: 12px; padding: 20px; display: inline-block;">
  <span style="color: #ffffff;">
     <strong>Desarrollado con ❤️ por JhonDazaCardenas en unión con DevZeros S.A.S</strong>
  </span>
  <a href="https://devzeros.com/" target="_blank">
    <img width="113" height="113" alt="image" src="https://github.com/user-attachments/assets/d6929f04-c60c-4bcf-8452-25d7bb19212a" alt="DevZeros S.A.S" style="vertical-align: middle; margin-left: 6px;">
  </a>
</div>
    
## Síguenos

Sígueme en redes sociales para actualizaciones, nuevas funciones y contenido de camiones:

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

<div align="center"> <span style="background-color: #000000 ; border-radius: 12px; padding: 20px; display: inline-block;">
  <span style="color: #ffffff;">
     <strong>¡Dale al botón de seguir! 🚛💨</strong>
  </span>
</div>
    
## Características Principales

- Código abierto y libre (GPL-3)
- Instalación automatizada
- API REST para datos de telemetría
- Dashboard HTML5 para streaming de datos en tiempo real (WebSockets)
- Integración GPS para seguimiento de ubicación en tiempo real
- Aplicación Android GPS MapKalo dedicada

## Características GPS MapKalo

- Seguimiento en tiempo real de tu ruta asignada
- Visualización en pantalla de datos del trabajo: Origen-Destino, tipo de carga y peso
- Parámetros en pantalla: Velocidad, capacidad del tanque, tiempo restante, kilómetros restantes, hora de llegada estimada
- Navegador de mapa interno (ícono de lupa) para buscar ubicaciones específicas
- Modo automático Claro/Oscuro basado en la hora del sistema, con botones de cambio manual
- Alternar visibilidad de empresas en el mapa
- Servicios de mapa: Áreas de descanso, estaciones de gasolina y peajes
- Asistente de voz Beta (en desarrollo)
- Modo Libre: Ver cualquier punto del mapa
- Velocidad de manejo en pantalla
- Indicador de límite de velocidad en pantalla
- Opción de pantalla completa para dispositivos móviles
- Ideal para mostrar tu mapa y posición en segundas pantallas y dispositivos móviles
- Código QR integrado para conexión rápida desde la app móvil

## Requisitos del Sistema

### SO Soportados

- Windows 10, 11 (32-bit o 64-bit)
- Linux Debian, Ubuntu y derivados
- .NET Framework 4.5 o superior

### Juegos Soportados

- **American Truck Simulator con MapKalo** (únicamente)
- Versión 1.58+

### Navegadores Testeados

- **Opera** (recomendado)
- **Brave** (recomendado)
- Firefox, Chrome, Edge

## Instalación

### Windows

1. Descomprime el archivo ZIP donde quieras
2. Ejecuta **server/GPSMapKalo.exe** como administrador
3. Haz clic en **"Instalar"**
4. Cuando termine, haz clic en **"Aceptar"**, selecciona abrir MapKalo
5. **Listo**

### Linux (Debian/Ubuntu)

1. Extrae el archivo ZIP
2. Ejecuta el servidor con: `mono server/GPSMapKalo.exe`

### Usuarios Android

Instala **mobile/Android/GPS MapKalo.apk**. Copia a tu dispositivo e instala a través del Gestor de Archivos. La app previene el modo suspensión y recuerda la IP del servidor. También puedes escanear el código QR mostrado por el servidor o ingresar la IP manualmente.

## Uso

1. Ejecuta **server/GPSMapKalo.exe** (o el servidor en Linux)
2. Ejecuta **American Truck Simulator**
3. **Usuarios de escritorio**: Conéctate a la misma Wi-Fi/LAN, abre el navegador y navega a la "URL de la App HTML5"
4. **Usuarios móviles**: Usa la app GPS MapKalo, ingresa la IP del servidor o escanea el código QR
5. **¡Disfruta** tu dashboard con GPS!

## API REST de Telemetría

    GET http://localhost:25555/api/ats/telemetry

Retorna un objeto JSON estructurado con los últimos datos de telemetría.

**La referencia completa de propiedades está disponible en [Telemetry.md](Telemetry.md).**

## Dashboard HTML5 Mapa MapKalo

    http://localhost:25555/

Funciona en cualquier navegador moderno de escritorio o móvil.

## Donaciones

¡Apoya el desarrollo del proyecto! GPS MapKalo es **gratuito**. Si te ayuda, considera apoyar su desarrollo. **¡Cada aporte cuenta!** 🚛

### Opciones de Donación

**Bre-B - Cuentas bancarias de Colombia**

[<img height="60" src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bre-B-logo.png" alt="breb"/>](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126320014CO.COM.RBM.LLA0510009204096849250014CO.COM.RBM.RED0103RBM50310013CO.COM.RBM.CU0110009204096851250013CO.COM.RBM.CA010499995204999953031705502015802CO5922JHON%20FREDY%20DAZA%20CARDEN60051100161051100162200703001080200110363180270016CO.COM.RBM.CANAL0103APP81250015CO.COM.RBM.CIVA01020382260014CO.COM.RBM.IVA01040.0083270015CO.COM.RBM.BASE01040.0084250015CO.COM.RBM.CINC01020385260014CO.COM.RBM.INC01040.0090430016CO.COM.RBM.TRXID0119000000fT1l3DZn6_yBF91460014CO.COM.RBM.SEC0124I2vx0Ujo6wN8al5LWr1PrhXu63046F27)

<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126320014CO.COM.RBM.LLA0510009204096849250014CO.COM.RBM.RED0103RBM50310013CO.COM.RBM.CU0110009204096851250013CO.COM.RBM.CA010499995204999953031705502015802CO5922JHON%20FREDY%20DAZA%20CARDEN60051100161051100162200703001080200110363180270016CO.COM.RBM.CANAL0103APP81250015CO.COM.RBM.CIVA01020382260014CO.COM.RBM.IVA01040.0083270015CO.COM.RBM.BASE01040.0084250015CO.COM.RBM.CINC01020385260014CO.COM.RBM.INC01040.0090430016CO.COM.RBM.TRXID0119000000fT1l3DZn6_yBF91460014CO.COM.RBM.SEC0124I2vx0Ujo6wN8al5LWr1PrhXu63046F27" width="250" height="250">

<br>

**PayPal - Transferencias internacionales**

[<img height="75" src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="paypal"/>](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.paypal.com/qrcodes/p2pqrc/EJRS468L7ZNFC)

<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.paypal.com/qrcodes/p2pqrc/EJRS468L7ZNFC" width="250" height="250">

Escanea el código QR con tu aplicación de pagos o haz clic en los logos de arriba.

## Vista Previa

Servidor GPS MapKalo:
<img width="325" height="500" alt="image" src="https://github.com/user-attachments/assets/d7a1bf7b-d14b-403d-bd72-4e65adff3b0e" />

Modo oscuro:
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/eb99c0eb-c184-414f-932b-372452c9dae5" />

Modo claro:
<img width="960" height="540" alt="image" src="https://github.com/user-attachments/assets/de82e693-149f-46d7-a745-b539c33de58c" />

Móvil modo oscuro:
<img width="406" height="904" alt="image" src="https://github.com/user-attachments/assets/fb64d9e3-c619-4a79-82db-4c188cb7ab71" />

Móvil modo claro:
<img width="406" height="904" alt="image" src="https://github.com/user-attachments/assets/ad989c0c-77bf-4175-99eb-dc4c0b27a4e2" />

## Distribución

Este paquete contiene binarios compilados del servidor, dashboard HTML5 y APK de Android GPS MapKalo. El código fuente no está incluido.

## Versión

**GPS MapKalo 2026**

- Basado en: ETS2 Telemetry Web Server 3.2.5
- Adaptado para American Truck Simulator únicamente con MapKalo
- Agregadas características de GPS mapping
- Rebranded a GPS MapKalo con integración GPS
- Distribución compilada (sin código fuente)

## Créditos y Referencias

- **Mapa (MapKalo mod):** [ETS2LA/maps](https://github.com/ETS2LA/maps/)
- **Idea original:** [Funbit/ets2-telemetry-server](https://github.com/Funbit/ets2-telemetry-server)
- **Inspiración:** [TruckSim-GPS/trucksim-gps-server](https://github.com/TruckSim-GPS/trucksim-gps-server)

## Licencia

[GNU General Public License v3 (GPL-3)](https://tldrlegal.com/license/gnu-general-public-license-v3-%28gpl-3%29)
