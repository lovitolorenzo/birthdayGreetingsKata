import { Types } from "mongoose";

export interface Employee {
	id: Types.ObjectId;
	lastName: String;
	firstName: String;
	birthday: Date;
	email: String;
}
