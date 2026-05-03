# GPS MapKalo - American Truck Simulator Telemetry Server + GPS Mapping

Servidor de telemetría para **American Truck Simulator** con integración de GPS mapping avanzado.

**Por DevZeros S.A.S en unión con JhonDazaCardenas**

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

- **American Truck Simulator** (únicamente)
- Versión 1.40+

### Navegadores Testeados

- **Opera** (recomendado)
- **Brave** (recomendado)
- Firefox, Chrome, Edge

## Instalación

### Windows

1. Descomprime el archivo ZIP donde quieras
2. Ejecuta **server/GPSMapKalo.exe**
3. Click en **"Instalar"**
4. Cuando termine, click en **"Aceptar"**, selecciona interfaz de red y click en **"URL de la App HTML5"**
5. **Listo**

### Linux (Debian/Ubuntu)

1. Extrae el archivo ZIP
2. Ejecuta el servidor con: `mono server/GPSMapKalo.exe`
3. O sigue las instrucciones de instalación

### Usuarios Android

Instala **mobile/Android/GPS MapKalo.apk**. Copia a tu dispositivo e instala a través de Gestor de Archivos. La app previene el modo suspensión y recuerda la IP del servidor. También puedes escanear el código QR mostrado por el servidor.

## Uso

1. Ejecuta **server/GPSMapKalo.exe** (o el servidor en Linux)
2. Ejecuta **American Truck Simulator**
3. **Usuarios de escritorio**: Conecta tu notebook a la misma Wi-Fi/LAN, abre el navegador y navega a "*URL de la App HTML5*"
4. **Usuarios móviles**: Usa la app GPS MapKalo, ingresa la IP del servidor (sin http:// y puerto), presiona Aceptar O escanea el código QR mostrado por el servidor
5. **¡Disfruta** tu dashboard con GPS!

## API REST de Telemetría

    GET http://localhost:25555/api/ats/telemetry

Retorna un objeto JSON estructurado con los últimos datos de telemetría.

**La referencia completa de propiedades está disponible en [Telemetry.md](Telemetry.md).**

## Dashboard HTML5 Móvil

    http://localhost:25555/

Funciona en cualquier navegador moderno de escritorio o móvil.

## Sección de Donación

¡Apoya el desarrollo del proyecto! GPS MapKalo es **gratuito**. Si te ayuda, considera apoyar su desarrollo. **¡Cada aporte cuenta!** 🚛

### Opciones de Donación

| Método | Logo |
|--------|-------|
| 🏦 Bre-B | <img width="24" height="24" src="https://upload.wikimedia.org/wikipedia/commons/5/57/Bre-B-logo.png" alt="breb"/> |
| 💳 PayPal | <img width="24" height="24" src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="paypal"/> |

Escanea el código QR con tu app de pago.

## Síguenos

| Plataforma | Logo | Enlace |
|------------|------|--------|
| 🔴 Twitch | <img width="24" height="24" src="https://img.icons8.com/color/480/twitch--v1.png" alt="twitch"/> | [jhondazac](https://www.twitch.tv/jhondazac) |
| 📺 YouTube | <img width="24" height="24" src="https://img.icons8.com/color/480/youtube-play.png" alt="youtube"/> | [JhonDazaAmbienteGIS](https://www.youtube.com/@JhonDazaAmbienteGIS) |
| 🎵 TikTok | <img width="24" height="24" src="https://img.icons8.com/color/480/tiktok--v1.png" alt="tiktok"/> | [@jhon.dazacardenas](https://www.tiktok.com/@jhon.dazacardenas) |
| 💬 Discord | <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48"><path fill="#5865F2" d="M40,12c0,0-4.585-3.588-10-4l-0.5,4.083C29.253,12.323,25.557,14.562,25.557,14.562S23.746,13.438,21.933,12.514c0,0-1.828,2.867-1.838,2.888c2.42,0.735,3.535,1.574,3.535,1.574s-1.212-0.943-3.773-1.574c-0.011-0.016-1.834-2.885-1.834-2.885S16.255,13.435,14.444,14.557S12.742,12.315,12.742,12.315L12.5,8.083C6.915,8.412,2.5,12,2.5,12"/><path fill="#5865F2" d="M34.783,15.475c0,0,1.212,0.943,3.773,1.574c0.011,0.016,1.834,2.885,1.834,2.885S38.746,19.565,40.557,18.443c0,0,1.702-2.242,1.702-2.242l0.5-4.083c-5.415-0.412-9.83,3.588-9.83,3.588S30.557,14.838,34.783,15.475z"/><circle fill="#5865F2" cx="18.5" cy="29.5" r="4"/><circle fill="#5865F2" cx="29.5" cy="29.5" r="4"/><path fill="#99aab5" d="M27.5,24.5c-1.933,0-3.5,1.567-3.5,3.5c0,1.933,1.567,3.5,3.5,3.5c1.933,0,3.5-1.567,3.5-3.5C31,26.067,29.433,24.5,27.5,24.5z"/></svg> | [Únete al servidor](https://discord.gg/wgt2RjfzH8) |
| 🐙 GitHub | <img width="24" height="24" src="https://img.icons8.com/fluency-systems-filled/96/github.png" alt="github"/> | [JhonDazaCardenas](https://github.com/JhonDazaCardenas) |

**Desarrollado con ❤️ por JhonDazaCardenas en unión con [DevZeros S.A.S](https://devzeros.com/)**

## Vista Previa

![Dashboard GPS](https://imgur.com/a/OWleCzK)
![Mapa](https://imgur.com/a/hXfa2rf)
![Navegación](https://imgur.com/a/N5244A9)
![Ruta](https://imgur.com/a/27lVTgu)
![Panel](https://imgur.com/a/338ydDm)

## Captura de Pantalla

![Entrada](https://imgur.com/a/i8519S5)

## Distribución

Este paquete contiene binarios compilados del servidor, dashboard HTML5 y APK de Android GPS MapKalo. El código fuente no está incluido.

## Versión

**GPS MapKalo 2026**
- Basado en: ETS2 Telemetry Web Server 3.2.5
- Adaptado para American Truck Simulator únicamente
- Agregadas características de GPS mapping
- Rebranded a GPS MapKalo con integración GPS
- Distribución compilada (sin código fuente)

## Créditos y Referencias

- **Mapa (MapKalo mod):** [ETS2LA/maps](https://github.com/ETS2LA/maps/)
- **Idea original:** [Funbit/ets2-telemetry-server](https://github.com/Funbit/ets2-telemetry-server)
- **Inspiración:** [TruckSim-GPS/trucksim-gps-server](https://github.com/TruckSim-GPS/trucksim-gps-server)

## Licencia

[GNU General Public License v3 (GPL-3)](https://tldrlegal.com/license/gnu-general-public-license-v3-%28gpl-3%29)