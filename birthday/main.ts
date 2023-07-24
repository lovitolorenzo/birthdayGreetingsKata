import mongoose from "mongoose";
import { BirthdayGreetingService } from "./service";
import dotenv from "dotenv";

dotenv.config();

(async function main(): Promise<void> {
	const birthdayService = new BirthdayGreetingService("lovitolorenzo23@gmail.com");

	// const employeeWhoReceivedGreetings = await birthdayService.findInFsEmployeesBirthdaysAndSendEmails(
	// 	"employeeData.txt",
	// );

	await connectToMongoDB();

	const employeeWhoReceivedGreetings = await birthdayService.findInMongoDbEmployeesBirthdaysAndSendEmails();

	mongoose.connection.close();

	console.log(
		employeeWhoReceivedGreetings.length > 0
			? `Employees who have received the greetings email: ${employeeWhoReceivedGreetings
					.map((employee) => `${employee.firstName} ${employee.lastName}`)
					.join(", ")}`
			: `No employees have received the greetings email!`,
	);
})();

export async function connectToMongoDB(): Promise<void> {
	try {
		if (!process.env.DATABASE_URI || !process.env.DATABASE_NAME) {
			throw new Error("Missing DB env vars");
		}
		await mongoose.connect(process.env.DATABASE_URI, { dbName: process.env.DATABASE_NAME });
		console.log("Connection with Mongodb successful");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}
