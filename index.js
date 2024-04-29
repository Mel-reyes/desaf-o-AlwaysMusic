const { Client } = require('pg');
const process = require('process');

const argumentos = process.argv.slice(2);
const metodo = argumentos[0];
const nombre = argumentos[1];
const rut = argumentos[2];
const curso = argumentos[3];
const nivel = argumentos[4];

const config = {
    user: "melireyes",
    host: "localhost",
    database: "estudiantes",
    password: "1234",
    port: 5432,
};

const client = new Client(config);

// Manejar el evento connect para confirmar la conexión
client.on('connect', () => {
    console.log('Conexión establecida correctamente');
});

async function main() {
    try {
        await client.connect(); // Realizar la conexión con PostgreSQL
        if (metodo === 'nuevo') {
            await ingresar();
        } else if (metodo === 'rut') {
            await consultaRut();
        } else if (metodo === 'consulta') {
            await consulta();
        } else if (metodo === 'editar') {
            await editar();
        } else if (metodo === 'eliminar') {
            await eliminar();
        } else {
            console.log("Método no válido");
        }
    } catch (error) {
        console.error('Error en la ejecución:', error);
    } finally {
        await client.end();
    }
}

main();

async function ingresar() {
    const query = `INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ('${nombre}', '${rut}', '${curso}', ${nivel}) RETURNING *;`;
    const res = await client.query(query);
    console.log('Registro agregado:', res.rows[0]);
    console.log('Campos del registro:', Object.keys(res.rows[0]).join(" - "));
}

async function consultaRut() {
    const res = await client.query(`SELECT * FROM estudiantes WHERE rut='${rut}'`);
    console.log("Registros:", res.rows);
}

async function consulta() {
    const res = await client.query("SELECT * FROM estudiantes");
    console.log("Registros:", res.rows);
}

async function editar() {
    const res = await client.query(
        `UPDATE estudiantes SET nombre='${nombre}', curso='${curso}', nivel=${nivel} WHERE rut='${rut}' RETURNING *`
    );
    console.log("Registro modificado:", res.rows[0]);
    console.log("Cantidad de registros afectados:", res.rowCount);
}

async function eliminar() {
    const res = await client.query(`DELETE FROM estudiantes WHERE rut='${rut}'`);
    console.log("Cantidad de registros afectados:", res.rowCount);
}

