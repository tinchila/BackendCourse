import fs from 'fs';

export default class Container {
	constructor(pathBD) {
		this.pathBD = pathBD;
	}

	//Crear File
	async createFile() {
		try {
			if (fs.existsSync(this.pathBD)) {
				return false;
			} else {
				await this.write('');
				return true;
			}
		} catch (err) {
			console.log('Error en la creación del archivo', err);
			return false;
		}
	}

	//Leer File
	async read() {
		try {
			await this.createFile()
			let file = await fs.promises.readFile(this.pathBD, 'utf-8');
			if (file === '') {
				file = [];
				return file;
			}
			else {
				let fileObj = JSON.parse(file);
				return fileObj;
			}
		} catch (error) {
			console.log(error);
		}
	}

	//Escribir File
	async write(res) {
		try {
			await fs.promises.writeFile(this.pathBD, res);
		} catch (error) {
			console.log(error);
		}
	}
	async getAll() {
		try {
			let all = await this.read();
			return all;
		} catch (error) {
			return error;
		}
	}

	//Crear ID
	generateId(obj) {
		try {
			const findId = obj.map((item) => item.id);
			let newId;
			if (findId.length == 0) {
				newId = 1;
			}
			else {
				newId = Math.max.apply(null, findId) + 1;
			}
			return newId;
		} catch (error) {
			return error;
		}
	}

	//Eliminar por ID
	async deleteById(id) {
		try {
			let products = await this.read();
			const idProduct = products.findIndex((prod) => prod.id == id);
			products.splice(idProduct, 1);
			let productsUpdated = JSON.stringify(products)
			await this.write(productsUpdated)
			return products;
		} catch (error) {
			console.log(error);
		}
	}
	getNow() {
		try {
			const now = new Date();
			return `${now.getHours()}:${now.getMinutes()}`;
		} catch (error) {
			console.log(error)
		}
	}
}

