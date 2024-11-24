"use server";
import { AuthenticationAction, signIn, signOut } from "@/lib/auth";
import { RegisterSchema, registerSchema } from "@/schemas/register-schema";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { LoginSchema } from "@/schemas/login-form";

export async function signInAction(type: AuthenticationAction) {
  await signIn(type, { redirectTo: "/auth-callback" });
}

export async function loginAction(data: LoginSchema) {
  await signIn("credentials", data);
}

export async function registerAction(data: RegisterSchema) {
  const validatedData = registerSchema.safeParse(data);

  if (!validatedData.success) {
    throw new Error("Data provided was not valid");
  }

  const { name, email, password } = validatedData.data;
  const isUserExist = await db.user.findUnique({ where: { email } });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await db.user.create({
    data: { name, email, password: hashedPassword },
  });

  return user;
}

export async function signOutAction() {
  await signOut();
}
