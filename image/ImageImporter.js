import ImageANSMApper from "./ImageANSMapper.js";

class ImageImporter {
	dataFileName;

	constructor(dataFileName, schemaFilterFileName, schema, imageArcAPI) {

		this.imageANSMApper = new ImageANSMApper(dataFileName, schemaFilterFileName, schema);
		this.imageArcAPI = imageArcAPI;
		this.imageArcAPI.setImageMapper(this.imageANSMApper);
	}
	async import() {
		const images = await this.imageANSMApper.createArcImagesJson();
		const arcNewImages = await this.imageANSMApper.getNewArcImages(images, this.imageArcAPI.arcImagesFileName);
		await this.imageArcAPI.insertImage(arcNewImages);
		const arcImagesToOldImagesMapping = await this.imageANSMApper.arcUploadedImages;
		return arcImagesToOldImagesMapping;
	}
}

export default ImageImporter;
