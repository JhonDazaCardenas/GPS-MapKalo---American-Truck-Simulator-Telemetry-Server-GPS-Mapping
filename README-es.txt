# GPS MapKalo - Servidor de Telemetría de American Truck Simulator + GPS Mapping

Servidor de telemetría para American Truck Simulator con integración de GPS mapping avanzado para el mapa Colombia de MapKalo.

================================================================================
ESTRUCTURA DE CARPETAS
================================================================================

|-----------| contiene la aplicación Android GPS MapKalo con GPS mapping
|  mobile   |
|-----------| (GPS MapKalo.apk = instalación)
|-----------|
|  server   | contiene el servidor compilado y dashboard HTML5
|-----------|

Nota: Esta es una distribución compilada. El código fuente no está incluido.

Simplemente ejecuta "server/GPSMapKalo.exe" para iniciar el servidor y conecta tu dashboard HTML5 móvil o la app GPS MapKalo Android!

================================================================================
REQUISITOS DEL SISTEMA
================================================================================

- Windows 10, 11 (32-bit o 64-bit)
- Linux Debian, Ubuntu y derivados
- .NET Framework 4.5 o superior

Juego soportado:
- American Truck Simulator con MapKalo (únicamente)
- Versión 1.58+

Navegadores testeados:
- Opera (recomendado)
- Brave (recomendado)
- Firefox, Chrome, Edge

================================================================================
INSTALACIÓN
================================================================================

Windows:
1. Descomprime el ZIP donde quieras
2. Ejecuta server/GPSMapKalo.exe como administrador
3. Haz clic en "Instalar"
4. Cuando termine, haz clic en "Aceptar", selecciona abrir MapKalo
5. Listo

Linux (Debian/Ubuntu):
1. Extrae el archivo ZIP
2. Ejecuta: mono server/GPSMapKalo.exe

Android:
1. Instala mobile/Android/GPS MapKalo.apk
2. Ingresa la IP del servidor (sin http:// y puerto)
3. O escanea el código QR mostrado por el servidor

================================================================================
USO
================================================================================

1. Ejecuta server/GPSMapKalo.exe (o el servidor en Linux)
2. Ejecuta American Truck Simulator
3. Usuarios de escritorio: Conéctate a la misma Wi-Fi/LAN, abre el navegador y navega a la "URL de la App HTML5"
4. Usuarios móviles: Usa la app GPS MapKalo, ingresa la IP del servidor o escanea el código QR
5. ¡Disfruta tu dashboard con GPS!

================================================================================
API REST
================================================================================

GET http://localhost:25555/api/ats/telemetry

Retorna un objeto JSON con los últimos datos de telemetría.

Referencia completa en Telemetry.md.

================================================================================
DASHBOARD HTML5
================================================================================

http://localhost:25555/

Funciona en cualquier navegador moderno.

================================================================================
DONACIONES
================================================================================

¡Apoya el desarrollo del proyecto! GPS MapKalo es gratuito. Si te ayuda, considera apoyar su desarrollo.

- Bre-B (Cuentas bancarias de Colombia)
- PayPal (Transferencias internacionales)

Escanea el código QR con tu aplicación de pagos o haz clic en los logos en el README.md completo.

================================================================================
SÍGUENOS
================================================================================

Sígueme en redes sociales para actualizaciones, nuevas funciones y contenido de camiones:

- Twitch: https://www.twitch.tv/jhondazac
- YouTube: https://www.youtube.com/@JhonDazaAmbienteGIS
- TikTok: https://www.tiktok.com/@jhon.dazacardenas
- Discord: https://discord.gg/wgt2RjfzH8
- GitHub: https://github.com/JhonDazaCardenas

¡Dale al botón de seguir! 🚛💨

================================================================================
VISTA PREVIA
================================================================================

Servidor GPS MapKalo, Modo oscuro, Modo claro, Móvil modo oscuro, Móvil modo claro.
Consulta el README.md completo para ver las imágenes.

================================================================================
VERSIÓN
================================================================================

GPS MapKalo 2026

- Basado en: ETS2 Telemetry Web Server 3.2.5
- Adaptado para American Truck Simulator únicamente con MapKalo
- Agregadas características de GPS mapping
- Rebranded a GPS MapKalo con integración GPS
- Distribución compilada (sin código fuente)

================================================================================
CRÉDITOS Y REFERENCIAS
================================================================================

Desarrollado por DevZeros S.A.S en unión con JhonDazaCardenas (2026)

Referencias del proyecto:
- Mapa (MapKalo mod): https://github.com/ETS2LA/maps/
- Idea original: https://github.com/Funbit/ets2-telemetry-server
- Inspiración: https://github.com/TruckSim-GPS/trucksim-gps-server

================================================================================
LICENCIA
================================================================================

GNU General Public License v3 (GPL-3). Lee el archivo LICENSE para detalles.
