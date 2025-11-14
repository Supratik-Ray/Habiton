"use server";

import { auth } from "@/lib/auth";
import {
  ZodErrors,
  SignupField,
  ActionResponse,
  SigninField,
} from "@/lib/types";
import {
  signinSchema,
  signupSchema,
  TsigninSchema,
  TsignupSchema,
} from "@/lib/validators";
import { APIError } from "better-auth";
import { headers } from "next/headers";

type SignupErrors = ZodErrors<SignupField>;
type SigninErrors = ZodErrors<SigninField>;

export async function signUpAction(
  formData: TsignupSchema
): ActionResponse<SignupErrors> {
  const result = signupSchema.safeParse(formData);
  if (!result.success) {
    const zodErrors: SignupErrors = {};
    result.error.issues.forEach(
      (issue) => (zodErrors[issue.path[0] as SignupField] = issue.message)
    );
    return { success: false, errors: zodErrors };
  }

  const { name, email, password } = formData;
  try {
    await auth.api.signUpEmail({ body: { name, email, password } });
    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: "Email already exists!" };
    }
    return { success: false, error: "Some error occured!" };
  }
}

export async function signInAction(
  formData: TsigninSchema
): ActionResponse<SigninErrors> {
  const result = signinSchema.safeParse(formData);

  if (!result.success) {
    const zodErrors: SigninErrors = {};
    result.error.issues.forEach(
      (issue) => (zodErrors[issue.path[0] as SigninField] = issue.message)
    );

    return { success: false, errors: zodErrors };
  }
  const { email, password } = formData;
  try {
    await auth.api.signInEmail({ body: { email, password } });
    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: "Invalid credentials!" };
    }
    return { success: false, error: "some error occured!" };
  }
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
}
