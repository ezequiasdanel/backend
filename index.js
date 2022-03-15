const express = require ('express')
const { Router } = express
const PORT = 8080
const app = express()
const router = Router()
const Products = require("./prod/productos")


app.use(express.static('public'));
app.use(express.urlencoded({extended : true}))
app.use('/api/products', router)

const storeProductos = new Products()

router
    .get('/', (req,res) =>{
        try {
            res.status(200).json(storeProductos.productsAll)
        } catch (error) {
            res.status(500).json(error.message)
        }
    })
    .get('/:idProduct', (req,res) =>{
        try {
            const product = storeProductos.getProductById(req.params.idProduct)
            if (product) {
                return res.status(200).json(product)
            } 
            return res.status(404).json({error:'producto no encontrado'})
        } catch (error) {
            res.status(500).json(error.message)
        }
    })
    .post('/',(req,res)=>{
        try {   
            if(req.body.title && req.body.price){
                const product = storeProductos.saveProduct(req.body)
                res.status(201).json(product)
            }else{
                res.status(400).json({
                    error: 'complete los datos requeridos'
                })
            }
            
        } catch (error) {
            res.status(500).json(error.message)
        }
    })
    .put('/:idProduct', (req,res) =>{
         try {
             const id = Number(req.params.id)
             const producto = storeProductos.updateProductById(id,req.body)
             res.status(200).json(producto)
         } catch (error) {
             res.status(500).json(error.message)
         }
    })
    .delete('/:idProduct', (req,res)=>{
        try {
            const id = Number(req.params.idProduct)
            storeProductos.deleteProductById(id)
            res.status(200).json("Eliminado")
        } catch (error) {
            res.status(500).json(`No se pudo borrar el producto ${error.message}`)
        }

    })
 

    const server = app.listen(PORT,()=> console.log(`servidor corriendo en el puerto ${PORT}`))
    server.on('error',(err) =>console.log(err.message))