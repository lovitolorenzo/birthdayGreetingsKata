import * as fs from "fs";
import { createTransport, Transporter } from "nodemailer";
import path from "path";

interface Employee {
	firstName: string;
	lastName: string;
	email: string;
	birthday: string;
}

export class BirthdayGreetingService {
	private senderEmail: string;
	private smtpHost: string;
	private smtpPort: number;

	constructor(senderEmail: string, smtpHost: string, smtpPort: number) {
		this.senderEmail = senderEmail;
		this.smtpHost = smtpHost;
		this.smtpPort = smtpPort;
	}

	// Compares today's date to employee's birthday
	private isTodayBirthday(today: Date, birthday: Date): boolean {
		return (
			today.getFullYear() === birthday.getFullYear() &&
			today.getMonth() === birthday.getMonth() &&
			today.getDate() === birthday.getDate()
		);
	}

	// Checks if is a leap year
	private isLeapYear(today: Date): boolean {
		const year = today.getFullYear();

		// If there is no rest from year % 4 then true will be returned else It will be false
		return year % 4 === 0;
	}

	public async findEmployeesBirthdaysAndSendEmails(fileName: string): Promise<Employee[]> {
		const today = new Date();
		// Fetches data from the file
		const data = fs.readFileSync(path.join(__dirname, fileName), "utf-8");
		// Gets the lines where each line is a different employee
		const lines = data.split("\n").slice(1);

		let sentEmailsTo: Employee[] = [];

		for (const line of lines) {
			// Retrieves employee's data based on their position, assuming they follow the same pattern as last_name, first_name, date_of_birth, email
			const [lastName, firstName, email, birthday] = line.split(", ");

			// Gets year, month and day from birthday's string and convert them into a Date type
			const [year, month, day] = birthday.split("/").map((dateElement) => Number(dateElement));
			let birthdayDate = new Date(year, month, day);

			// Checks if it's a non-leap year and the birthday is on February 29
			// Months are 0 indexed so February will be 1
			if (!this.isLeapYear(today) && birthdayDate.getDate() === 29 && birthdayDate.getMonth() === 1) {
				birthdayDate = new Date(year, month, 28); // Set to February 28
			}

			// If It finds the birthday then It builds up the payload to send the email to the birthday person
			if (this.isTodayBirthday(today, birthdayDate)) {
				sentEmailsTo.push({ firstName, lastName, email, birthday });
			}
		}

		// Executes all togheter the email sending
		await Promise.all(
			sentEmailsTo.map((emailData) =>
				this.sendBirthdayEmail(this.senderEmail, emailData, this.smtpHost, this.smtpPort),
			),
		);

		return sentEmailsTo;
	}

	public async sendBirthdayEmail(
		senderEmail: string,
		employeeData: Employee,
		smtpHost: string,
		smtpPort: number,
	): Promise<void> {
		// Creates a mail transporter
		const transporter: Transporter = createTransport({
			host: smtpHost,
			port: smtpPort,
			secure: false, // Sets this to true if using SSL
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
			const sentEmail = await transporter.sendMail(message);
			console.log("Email correctly sned : ", sentEmail);
		} catch (error) {
			console.error("Error sending email: ", error);
		}
	}
}
