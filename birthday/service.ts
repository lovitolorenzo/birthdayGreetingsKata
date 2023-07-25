import * as fs from "fs";
import { createTransport, Transporter } from "nodemailer";
import { google } from "googleapis";
import path from "path";
import dotenv from "dotenv";

import { EmployeesSchema } from "./schema/employees";
import { EmployeeModel } from "./models/Employee";

dotenv.config();

export interface Employee {
	firstName: string;
	lastName: string;
	email: string;
	birthday: Date;
}

const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export class BirthdayGreetingService {
	private senderEmail: string;

	constructor(senderEmail: string) {
		this.senderEmail = senderEmail;
	}

	// Compares today's date to employee's birthday
	public isTodayBirthday(today: Date, birthday: Date): boolean {
		return today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate();
	}

	// Checks if is a leap year
	private isLeapYear(today: Date): boolean {
		const year = today.getFullYear();

		// If there is no rest from year % 4 then true will be returned else It will be false
		return year % 4 === 0;
	}

	public async parseEmployeesDataFromFs(fileName: string): Promise<Employee[]> {
		try {
			const today = new Date();

			// Fetches data from the file
			const data = fs.readFileSync(path.join(__dirname, fileName), "utf-8");

			// Gets the lines where each line is a different employee
			const lines = data.match(/[^\r\n]+/g);

			if (!lines) return [];

			let employees: Employee[] = [];

			for (const line of lines) {
				// Retrieves employee's data based on their position, assuming they follow the same pattern as last_name, first_name, date_of_birth, email
				const [lastName, firstName, birthday, email] = line.split(", ");

				// Gets year, month and day from birthday's string and convert them into a Date type
				const [year, month, day] = birthday.split("/").map((dateElement) => Number(dateElement));
				let birthdayDate = new Date(year, month - 1, day); // Months in javascript's Date are 0 indexed

				// Checks if it's a non-leap year and the birthday is on February 29
				// Months are 0 indexed so February will be 1
				if (
					today.getMonth() === 1 &&
					today.getDate() === 28 &&
					!this.isLeapYear(today) &&
					birthdayDate.getDate() === 29 &&
					birthdayDate.getMonth() === 1
				) {
					birthdayDate = new Date(birthdayDate.getFullYear(), birthdayDate.getMonth(), 28); // Sets to February 28
				}

				employees.push({ firstName, lastName, birthday: birthdayDate, email });
			}

			return employees;
		} catch (error) {
			console.error("Error reading or processing file: ", error);
			return [];
		}
	}

	public async findInMongoDbEmployeesBirthdaysAndSendEmails(): Promise<Employee[]> {
		try {
			const today = new Date();

			// Fetches data from DB's collection
			const employees: EmployeeModel[] = await EmployeesSchema.find();

			// Gets the employees
			if (employees.length === 0) return [];

			let toSendEmails: Employee[] = [];
			let sentEmailsTo: Employee[] = [];

			for (const employee of employees) {
				const { lastName, firstName, email } = employee;
				let { birthday } = employee;

				// Checks if it's a non-leap year and the birthday is on February 29
				// Months are 0 indexed so February will be 1
				if (
					today.getMonth() === 1 &&
					today.getDate() === 28 &&
					!this.isLeapYear(today) &&
					birthday.getDate() === 29 &&
					birthday.getMonth() === 1
				) {
					birthday = new Date(birthday.getFullYear(), birthday.getMonth(), 28); // Sets to February 28
				}

				// If It finds the birthday then It saves the person
				if (this.isTodayBirthday(today, birthday)) {
					{
						toSendEmails.push({
							firstName: firstName.toString(),
							lastName: lastName.toString(),
							birthday: birthday,
							email: email.toString(),
						});
					}
				}
			}

			// Executes all togheter the email sending
			await Promise.all(
				toSendEmails.map(async (emailData) => {
					const sentEmail = await this.sendBirthdayEmail(this.senderEmail, emailData);
					sentEmail && sentEmailsTo.push(emailData);
				}),
			);

			return sentEmailsTo;
		} catch (error) {
			console.error("Error reading or processing file: ", error);
			return [];
		}
	}

	public async sendBirthdayEmail(senderEmail: string, employeeData: Employee): Promise<boolean> {
		// Creates a mail transporter
		const transporter: Transporter = createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: process.env.GMAIL_EMAIL,
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: process.env.ACCESS_TOKEN,
			},
		});

		// Constructs the message
		const message = {
			from: senderEmail,
			to: employeeData.email,
			subject: "Happy Birthday!",
			text: `Happy Birthday, dear ${employeeData.firstName}`,
		};

		try {
			// Sends the mail
			await transporter.sendMail(message);
			return true;
		} catch (error) {
			console.error("Error sending email: ", error);
			return false;
		}
	}
}
