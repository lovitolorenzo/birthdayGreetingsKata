import mongoose from "mongoose";
import { Employee as EmployeeModel } from "../models/Employee";

const UsersSchema = new mongoose.Schema({
	lastName: {
		type: String,
		lowercase: true,
		required: true,
	},
	firstName: {
		type: String,
		lowercase: true,
		required: true,
	},
	birthday: {
		type: Date,
		required: true,
	},
	email: {
		type: String,
		lowercase: true,
		required: true,
	},
});

UsersSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

UsersSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		delete ret._id;
	},
});

const Users = mongoose.model<EmployeeModel>("users", UsersSchema, "users");

export default Users;
