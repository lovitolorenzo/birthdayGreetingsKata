import mongoose from "mongoose";
import { Employee as EmployeeModel } from "../models/Employee";

const EmployeeSchema = new mongoose.Schema({
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

EmployeeSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

EmployeeSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		delete ret._id;
	},
});

export const Employee = mongoose.model<EmployeeModel>("employees", EmployeeSchema, "employees");
