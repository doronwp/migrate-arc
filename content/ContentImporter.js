import { readFile } from "fs/promises";
import ContentANSMApper from "./ContentANSMapper.js";
import ImageImporter from "../image/ImageImporter.js";
import ImageArcAPI from "../image/ImageArcAPI.js";

class ContentImporter {
	dataFileName;

	constructor(dataFileName, schemaFileName, contentArcAPI) {

		this.contentANSMApper = new ContentANSMApper(dataFileName, schemaFileName);
		this.imageImporter = new ImageImporter(
			dataFileName,
			`./resources/${process.env.SITE_FILE_PREFIX}/schema-mappings/contents-images-schema.json`,
			`./resources/${process.env.SITE_FILE_PREFIX}/schema-mappings/content-images-to-arc-schema.json`,
			new ImageArcAPI(
				"https://api.sandbox.xlmedia.arcpublishing.com",
				"Bearer TG5SJ113QHIQ1FKKR3P6J8J66A1H3DNJlHBlDij1Nd3o0r9b8AkAYQQvwrLUueEFz7gdd4SR",
				`./resources/${process.env.SITE_FILE_PREFIX}/output-files/author-images-to-arc-map.json`
			)
		);
		this.contentArcAPI = contentArcAPI;
	}
	async import(flag = "insert", canonicalWebsite) {


		// first we need to upload all the images so we can replace the image url in the author
		// the only image key here to upload and convert is image
		//	const arcUploadedImages = await this.imageImporter.import();
		//	let arcNewContents = await this.contentANSMApper.createArcContentsJson(arcUploadedImages, this.imageImporter.imageANSMApper.schemaFilter);
		// save the new authors map to arc in file.
		//this.contentANSMApper.writeArcContentsToFile("./resources/output-files/authors-to-arc-map.json", arcNewContents);

		//console.log(JSON.stringify(await this.contentArcAPI.getContent()));
		let arcNewContents = JSON.parse(await readFile(`./resources/${process.env.SITE_FILE_PREFIX}/schema-examples/content-arc-response.json`, "utf8"));
		//console.log(arcNewContents);
		switch (flag) {
			case "insert":
				this.contentArcAPI.insertContent(canonicalWebsite, [arcNewContents]);
				break;
			case "delete":
				//	this.contentArcAPI.deleteContent(arcNewContents);
				break;
		}

	}
}

export default ContentImporter;
