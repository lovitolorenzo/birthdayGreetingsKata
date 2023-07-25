import mongoose from "mongoose";
import { BirthdayGreetingService } from "./service";
import dotenv from "dotenv";
import { Employee } from "./service";

dotenv.config();

(async function main(): Promise<void> {
	let employeeWhoReceivedGreetings: Employee[] = [];

	const birthdayService = new BirthdayGreetingService("lovitolorenzotry@gmail.com");

	const employeesFs = await birthdayService.parseEmployeesDataFromFs("employeeData.txt");

	const today = new Date();

	const toSendEmails = await birthdayService.findBirthdays(today, employeesFs);

	// Executes all togheter the email sending
	await Promise.all(
		toSendEmails.map(async (emailData) => {
			const employeesFs = await birthdayService.sendBirthdayEmail("lovitolorenzotry@gmail.com", emailData);
			employeesFs && employeeWhoReceivedGreetings.push(emailData);
		}),
	);

	// await connectToMongoDB();

	//  const employeeWhoReceivedGreetings = await birthdayService.findInMongoDbEmployeesBirthdaysAndSendEmails();

	// mongoose.connection.close();

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
