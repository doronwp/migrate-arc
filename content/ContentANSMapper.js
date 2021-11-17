import { writeFile, readFile } from "fs/promises";
import isHtml from 'is-html';
import { convert } from 'html-to-text';

class ContentANSMApper {
	schema;
	data;
	schemaFileName;
	dataFileName;

	constructor(dataFileName, schemaFileName) {
		this.schemaFileName = schemaFileName;
		this.dataFileName = dataFileName;
	}
	async loadSchema() {
		this.schema = JSON.parse(await readFile(this.schemaFileName, "utf8"));
	}

	async loadData() {
		this.data = JSON.parse(await readFile(this.dataFileName, "utf8"));
	}

	getArcImageUrl(arcUploadedImages, attribute) {
		const imageName = attribute.substr(attribute.lastIndexOf("/") + 1);
		const arcImage = arcUploadedImages.find(arcUploadedImage => {
			return arcUploadedImage.originalName === imageName;
		})
		return arcImage.originalUrl;
	}
	createArcContent(content, arcUploadedImages, schemaFilterFileName) {
		let newContent = {};
		for (let [key, attribute] of Object.entries(content)) {
			// map only keys that in schema
			if (this.schema[key]) {
				if (schemaFilterFileName[key] && attribute != null) {
					newContent[this.schema[key]] = attribute;
					let newImageUrl = this.getArcImageUrl(arcUploadedImages, attribute);

					if (newImageUrl) {
						newContent[this.schema[key]] = newImageUrl;
					} else {
						newContent[this.schema[key]] = attribute;
					}
				} else {
					if (attribute != null && isHtml(attribute)) {
						const text = convert(attribute, {
							wordwrap: 130
						});

						newContent[this.schema[key]] = text;
					} else {
						newContent[this.schema[key]] = attribute;
					}
				}
			}
		}

		return newContent;
	}

	async createArcContentsJson(arcUploadedImages, schemaFilterFileName) {
		await this.loadSchema();
		await this.loadData();
		let arcNewContents = [];
		for (const content of this.data) {
			let arcNewContent = this.createArcContent(content, arcUploadedImages, schemaFilterFileName);
			arcNewContents.push(arcNewContent);
		}

		return arcNewContents;
	}

	async writeArcContentsToFile(fileName, arcNewContents, flag = 'w') {
		await writeFile(fileName, JSON.stringify(arcNewContents), { flag })
	}
}


export default ContentANSMApper;