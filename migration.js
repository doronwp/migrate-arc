import { readFile } from "fs.promise";

class UserImporter {
	constructor(fileName) {
		this.fileName = fileName
	}
	async import() {
		await readFile(this.fileName, "utf8");
	}

	get fileName() {
		return this.fileName;
	}
}


const userImporter = new UserImporter("./resources/authors.json");
userImporter.import();



