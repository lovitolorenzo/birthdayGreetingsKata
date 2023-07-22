import { BirthdayGreetingService } from "./service";

(async function main(): Promise<void> {
	const birthdayService = new BirthdayGreetingService("lovitolorenzo23@gmail.com", "smtp.gmail.com", 587);
	const employeeWhoReceivedGreetings = await birthdayService.findEmployeesBirthdaysAndSendEmails("./employeeData.txt");

	console.log(
		employeeWhoReceivedGreetings
			? `Employees who have received the greetings email: ${employeeWhoReceivedGreetings
					.map((employee) => `${employee.firstName} ${employee.lastName}`)
					.join(", ")}`
			: `No employees have received the greetings email!`,
	);
})();
