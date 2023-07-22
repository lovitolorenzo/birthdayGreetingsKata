import { BirthdayGreetingService } from "./service";

export async function main(args: string[]): Promise<void> {
	const birthdayService = new BirthdayGreetingService("lovitolorenzo23@gmail.com", "smtp.gmail.com", 587);
	await birthdayService.findEmployeesBirthdaysAndSendEmails("employeeData.txt");
}
