import {
  THabitSchema,
  type TsigninSchema,
  type TsignupSchema,
} from "./validators";
import { authClient } from "./auth-client";

export type SignupField = keyof TsignupSchema;
export type SigninField = keyof TsigninSchema;
export type HabitField = keyof THabitSchema;

export type ZodErrors<Tfield extends string> = Partial<Record<Tfield, string>>;

export type ActionResponse<TfieldErrors> = Promise<
  | { success: true }
  | { success: false; errors: TfieldErrors }
  | { success: false; error: string }
>;

export type User = typeof authClient.$Infer.Session.user;
