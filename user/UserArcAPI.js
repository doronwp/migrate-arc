import ArcAPI from "../ArcAPI.js";
import axios from "axios";

class UserArcAPI extends ArcAPI {

	constructor(baseUrl, token) {
		super(baseUrl, token);
	}

	async getAuthorService() {
		const segment = "/v2/author-service";
		try {
			const response = await axios.get(segment);
			console.log(response);
		} catch (error) {
			console.error(error);
		}
	}

}

export default UserArcAPI;