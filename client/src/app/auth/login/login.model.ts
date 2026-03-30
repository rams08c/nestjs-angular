import { computed } from '@angular/core';
import * as z from 'zod';
import { APP_ERROR_MESSAGES, APP_VALIDATION } from '../../app.constant';

export interface LoginModel {
  email: string;
  password: string;
}

export const LoginSchema = computed(() =>
  z.object({
    email: z
      .string()
      .min(1, { message: APP_ERROR_MESSAGES.AUTH.EMAIL_REQUIRED })
      .email({ message: APP_ERROR_MESSAGES.AUTH.INVALID_EMAIL_FORMAT }),
    password: z
      .string()
      .min(APP_VALIDATION.PASSWORD_MIN_LENGTH, {
        message: APP_ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH,
      })
      .regex(APP_VALIDATION.PASSWORD_REGEX, {
        message: APP_ERROR_MESSAGES.AUTH.PASSWORD_COMPLEXITY,
      }),
  }),
);

export const defaultLoginModel: LoginModel = {
  email: '',
  password: '',
};
