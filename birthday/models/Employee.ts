import { Types } from "mongoose";

export interface EmployeeModel {
	id: Types.ObjectId;
	lastName: String;
	firstName: String;
	birthday: Date;
	email: String;
}
