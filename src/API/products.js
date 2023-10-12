
import Container from './container.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

class Products extends Container {
    constructor() {
        const currentFileURL = import.meta.url
        const currentFilePath = fileURLToPath(currentFileURL)
        super(`${dirname(currentFilePath)}/dataBase/products.json`)
    }

    async save(obj) {
        try {
            await this.createFile(this.pathBD);
            let res = await this.read();
            const id = this.generateId(res);
            console.log(id)
            const product = {
                ...obj,
                id: id,
                timeStamp: this.getNow(),
            };
            res.push(product);
            this.write(JSON.stringify(res));
            return product;
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try {
            let res = await this.read();
            for (let el of res) {
                if (id == el['id']) {
                    return el;
                }
            }
            throw `El Producto con el ID: ${id} no fue encontrado`;
        } catch (error) {
            return error;
        }
    }

    //Actualizar Products
    async update(obj) {
        try {
            let products = await this.read();
            products.splice(obj.id - 1, 1, obj);
            products = JSON.stringify(products)
            await this.write(products)
            return obj;
        } catch (error) {
            return error;
        }
    }


}

const product = new Products()


export default product