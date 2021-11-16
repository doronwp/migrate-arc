import UserImporter from "./user/UserImporter.js";
import UserArcAPI from "./user/UserArcAPI.js";


const userArcAPI = new UserArcAPI(
	"https://api.sandbox.xlmedia.arcpublishing.com/author",
	"Bearer TG5SJ113QHIQ1FKKR3P6J8J66A1H3DNJlHBlDij1Nd3o0r9b8AkAYQQvwrLUueEFz7gdd4SR"
);
const userImporter = new UserImporter(
	"./resources/authors.json",
	"./resources/schema-mappings/users-to-arc-schema-map.json",
	userArcAPI
);
userImporter.import();



