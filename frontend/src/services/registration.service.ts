import { api } from 'src/boot/axios';
import { useMockApi, wait } from 'src/services/runtime';

export type LoginType = 'email' | 'phone';

export interface RequestVerificationCodePayload {
  loginType: LoginType;
  identity: string;
}

export interface RequestVerificationCodeResult {
  requestId: string;
  debugCode?: string;
}

export interface VerifyCodePayload {
  requestId: string;
  code: string;
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestVerificationCode(
  payload: RequestVerificationCodePayload,
): Promise<RequestVerificationCodeResult> {
  if (useMockApi) {
    await wait(450);
    return {
      requestId: `mock-${Date.now()}`,
      debugCode: generateVerificationCode(),
    };
  }

  // TODO(back-end): alinhar endpoint e campos com contrato real.
  const { data } = await api.post<RequestVerificationCodeResult>('/auth/register/request-code', payload);
  return data;
}

export async function verifyRegistrationCode(payload: VerifyCodePayload): Promise<boolean> {
  if (useMockApi) {
    await wait(420);
    return payload.code.length === 6;
  }

  // TODO(back-end): endpoint de confirmacao de codigo.
  const { data } = await api.post<{ valid: boolean }>('/auth/register/verify-code', payload);
  return data.valid;
}
