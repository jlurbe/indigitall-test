# Indigitall test

## Descripción

Este proyecto vacío, con ciertas utilidades, se entrega como material para facilitar el desarollo de la prueba técnica

Corresponde al desarrollador construir la funcionalidad. Para ejecutar el API se puede hacer mediante:

  ```bash
  npm start
  ```

Como utilidades para agilizar el desarrollo se incluye lo siguiente:

- Una capreta "lib" con un objeto de conexión a SQLite. Aunque el desarrollador tiene la libertad de usar lo que considere en este aspecto.

- En el caso de que se desee utilizar SQLite, existe una carpeta "sql" con un script que ejecuta las queries iniciales para crear el esquema de base de datos, el script ejecutará las sentencias escritas en el fichero createSchema.sql de la misma carpeta. para ejecutarlo sería de la siguiente forma:

  ```bash
  npm run create-db
  ```

- Un objeto en la carpeta "services" para realizar peticiones al API externa que procesa usuarios del hemisferio sur

## Requisitos

- Uso de Node.js y framework Express.js
- Uso de base de datos relacional SQL para alojar los datos.
- Uso de lenguaje SQL (no usar ORM)
- La programación asíncrona debe realizarse mediante promesas o async/await.
- Entrada y salida del API en formato JSON
- Antes de procesar cada petición, se debe imprimir un log con la información correspondiente, método, path y parámetros.
- Control de errores y excepciones.
- Buena organización y estilo de código intentando seguir un patrón de diseño en el que la lógica y el modelo de datos sean independientes.

## suposiciones y puntos a tener en cuenta

- El id de la tabla de usuario lo dejamos como autonúmerico por sencillez, pero debería ser generado por un servicio compartido entre hemisferios para que fuera siempre único independientemente del hemisferio.
- Se modifica el southernUsersApi para mockear resultados y errores
- Se crea en la raíz el archivo api.http con algunas llamadas para testear la api
- En el archivo sql/friendsQueries.sql están las queries solicitadas
- Se deja el .env por sencillez. No se subiría al repositorio en condiciones normales
