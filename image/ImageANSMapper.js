import { readFile, writeFile } from "fs/promises";
import fs from "fs";

class ImageANSMApper {
	schema;
	schemaFilter;
	data;
	schemaFilterFileName;
	dataFileName;
	arcUploadedImages // map of uploaded images to arc
	imageResponseDataArr; // an array that holds the image upload data to arc
	IMAGES_DIR_NAME = "uploads";
	IMAGES_DIR_PATH = "./resources/uploads";
	/**
	 * 
	 * @param {*} dataFileName  
	 * @param {*} schemaFilterFileName holds the filter schema to dataFileName 
	 * @param {*} schema holds the mapping to new arc keys
	 */
	constructor(dataFileName, schemaFilterFileName, schema) {
		this.schemaFilterFileName = schemaFilterFileName;
		this.dataFileName = dataFileName;
		this.schema = schema;
	}
	async loadSchema() {
		this.schemaFilter = JSON.parse(await readFile(this.schemaFilterFileName, "utf8"));
	}
	filterDataByKeys(data, keys) {
		let keysArr = Object.values(keys);
		let reducedData = [];
		data.forEach(dataObj => {
			let reducedDataObj = {};
			for (let i = 0; i < keysArr.length; i++) {
				if (dataObj[keysArr[i]]) {
					let imageURL = new String(dataObj[keysArr[i]]);
					// remove url because all the resources exsists locally in ./resources/uploads directory
					reducedDataObj[keysArr[i]] = imageURL.substr(imageURL.indexOf(this.IMAGES_DIR_NAME));
				}
			}

			if (Object.keys(reducedDataObj).length > 0) {
				reducedData.push(reducedDataObj);
			}

		});

		return reducedData;
	}
	async loadData() {
		this.data = JSON.parse(await readFile(this.dataFileName, "utf8"));
	}

	createArcImage(image) {
		let newImage = {};
		for (let [key, attribute] of Object.entries(image)) {
			// map only keys that in schema
			if (this.schema[key]) {
				newImage[this.schema[key]] = attribute;
			}
		}

		return newImage;
	}

	async createArcImagesJson() {
		await this.loadSchema();
		await this.loadData();
		const reducedData = this.filterDataByKeys(this.data, this.schemaFilter);
		return reducedData;

	}
	async getNewArcImages(images, arcImagesFileName) {
		//console.log(arcImagesFileName);
		// if file exists, remove the images that already uploaded to arc
		// originalName is the name of the picture and it is also the key
		if (fs.existsSync(arcImagesFileName)) {
			this.arcUploadedImages = JSON.parse(await readFile(arcImagesFileName, "utf8"));
			return images.filter(imageObj => {
				let val = this.arcUploadedImages.find(arcImage => {
					return arcImage.originalName === imageObj.image.substr(imageObj.image.lastIndexOf("/") + 1);
				})
				return val === undefined;
			})
		} else {
			return images;
		}

	}

	initImageRespomseDataArr() {
		this.imageResponseDataArr = [];
	}

	async writeImageResponseDataArr(fileName) {
		await writeFile(fileName, JSON.stringify(this.imageResponseDataArr), { flag: 'w' });
	}
	pushImageResponseData(imageResponseData) {

		if (imageResponseData) {
			this.imageResponseDataArr.push(imageResponseData);
		}
	}

	get imageResponseDataArr() {
		return this.imageResponseDataArr;
	}

	get arcUploadedImages() {
		return (async () => {
			if (!this.arcUploadedImages) {
				this.arcUploadedImages = JSON.parse(await readFile(arcImagesFileName, "utf8"));
			}

			return this.arcUploadedImages;
		})
	}

	get schemaFilterFileName() {
		return this.schemaFilterFileName;
	}

	get schemaFilter() {
		return this.schemaFilter;
	}
}


export default ImageANSMApper;