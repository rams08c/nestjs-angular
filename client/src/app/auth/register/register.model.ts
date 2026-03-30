import { signal,computed } from "@angular/core"; 
import * as z from "zod";
import { APP_ERROR_MESSAGES, APP_VALIDATION } from '../../app.constant';
export interface RegisterModel {
  name: string;
  email: string;
  confirmPassword: string;
  password: string;
}

export const RegisterSchema = computed(() => z.object({
  name: z.string().min(1, {message: APP_ERROR_MESSAGES.AUTH.NAME_REQUIRED}),
  email: z.string().email({message: APP_ERROR_MESSAGES.AUTH.INVALID_EMAIL_FORMAT}),
  password: z.string().min(APP_VALIDATION.PASSWORD_MIN_LENGTH, {message: APP_ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH})
  .regex(APP_VALIDATION.PASSWORD_REGEX, {message: APP_ERROR_MESSAGES.AUTH.PASSWORD_COMPLEXITY}),
  confirmPassword: z.string().min(1, {message: APP_ERROR_MESSAGES.AUTH.CONFIRM_PASSWORD_REQUIRED}),
}).refine((data) => data.password === data.confirmPassword, {
  message: APP_ERROR_MESSAGES.AUTH.PASSWORD_MISMATCH,
  path: ["confirmPassword"],
}));


export const defaultRegisterModel: RegisterModel = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
}



export interface RegisterResponseModel {
  message: string;
  redirect: string | null;
}