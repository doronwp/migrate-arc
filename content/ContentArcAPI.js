import { writeFile } from "fs/promises";
import ArcAPI from "../ArcAPI.js";
import axios from "axios";

class ContentArcAPI extends ArcAPI {
	data;
	constructor(baseUrl, token) {
		super(baseUrl, token);
	}

	async getContent(type = "story", id = "EO3SFNOIBJHGLOB4FNRF5ZSZB4") {
		const segment = `/draft/v1/${type}/${id}/revision/published`;
		try {
			const response = await axios.get(segment);
			this.data = response.data;
			return this.data;
		} catch (error) {
			console.error(error);
		}
	}

	async prepareDataWithNewUUID(arcMappedData, canonicalWebsite) {
		const segment = `/draft/v1/arcuuid`;
		let uuIds = [];
		let getUUIDPromises = [];
		for (let i = 0; i < arcMappedData.length; i++) {
			getUUIDPromises.push(axios.get(segment));
		}

		await Promise.allSettled(getUUIDPromises)
			.then((results) => {
				for (let result of results) {
					let reason = result?.reason?.response?.data;
					let uuId = result?.value?.data?.id;
					uuIds.push(uuId);
					if (reason) {
						console.error(`Status: ${reason.error_code} - Reason: ${reason.error_message} - requestID :  ${reason.request_id} `);
					}
				}
			})

		for (let i = 0; i < arcMappedData.length; i++) {
			arcMappedData[i]["_id"] = uuIds[i];
			arcMappedData[i]["canonical_website"] = canonicalWebsite;
		}

		return arcMappedData;
	}

	async insertContent(canonicalWebsite, arcMappedData, type = "story") {
		const segment = `/draft/v1/${type}`;
		arcMappedData = await this.prepareDataWithNewUUID(arcMappedData, canonicalWebsite);
		let insertAuthorsPromises = [];
		for (let arcContent of arcMappedData) {
			insertAuthorsPromises.push(axios.post(segment, arcContent));
		}
		await Promise.allSettled(insertAuthorsPromises)
			.then((results) => {
				for (let result of results) {
					let reason = result?.reason?.response?.data;
					let data = result?.value?.data;
					console.log(data);
					if (reason) {
						console.error(`Status: ${reason.error_code} - Reason: ${reason.error_message} - requestID :  ${reason.request_id} `);
					}
				}
			})
		await this.writeArcContentsToFile(`./resources/${process.env.SITE_FILE_PREFIX}/output-files/content-to-arc-map.json`, arcMappedData);
	}

	async writeArcContentsToFile(fileName, arcNewContents, flag = 'w') {
		await writeFile(fileName, JSON.stringify(arcNewContents), { flag })
	}

	async deleteContent(arcMappedData) {
		// const segment = "/author/v2/author-service";
		// let insertAuthorsPromises = [];
		// for (let arcContent of arcMappedData) {
		// 	insertAuthorsPromises.push(axios.delete(`${segment}/${arcContent._id}`));
		// }
		// Promise.allSettled(insertAuthorsPromises)
		// 	.then((results) => {
		// 		for (let result of results) {
		// 			let reason = result?.reason?.response?.data;
		// 			if (reason) {
		// 				console.error(`Status: ${reason.status} - Reason: ${reason.message} `);
		// 			}
		// 		}
		// 	})
	}
}

export default ContentArcAPI;