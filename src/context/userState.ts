import { atom } from 'recoil';

export interface User {
  cpf: string;
  isValid: boolean;
  phone?: string;
}

export const userState = atom<User>({
  key: 'userState',
  default: {
    cpf: '',
    isValid: true,
    phone: '',
  },
});
