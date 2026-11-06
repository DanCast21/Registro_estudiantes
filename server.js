const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para leer datos de formularios (POST). Debe ir ANTES de las rutas.
app.use(express.urlencoded({ extended: true }));

// Escapa caracteres especiales para que lo escrito por el usuario no rompa el HTML
function escapar(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Construye la página de respuesta (sirve para GET y POST)
function paginaRespuesta(metodo, datos) {
    // Si un campo llega vacío o no existe, se muestra un texto por defecto
    const campo = (v) => escapar(v).trim() || '<em>(no proporcionado)</em>';
    const { nombre, apellido, edad, correo, programa } = datos || {};

    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Datos recibidos por ${metodo}</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f0f4f8;
            margin: 0;
            padding: 40px 16px;
        }

        .tarjeta {
            max-width: 480px;
            margin: auto;
            background: #fff;
            padding: 28px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, .1);
        }

        h1 {
            color: #1f3a5f;
            font-size: 1.4rem;
            margin-top: 0;
        }

        .mensaje {
            background: #e6f4ea;
            color: #1e6b34;
            padding: 10px 14px;
            border-radius: 6px;
            margin-bottom: 18px;
        }

        dt {
            font-weight: bold;
            color: #555;
            margin-top: 12px;
        }

        dd {
            margin: 2px 0 0 0;
        }

        a {
            display: inline-block;
            margin-top: 24px;
            color: #fff;
            background: #1f6feb;
            padding: 10px 18px;
            border-radius: 6px;
            text-decoration: none;
        }

        a:hover {
            background: #1558c0;
        }
    </style>
</head>

<body>
    <div class="tarjeta">
        <h1>Información recibida</h1>
        <p class="mensaje">✅ Los datos fueron recibidos mediante <strong>${metodo}</strong>.</p>

        <dl>
            <dt>Nombre</dt>
            <dd>${campo(nombre)}</dd>

            <dt>Apellido</dt>
            <dd>${campo(apellido)}</dd>

            <dt>Edad</dt>
            <dd>${campo(edad)}</dd>

            <dt>Correo electrónico</dt>
            <dd>${campo(correo)}</dd>

            <dt>Programa académico</dt>
            <dd>${campo(programa)}</dd>
        </dl>

        <a href="/">← Volver al formulario</a>
    </div>
</body>

</html>`;
}

// Página principal: sirve el formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario.html'));
});

// Ruta GET: los datos llegan en la URL (req.query)
app.get('/registro-get', (req, res) => {
    res.send(paginaRespuesta('GET', req.query));
});

// Ruta POST: los datos llegan en el cuerpo de la petición (req.body)
app.post('/registro-post', (req, res) => {
    res.send(paginaRespuesta('POST', req.body));
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
