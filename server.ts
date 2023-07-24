import "reflect-metadata";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

(async () => {
	try {
		if (!process.env.DATABASE_URL || !process.env.DATABASE_NAME) {
			throw new Error("Missing DB env vars");
		}
		await mongoose.connect(process.env.DATABASE_URL, { dbName: process.env.DATABASE_NAME });
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();
