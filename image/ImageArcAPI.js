import ArcAPI from "../ArcAPI.js";
import axios from "axios";
import FormData from 'form-data';
import fs from 'fs';

class ImageArcAPI extends ArcAPI {
	data;
	imageANSMApper;
	arcImagesFileName;

	constructor(baseUrl, token, arcImagesFileName) {
		super(baseUrl, token);
		this.arcImagesFileName = arcImagesFileName;
	}

	setImageMapper(imageANSMApper) {
		this.imageANSMApper = imageANSMApper;
		this.imageANSMApper.initImageRespomseDataArr();
	}

	async getImageList() {
		const segment = "/photo/api/v2/photos";
		try {
			const response = await axios.get(segment);
			this.data = response.data;
			console.log(this.data);
		} catch (error) {
			console.error(error);
		}
	}

	uploadImage(segment, arcImage) {

		let data = new FormData();
		data.append('file', fs.createReadStream(`./resources/${arcImage}`));
		return axios.post(segment, data, {
			headers: {
				'accept': 'application/json',
				'Accept-Language': 'en-US,en;q=0.8',
				'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
			}
		});

	}
	async insertImage(arcMappedData) {
		const segment = "/photo/api/v2/photos";
		let insertAuthorsPromises = [];

		if (arcMappedData.length === 0) {
			return;
		}

		for (let arcImages of arcMappedData) {
			for (let [key, arcImage] of Object.entries(arcImages)) {
				insertAuthorsPromises.push(this.uploadImage(segment, arcImage));
			}
		}
		await Promise.allSettled(insertAuthorsPromises)
			.then((results) => {
				for (let result of results) {
					let responseData = result?.value?.data;
					if (responseData) {
						const imageResponseData = {
							"_id": responseData._id,
							"originalName": responseData?.additional_properties?.originalName,
							"originalUrl": responseData?.additional_properties?.originalUrl
						};
						this.imageANSMApper.pushImageResponseData(imageResponseData);

					}
					let reason = result?.reason?.response?.data;
					if (reason) {
						console.error(`Status: ${reason.status} - Reason: ${reason.message} `);
					}
				}
			})
		await this.imageANSMApper.writeImageResponseDataArr(this.arcImagesFileName);

	}

	async deleteImagesService(arcMappedData) {
		/*	const segment = "/photo/api/v2/author-service";
	
			let insertAuthorsPromises = [];
	
			for (let arcImage of arcMappedData) {
				insertAuthorsPromises.push(axios.delete(`${segment}/${arcImage._id}`));
			}
			Promise.allSettled(insertAuthorsPromises)
				.then((results) => {
					for (let result of results) {
	
						let reason = result?.reason?.response?.data;
						if (reason) {
							console.error(`Status: ${reason.status} - Reason: ${reason.message} `);
						}
					}
				})*/
	}
}

export default ImageArcAPI;