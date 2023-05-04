interface SignUpUser {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  phone: string;
  phoneCode: string;
  phoneNumber: string;
  identityNumber: string;
  birthDate?: Date | null;
}

interface SignInUser {
  email: string;
  password: string;
}

export { SignUpUser, SignInUser };
