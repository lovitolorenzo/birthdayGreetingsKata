import * as fs from "fs";
import { createTransport, Transporter } from "nodemailer";

interface Employee {
	firstName: string;
	lastName: string;
	email: string;
	birthday: string;
}

export class BirthdayService {
	private senderEmail: string;
	private smtpHost: string;
	private smtpPort: number;

	constructor(senderEmail: string, smtpHost: string, smtpPort: number) {
		this.senderEmail = senderEmail;
		this.smtpHost = smtpHost;
		this.smtpPort = smtpPort;
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
