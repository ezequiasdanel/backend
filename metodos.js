const fs = require('fs');
const objetos = { nombre: 'Escuadra', precio: 323.45 };
const objetos1 = { nombre: 'pantalon', precio: 323.45 };
const objetos2 = { nombre: 'cc', precio: 323.45 };

module.exports = class Contenedor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
        this.contenidoArchivo = [];
        this.id = 0;
    }
    //verificando si existe el archivo; sino, lo crea y lo devuelve.
    async createIfNotExist() {
        let file;
        try {
            file = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            return file;
        } catch (error) {
            if (error.code === "ENOENT") {
                await fs.promises.writeFile(this.nombreArchivo, "[]");
                file = await fs.promises.readFile(this.nombreArchivo, "utf-8");

            } else {
                console.log(error);
            }
        }
        console.log(file);
        return (file);
    }
    //1. métódo save: Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
    async save(object) {
        this.id++;
        this.contenidoArchivo.push({ ...object, id: this.id });
        try {
            await fs.promises.appendFile(
                this.nombreArchivo,
                JSON.stringify(this.contenidoArchivo, null, 2)
            );
            console.log(`Se guardo el producto con id ${this.id}`);
        } catch (error) {
            throw new Error(
                `Error al escribir en el archivo ${this.nombreArchivo} dentro de cathc en metodo save,${error}`
            );
        }
    }

    //Metodo getById(): Recibe un id y devuelve el onjeto con ese id, o null si no esta.
    async getById(id) {
        try {
            const data = await this.createIfNotExist();
            const product = JSON.parse(data);
            const productId = product.find((p) => p.id === id);
            if (productId) {
                console.log(`Se encontro el producto con el id${id}`);
                return productId;
            } else {
                console.log("no existe el producto con id:" + id);
                return null
            }
        } catch (error) {
            console.log(error);
        }
    }
    //3. getAll(): Devuelve un array con los objetos presentes en el archivo.
    async getAll() {
        try {
            const data = await fs.promises.readFile(this.nombreArchivo, "utf-8");
            if (data) {
                /* ----------- si data tiene info parseo y hago un map de la info ----------- */
                /* -- ese mismo map me sirve luego para agregar nuevo Objeto sin pisar la info q ya tengo xq uso WriteFile en lugar de append... -- */
                this.contenidoArchivo = JSON.parse(data);
                //   this.contenidoArchivo.map((producto) => {
                // (this.id < producto.id) this.id = producto.id;
                //     });
                return this.contenidoArchivo;
            }
        } catch (error) {
            throw new Error(
                `Error al leer el archivo ${this.nombreArchivo} en catch metodo getAll, ${error}`
            )
        }
    }

    //4. deleteById(): Elimina del archivo el objeto con el id buscado.
    async deleteById(id) {
        try {
            const txt = await fs.promises.readFile(this.nombreArchivo, "utf-8");
            const parsedFile = JSON.parse(txt);
            const result = parsedFile.filter((p) => p.id !== id);
            await fs.promises.writeFile(
                this.nombreArchivo,
                JSON.stringify(result, null, 2)
            );
            console.log(`Se elimino el producto con id ${id}`)
        } catch (error) {
            throw new Error(
                `Error al eliminar el producto con id ${id} en catch metodo deleteById. ${error}`
            );
        }
    }
    //5. deleteAll(): Elimina todos los objetos del archivo.

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.nombreArchivo, "");
            console.log("Se eliminaron todos los productos");
            return "";
        } catch (error) {
            throw new Error(
                `Error al eliminar todos los productos en catch metodo deleteAll, ${error}`
            );
        }
    }
}


// const c = new Contenedor('prueba.txt')

// c.save(objetos)
// c.save(objetos1)
// c.save(objetos2)
// // c.deleteAll()