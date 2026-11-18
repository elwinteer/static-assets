# Manifiestos de fuentes (WINTEER)

Una **fuente** es un enlace a un archivo JSON que publica quien distribuye los juegos.
WINTEER no incluye ninguna fuente. Agregá solo fuentes que tengan permiso para distribuir ese contenido
(juegos gratuitos, de código abierto, de dominio público, publicados por su propio desarrollador, o tus propios archivos).

Se administran en **Descargas → Fuentes** (agregar, activar/desactivar, actualizar, quitar).
El emparejamiento con el catálogo es solo por **ID exacto** (por ejemplo `steam:730`), nunca por parecido de nombre.

## Formato (schema 1)

```json
{
  "schema": 1,
  "name": "Mi fuente",
  "description": "Opcional",
  "homepage": "https://…",
  "include": ["otra-parte.json"],
  "games": [
    {
      "id": "steam:730",
      "ids": ["gog:1234"],
      "name": "Nombre del juego",
      "cover": "portada.jpg",
      "description": "Opcional",
      "developer": "Opcional",
      "versions": [
        {
          "version": "1.2.0",
          "date": "2026-01-31",
          "notes": "Opcional",
          "files": [
            { "url": "juego-1.2.0.zip", "size": 1234567, "sha256": "…64 hex…" },
            "otro-archivo.bin"
          ]
        }
      ]
    }
  ]
}
```

Reglas y atajos:
- `schema` es opcional (por defecto 1). Una versión mayor que la soportada se rechaza con un aviso.
- El archivo puede ser directamente una lista de juegos `[ {…}, {…} ]`, sin el objeto de afuera.
- `games` puede ser una lista, o un objeto `{ "<id>": {…} }` donde la clave es el ID.
- Cada juego necesita `name`, al menos un ID (`id`, `ids`, o `steam`/`steamAppId`/`appid` numérico) y al menos una versión con archivos.
- Atajo: un juego puede traer `files` (o `url`) directamente, sin `versions`.
- Los enlaces pueden ser relativos al manifiesto. Solo `http`/`https` (y `magnet:` / `.torrent`, que se marcan como BitTorrent y por ahora no se pueden descargar).
- Verificación opcional por archivo: `sha256`, `sha1`, `md5`, o `"hash": "sha256:…"`. Si se indica, WINTEER descarta el archivo si no coincide.
- `size` (bytes) permite verificar espacio libre antes de descargar y detectar archivos incompletos.
- `include`: lista de otros manifiestos que se suman (útil para catálogos grandes partidos en varios archivos).
- La primera versión de la lista es la predeterminada.
- Archivos partidos (`.part1.rar`, `.001`, `.zip.001`…): listalos todos; WINTEER descomprime desde el primero.
- Campos desconocidos se ignoran (se pueden agregar extras sin romper nada).
- Límites: 12 MB por manifiesto, 20 000 juegos, 50 versiones por juego, 200 archivos por versión.

## Formato plano (una fila por juego)

Además del formato anterior, WINTEER entiende listas planas, donde cada juego es una sola fila:

```json
[
  {
    "id": "steam:730",
    "name": "Nombre del juego",
    "link": "https://…/juego.zip",
    "magnet": "magnet:?xt=urn:btih:…",
    "date": "2026-01-31",
    "tags": ["rpg", "coop"],
    "creator": "Quien lo publica",
    "original": "30 GB",
    "packed": "12 GB",
    "size": "12 GB",
    "verified": true
  }
]
```

- `id` y `name` son obligatorios. El emparejamiento sigue siendo solo por ID exacto: un `id` numérico suelto (`730`) **no** se toma como Steam; para Steam usá `steam:730` o el campo `steam`/`appid`.
- `link` (http/https, o un `.torrent`) y/o `magnet`: hace falta al menos uno. Si vienen los dos, el juego aparece con dos versiones (Directa y Torrent).
- `size`, `packed` y `original` aceptan bytes (número) o texto (`"12.5 GB"`, `"700 MB"`). Se descarga `packed` (o `size` si falta); `original` es el tamaño ya instalado y se suma al chequeo de espacio libre.
- `tags` (lista o texto separado por coma), `creator`, `date` y `verified` se muestran en el catálogo y entran en la búsqueda (tags y creator). `verified` es solo una etiqueta informativa: **no** reemplaza `sha256`/`sha1`/`md5`, que son los que WINTEER comprueba.
- `sha256`, `sha1` o `md5` también se pueden poner en la fila para verificar el archivo.
