import mongoose from "mongoose";
import { BirthdayGreetingService } from "./service";
import dotenv from "dotenv";
import { Employee } from "./service";

dotenv.config();

(async function main(): Promise<void> {
	let employeeWhoReceivedGreetings: Employee[] = [];

	const birthdayService = new BirthdayGreetingService();

	const employeesFs = await birthdayService.parseEmployeesDataFromFs("employeeData.txt");

	// Replace this code with the line above to work with MongoDB setting instead of FS

	// await connectToMongoDB();

	// const employeesMongoDb = await birthdayService.parseEmployeesDataFromMongoDb();

	// mongoose.connection.close();

	const today = new Date();

	const toSendEmails = await birthdayService.findBirthdays(today, employeesFs);

	// Executes all togheter the email sending
	await Promise.all(
		toSendEmails.map(async (emailData) => {
			const sentMail = await birthdayService.sendBirthdayEmail("lovitolorenzotry@gmail.com", emailData);
			sentMail && employeeWhoReceivedGreetings.push(emailData);
		}),
	);

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
			throw new Error("Missing DB env vars!");
		}
		await mongoose.connect(process.env.DATABASE_URI, { dbName: process.env.DATABASE_NAME });
		console.log("Successfully connected with MongoDB!");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}
