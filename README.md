# FACTOR API · Tienda de productos apícolas

Sitio web estático listo para probar en GitHub Pages.

## Incluye

- Home / landing premium con glassmorphism.
- Tienda con filtros y buscador.
- Ficha de producto.
- Carrito con localStorage.
- Animación al agregar productos al carrito.
- Animación al completar pedido.
- Pedido por WhatsApp.
- Página Nosotros.
- Página Proceso.
- Página Contacto.
- Métodos de pago.
- Stock y precios de ejemplo.
- Diseño responsive para celular y computadora.

## Importante

El WhatsApp de pedidos y contacto está configurado como `51941983088` ( +51 941 983 088 ). Si cambia, actualiza ese número en `app.js`.

Los precios y existencias de otros productos son configurables en `app.js`. El producto Mini Api cuesta S/ 20.00. El formulario de contacto abre WhatsApp con los datos rellenados; la persona debe pulsar Enviar en WhatsApp. Un sitio estático de GitHub Pages no puede enviar correos por sí solo sin un servicio externo o backend.

## Probar localmente

Puedes abrir `index.html` directamente en el navegador. Para una experiencia más parecida a GitHub Pages, usa una extensión de servidor local en VS Code o ejecuta un servidor HTTP simple.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube al repositorio los archivos de esta carpeta (por ejemplo `index.html`, `tienda.html`, `app.js`, `styles.css`) y la carpeta `assets`, directamente en la raíz del repositorio. No subas la carpeta contenedora como un nivel adicional.
3. Ve a Settings → Pages.
4. En “Build and deployment” selecciona “Deploy from a branch”.
5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda y espera a que GitHub genere tu enlace.

No necesita Node.js, npm ni base de datos para esta demo.


### Disponibilidad
La tienda muestra `Disponible para pedido` en lugar de cantidades exactas de stock, para evitar que tengas que actualizar existencias constantemente. La disponibilidad final se confirma por WhatsApp antes de cerrar el pedido.

### WhatsApp
En `app.js`, reemplaza `51941983088` por el número real del negocio, usando código de país y sin `+`, espacios ni guiones.


## Reparación de imágenes y logo (GitHub Pages)

- Las referencias a imágenes usan rutas relativas explícitas (`./assets/...`).
- La carpeta `assets` debe quedar al mismo nivel que `index.html`, `tienda.html`, `app.js` y `styles.css`.
- En GitHub, abre el repositorio `Factor-Api.com` y sube **el contenido** del ZIP a la raíz del repositorio, incluida la carpeta `assets` completa. No subas solo los archivos HTML.
- Después de confirmar los cambios, espera a que termine el despliegue de Pages y recarga la web con `Cmd + Shift + R` en Mac.

Las imágenes están incluidas en este ZIP. Si el sitio publicado sigue sin mostrarlas, verifica en GitHub que exista `assets/logo.png` y que al abrirlo desde el repositorio se vea la imagen.
