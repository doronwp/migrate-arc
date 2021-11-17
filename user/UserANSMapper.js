import { writeFile, readFile } from "fs/promises";
import isHtml from 'is-html';
import { convert } from 'html-to-text';

class UserANSMApper {
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
	createArcUser(user, arcUploadedImages, schemaFilterFileName) {
		let newUser = {};
		for (let [key, attribute] of Object.entries(user)) {
			// map only keys that in schema
			if (this.schema[key]) {
				if (schemaFilterFileName[key] && attribute != null) {
					newUser[this.schema[key]] = attribute;
					let newImageUrl = this.getArcImageUrl(arcUploadedImages, attribute);

					if (newImageUrl) {
						newUser[this.schema[key]] = newImageUrl;
					} else {
						newUser[this.schema[key]] = attribute;
					}
				} else {
					if (attribute != null && isHtml(attribute)) {
						const text = convert(attribute, {
							wordwrap: 130
						});

						newUser[this.schema[key]] = text;
					} else {
						newUser[this.schema[key]] = attribute;
					}
				}
			}
		}

		return newUser;
	}

	async createArcUsersJson(arcUploadedImages, schemaFilterFileName) {
		await this.loadSchema();
		await this.loadData();
		let arcNewUsers = [];
		for (const user of this.data) {
			let arcNewUser = this.createArcUser(user, arcUploadedImages, schemaFilterFileName);
			arcNewUsers.push(arcNewUser);
		}

		return arcNewUsers;
	}

	async writeArcUsersTpFile(fileName, arcNewUsers, flag = 'w') {
		await writeFile(fileName, JSON.stringify(arcNewUsers), { flag })
	}
}


export default UserANSMApper;