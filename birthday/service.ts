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
}
