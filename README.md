# Birthday Greetings Kata

A simple application that sends birthday greetings to employees based on their birthdates.

## Overview

The "birthdayGreetingsKata" app is designed to automate the process of sending birthday greetings to employees. It reads employee data from a file, checks if any employees have a birthday on the current day, and sends them personalized greetings via email.

## Features

- Reads employee data from a file.
- Checks if any employees have a birthday on the current day.
- Sends personalized birthday greetings via email.

## Installation

1. Clone the repository: `git clone https://github.com/lovitolorenzo/birthdayGreetingsKata.git`
2. Navigate to the project directory: `cd birthdayGreetingsKata`
3. Install the required dependencies: `npm install`

## Usage

1. Prepare a file with employee data. The file should have the following columns: `first_name`, `last_name`, `date_of_birth`, `email`.
2. Place the file in the project directory or use the one yet in it.
3. Set up the following environment variables:
   - `GMAIL_EMAIL`: Your Gmail email address.
   - `GMAIL_PASSWORD`: Your Gmail password.
   - `REFRESH_TOKEN`: OAuth2 refresh token for Gmail authentication.
   - `ACCESS_TOKEN`: OAuth2 access token for Gmail authentication.
4. Run the app: `npm run build` and `npm run start`
5. The app will automatically send birthday greetings to employees whose birthday is on the current day.

## Contributing

Contributions are welcome! If you find a bug or have a suggestion, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contact

For any questions or inquiries, please contact [lovitolorenzojob@gmail.com](mailto:lovitolorenzojob@gmail.com).
