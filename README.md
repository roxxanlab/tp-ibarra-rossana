# Atlas de ubicaciones

**Autora:** Rossana Ibarra  
**Variante:** B · Ubicaciones  
**Asignatura:** Fundamentos de Desarrollo Web

Explorador de ubicaciones de Rick and Morty. Permite buscar por nombre, tipo o ambos criterios. Cada tarjeta muestra el nombre, el tipo, la dimensión y la cantidad de residentes. Al recargar, se restablecen los criterios y se repite la última búsqueda.

## Uso

Abre `index.html` en el navegador. También puedes servir la carpeta con `python -m http.server 8000` y entrar a `http://localhost:8000`. Se necesita conexión a Internet para consultar la API.

Prueba con **Earth** como nombre y **Planet** como tipo. El sitio muestra hasta 20 ubicaciones, correspondientes a la primera página de la API. Si hay más coincidencias, el mensaje indica el total.

## Captura

![Resultados de la búsqueda de ubicaciones Earth de tipo Planet](img/captura.png)

## Código

- `index.html` contiene el formulario y la sección de resultados.
- `css/estilos.css` define el diseño adaptable, el encabezado Flexbox y la grilla de tarjetas.
- `js/app.js` consulta el endpoint de ubicaciones con `fetch`, crea las tarjetas con el DOM y guarda los criterios en `localStorage`.

[Documentación de la API de Rick and Morty](https://rickandmortyapi.com/documentation)
