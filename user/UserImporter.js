import { readFile } from "fs/promises";
import UserANSMApper from "./UserANSMapper.js";
import ImageImporter from "../image/ImageImporter.js";
import ImageArcAPI from "../image/ImageArcAPI.js";

class UserImporter {
	dataFileName;

	constructor(dataFileName, schemaFileName, userArcAPI) {

		this.userANSMApper = new UserANSMApper(dataFileName, schemaFileName);
		this.imageImporter = new ImageImporter(
			dataFileName,
			"./resources/schema-mappings/users-images-schema.json",
			"./resources/schema-mappings/user-images-to-arc-schema.json",
			new ImageArcAPI(
				"https://api.sandbox.xlmedia.arcpublishing.com",
				"Bearer TG5SJ113QHIQ1FKKR3P6J8J66A1H3DNJlHBlDij1Nd3o0r9b8AkAYQQvwrLUueEFz7gdd4SR",
				"./resources/output-files/author-images-to-arc-map.json"
			)
		);
		this.userArcAPI = userArcAPI;
	}
	async import(flag = "insert") {
		// first we need to upload all the images so we can replace the image url in the author
		// the only image key here to upload and convert is image
		const arcUploadedImages = await this.imageImporter.import();
		let arcNewUsers = await this.userANSMApper.createArcUsersJson(arcUploadedImages, this.imageImporter.imageANSMApper.schemaFilter);
		// save the new authors map to arc in file.
		this.userANSMApper.writeArcUsersTpFile("./resources/output-files/authors-to-arc-map.json", arcNewUsers);

		switch (flag) {
			case "insert":
				this.userArcAPI.insertAuthorsService(arcNewUsers);
				break;
			case "delete":
				this.userArcAPI.deleteAuthorsService(arcNewUsers);
				break;
		}



	}
}

export default UserImporter;
