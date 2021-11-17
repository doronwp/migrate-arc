import UserImporter from "./user/UserImporter.js";
import UserArcAPI from "./user/UserArcAPI.js";
import ContentImporter from "./content/ContentImporter.js";
import ContentArcAPI from "./content/ContentArcAPI.js";
import dotenv from 'dotenv'

dotenv.config()

const importUsers = (action = "insert") => {
	const userArcAPI = new UserArcAPI(
		process.env.ARC_API_BASE,
		process.env.ARC_API_TOKEN
	);
	const userImporter = new UserImporter(
		"./resources/input-files/users.json",
		"./resources/schema-mappings/users-to-arc-schema-map.json",
		userArcAPI
	);
	userImporter.import(action);
	console.log(`Authors ${action} sucess`);
}


const importContent = (action = "insert") => {

	const contentArcAPI = new ContentArcAPI(
		process.env.ARC_API_BASE,
		process.env.ARC_API_TOKEN
	);
	const contentImporter = new ContentImporter(
		"./resources/input-files/content",
		"./resources/schema-mappings/content-to-arc-schema-map.json",
		contentArcAPI
	);
	contentImporter.import(action, process.env.CANONICAL_WEBSITE);
	console.log(`Content ${action} sucess`);
}

//importUsers();
importContent();