import axios from "axios";

class ArcAPI {
	baseUrl;
	token;
	constructor(baseUrl, token) {
		this.baseUrl = baseUrl;
		this.token = token;
		axios.defaults.baseURL = this.baseUrl;
		axios.defaults.headers.common['Authorization'] = this.token;
	}
}

export default ArcAPI;