const Contenedor = require('./metodos.js')
const express = require('express')
const moment = require('moment')
const app = express()
const PORT = 8080

const contenedor = new Contenedor('prueba.txt')
console.log(contenedor.getAll())

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))


app.get('/', (solicitud, respuesta) => {
    respuesta.send('<h1 style ="color:blue">Bienvenidos al servidor express</h1>')

})


app.get('/productos', async (solicitud, respuesta) => {
    try {

        const data = await contenedor.getAll();
        console.log(data);
        respuesta.send(data)

    } catch (error) {
        throw new Error(
            `Error al mostrar los productos. Error :${error}`
        )
    }

})


app.get('/fyh', (solicitud, respuesta) => {
    respuesta.send({ fyh: moment().format('YYYY/MM/DD HH:mm:ss') })
})