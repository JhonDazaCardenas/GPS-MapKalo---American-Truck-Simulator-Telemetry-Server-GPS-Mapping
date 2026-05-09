# GPS MapKalo - American Truck Simulator Telemetry Server + GPS Mapping

================================================================================
ESTRUCTURA DE CARPETAS
================================================================================

|-----------| contiene la aplicación GPS MapKalo para Android con integración GPS
|  mobile   |
|-----------| (GPS MapKalo.apk = instalación)
|-----------|
|  server   | contiene el servidor compilado y el dashboard HTML5
|-----------|
|-----------|
|  source   | contiene el código fuente completo
|-----------|

Nota: Esta distribución incluye el código fuente completo. Puedes encontrarlo en la carpeta "source".

Simplemente ejecuta "server/GPSMapKalo.exe" para iniciar el servidor y conectar tu dashboard móvil HTML5 o la aplicación GPS MapKalo para Android.

================================================================================
ENLACES
================================================================================

Proyecto original (código fuente): 
https://github.com/Funbit/ets2-telemetry-server

Esta versión modificada (GPS MapKalo) incluye funciones de mapeo GPS para ATS.

================================================================================
REQUISITOS DEL SISTEMA
================================================================================

- Windows 10, 11 (32-bit o 64-bit)
- Linux Debian, Ubuntu y derivados
- .NET Framework 4.5+

Juego soportado:
- American Truck Simulator (únicamente)

Navegadores probados:
- Opera (recomendado)
- Brave (recomendado)

================================================================================
INSTALACIÓN
================================================================================

Windows:
1. Descomprime el ZIP en cualquier lugar
2. Ejecuta server/GPSMapKalo.exe como administrador
3. Haz clic en "Install"
4. Cuando termine, haz clic en "OK", selecciona la interfaz de red
5. Listo

Linux:
1. Descomprime el ZIP
2. Ejecuta: mono server/GPSMapKalo.exe

Android:
1. Instala mobile/Android/GPS MapKalo.apk
2. Ingresa la IP del servidor (sin http:// ni puerto)
3. O escanea el código QR que muestra el servidor

================================================================================
CRÉDITOS
================================================================================

Desarrollado por DevZeros S.A.S en colaboración con JhonDazaCardenas (2026)

Síguenos:
- Twitch: https://www.twitch.tv/jhondazac
- YouTube: https://www.youtube.com/@JhonDazaAmbienteGIS
- TikTok: https://www.tiktok.com/@jhon.dazacardenas
- Discord: https://discord.gg/wgt2RjfzH8
- GitHub: https://github.com/JhonDazaCardenas

Referencias del proyecto:
- Mapa (mod MapKalo): https://github.com/ETS2LA/maps/
- Idea original: https://github.com/Funbit/ets2-telemetry-server/tree/master
- Inspiración: https://github.com/TruckSim-GPS/trucksim-gps-server/tree/master

================================================================================
DONACIONES
================================================================================

¡Apoya el proyecto! GPS MapKalo es gratuito.

- Bre-B Colombia
- PayPal

Escanea el código QR con tu aplicación de pagos.

================================================================================
LICENCIA
================================================================================

Este proyecto está bajo la Licencia Pública General de GNU v3.0 (GPL-3.0).

- Resumen en lenguaje sencillo (TLDRLegal): 
  https://www.tldrlegal.com/license/gnu-general-public-license-v3-gpl-3

- Texto legal completo (GNU): 
  https://www.gnu.org/licenses/gpl-3.0.html

También puedes leer el archivo LICENSE completo incluido en esta distribución.
