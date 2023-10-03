
import product from '../API/products.js';
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

class Cart {
    constructor() {
        const currentFileURL = import.meta.url;
        const currentFilePath = fileURLToPath(currentFileURL);
        this.pathBD = `${dirname(currentFilePath)}/dataBase/cart.json`;
    }

    //Crear Carrito
    async createCart() {
        try {
            let res = await this.read();
            const id = this.generateId(res);
            const oldObj = { id: 1 }
            const newObj = { ...oldObj, id: 2, nombre: 'new' }
            console.log([oldObj, newObj])
            const cart = {
                id: id,
                timeStamp: this.getNow(),
                productos: []
            };
            res.push(cart)
            this.write(JSON.stringify(res))
            return res
        } catch (error) {
            console.log(error)
        }
    }

    // Mostrar Productos del Carrito
    async showProducts(id) {
        try {
            const cartObj = await this.read();
            const idCart = cartObj.findIndex(cart => cart.id == id);
            return (cartObj[idCart]) === undefined ? `No existe el ID ${id}` : cartObj[idCart].productos
        } catch (error) {
            console.log(error)
        }
    }

    // Leer Productos por BD
    async readProducts() {
        try {
            await product.createFile()
            const products = await fs.promises.readFile(product.pathBD, 'utf-8');
            if (products === '') {
                return 'No existen productos en la base de datos';
            }
            const productObject = JSON.parse(products)
            return productObject
        } catch (error) {
            console.error('Ocurrió un error:', error);
        }
    }


    //Agregar Productos por ID
    async addProducts(id, idProducts) {
        try {
            const productsBd = await this.readProducts()
            const arrayProducts = await this.listProducts(idProducts, productsBd)
            const productObject = await this.read();
            const idCart = productObject.findIndex(cart => cart.id == id);
            let keyProducts = productObject[idCart].productos;      
            let updateArrayProducts = [...keyProducts, ...arrayProducts]
            productObject[idCart].productos = updateArrayProducts
            this.write(JSON.stringify(productObject))
            return productObject
        } catch (error) {
            console.log(error)
        }
    }

    //Lista de Productos
    async listProducts(idProducts, prodObj) {
        try {
            const arrayProduct = []
            for (let id of idProducts) {
                for (let product of prodObj) {
                    if (id == product.id) {
                        arrayProduct.push(product)
                    }
                }
            }
            return arrayProduct
        } catch (error) {
            console.log(error)
        }
    }

    //Eliminar Productos
    async deleteProduct(id, idProduct) {
        try {
            const products = await this.showProducts(id)
            const idProdDelete = products.findIndex(prod => prod.id == idProduct)
            products.splice(idProdDelete, 1)
            console.log(products)
            const cartObj = await this.read()
            const idCart = cartObj.findIndex(cart => cart.id == id);
            cartObj[idCart].productos = products;
            this.write(JSON.stringify(cartObj))
            return cartObj
        } catch (error) {
            console.log(error)
        }
    }
}

export default Cart;