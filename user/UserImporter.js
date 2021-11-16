import { readFile } from "fs/promises";
import UserANSMApper from "./UserANSMapper.js";


class UserImporter {
	dataFileName;

	constructor(dataFileName, mappingFilePath, userArcAPI) {
		this.dataFileName = dataFileName;
		this.userANSMApper = new UserANSMApper(mappingFilePath);
		this.userArcAPI = userArcAPI;
	}
	async import() {
		const users = JSON.parse(await readFile(this.dataFileName, "utf8"));
		console.log(await this.userArcAPI.getAuthorService());
	}
}

export default UserImporter;
