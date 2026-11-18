# BitTorrent en WINTEER (etapa 6)

## Cómo está armado
BitTorrent real, con **libtorrent-rasterbar 2.x**, dentro de un programa aparte: `winteer-bt.exe` (código en `bt/`).
WINTEER (`bt.js`) lo lanza y le habla por stdin/stdout, un JSON por línea. Así WINTEER no necesita compilar nada nativo
dentro de Electron, y si el ayudante falla, la app no se cae.

- Si `winteer-bt.exe` no está, **BitTorrent no se ofrece**: los magnets y `.torrent` se rechazan con un mensaje claro. Nada se simula.
- El motor de descargas (`dl.js`) trata a un torrent como una descarga más: cola, máximo de simultáneas, pausa, reanudar, cancelar,
  límite de velocidad (global, el mismo de los ajustes) y persistencia entre reinicios.
- Al terminar, WINTEER instala igual que siempre: si el torrent trae archivos comprimidos los descomprime; si no, copia el contenido.
- **No se siembra**: al completar, el ayudante saca el torrent de la sesión y deja los archivos en disco. (Mientras descarga, BitTorrent sube partes a otros pares: es parte del protocolo.)
- Solo para contenido que tengas permiso de distribuir/descargar (software libre, dominio público, tus propios archivos, etc.).

## Dónde se compila
GitHub Actions (`.github/workflows/beta.yml`, trabajo `bt`) compila el ayudante con vcpkg en Windows y lo agrega al instalador
en `resources/bt/winteer-bt.exe`. Si esa compilación falla, la beta se arma igual, sin BitTorrent.
**El ayudante todavía no fue compilado ni probado**: se escribió sin poder compilar libtorrent en el entorno de desarrollo.
La primera compilación puede necesitar ajustes menores de la API (se ven en el log del trabajo `bt`).

## Compilar a mano (Windows, opcional)
Requisitos: Visual Studio Build Tools (C++), CMake y vcpkg.
```
cmake -S bt -B bt/build -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=C:\vcpkg\scripts\buildsystems\vcpkg.cmake -DVCPKG_TARGET_TRIPLET=x64-windows-static
cmake --build bt/build --config Release
copy bt\build\Release\winteer-bt.exe bt\bin\
```
Con `winteer-bt.exe` en `bt/bin/`, WINTEER (modo desarrollo) lo detecta solo.

## Cómo probarlo en Windows (paso a paso)
1. **Ayudante solo**, en una consola: `winteer-bt.exe --state C:\temp\btstate` y escribir `{"op":"hello","rid":1}` + Enter.
   Debe responder `{"ev":"hello",...}`. Ctrl+C para salir.
2. **Descarga real** (en la consola del ayudante):
   `{"op":"add","rid":2,"id":"t1","uri":"magnet:?xt=urn:btih:<hash de un torrent legal>","dir":"C:\\temp\\bt-test"}`
   Debe responder `{"ev":"ack","rid":2}` y luego un `{"ev":"status",...}` por segundo con `done`, `total`, `down`, `peers`.
   Al terminar: `{"ev":"finished","root":...,"files":[...]}` y los archivos en `C:\temp\bt-test`.
   Torrent de prueba legal sugerido: una película abierta (Blender: *Big Buck Bunny*, *Sintel*) o una ISO de Linux desde su sitio oficial.
3. **Pausa y reanudar**: `{"op":"pause","rid":3,"id":"t1"}` y luego `{"op":"resume","rid":4,"id":"t1"}`; el progreso debe continuar donde estaba. Cerrar el ayudante a mitad y volver a mandar `add` con el mismo `id`: retoma sin empezar de cero.
4. **Desde WINTEER**: abrir Descargas. Debe decir que acepta magnet/.torrent (si dice "no está instalado", el ayudante no se encontró). Pegar el magnet, poner un nombre y tocar "Descargar e instalar". La tarjeta muestra "BitTorrent · N pares", velocidad y progreso. Probar Pausar, Reanudar, cerrar WINTEER a mitad y reabrir (debe seguir), y Cancelar (borra lo descargado).
5. **Desde una fuente**: un manifiesto con una versión cuyo único archivo sea un `magnet:` o un `.torrent`; debe aparecer el botón de descarga y funcionar igual.

## Protocolo (JSON por línea)
WINTEER → ayudante (todas llevan `rid`; el ayudante responde `{"ev":"ack","rid":N}` o `{"ev":"nack","rid":N,"code","msg"}`):

| orden | campos | efecto |
|---|---|---|
| `hello` | | responde `{"ev":"hello","version","lt"}` |
| `add` | `id`, `uri` (magnet o ruta de un `.torrent`), `dir` | empieza o retoma (si el `id` ya existe, lo reanuda) |
| `pause` / `resume` | `id` | pausa (guarda datos para retomar) / continúa |
| `remove` | `id`, `deleteFiles` | saca el torrent y, si se pide, borra los archivos |
| `limits` | `down`, `up` (bytes/s, 0 = sin límite) | límites globales |
| `shutdown` | | guarda el estado y sale |

Ayudante → WINTEER (sin `rid`):
- `status`: `id`, `state` (`checking`/`metadata`/`downloading`/`paused`/`finished`), `done`, `total`, `down`, `up`, `peers`, `seeds`, `hash`, `name` (una vez por segundo).
- `finished`: `id`, `root`, `files:[{p,s}]` (rutas relativas a `root` y tamaños).
- `error`: `id`, `code` (`torrent`/`disk`), `msg`.

## Pruebas automáticas
`test/bt.test.js` prueba el lado JavaScript (cliente, cola, pausa, cancelar, errores, instalación del contenido, `.torrent` por http, reglas de fuentes)
contra `test/fake-bt.js`, un **doble de pruebas del protocolo que solo existe para los tests** y no forma parte del producto.
No prueba libtorrent: eso se prueba en Windows con los pasos de arriba.
