import ArcAPI from "../ArcAPI.js";
import axios from "axios";

class UserArcAPI extends ArcAPI {
	data;
	constructor(baseUrl, token) {
		super(baseUrl, token);
	}

	async getAuthorService() {
		const segment = "/author/v2/author-service";
		try {
			const response = await axios.get(segment);
			this.data = response.data;
			console.log(this.data);
		} catch (error) {
			console.error(error);
		}
	}

	async insertAuthorsService(arcMappedData) {
		const segment = "/author/v2/author-service";
		let insertAuthorsPromises = [];

		for (let arcUser of arcMappedData) {
			insertAuthorsPromises.push(axios.post(segment, arcUser));
		}
		Promise.allSettled(insertAuthorsPromises)
			.then((results) => {
				for (let result of results) {

					let reason = result?.reason?.response?.data;
					if (reason) {
						console.error(`Status: ${reason.status} - Reason: ${reason.message} `);
					}
				}
			})
	}

	async deleteAuthorsService(arcMappedData) {
		const segment = "/author/v2/author-service";
		let insertAuthorsPromises = [];
		for (let arcUser of arcMappedData) {
			insertAuthorsPromises.push(axios.delete(`${segment}/${arcUser._id}`));
		}
		Promise.allSettled(insertAuthorsPromises)
			.then((results) => {
				for (let result of results) {
					let reason = result?.reason?.response?.data;
					if (reason) {
						console.error(`Status: ${reason.status} - Reason: ${reason.message} `);
					}
				}
			})
	}
}

export default UserArcAPI;