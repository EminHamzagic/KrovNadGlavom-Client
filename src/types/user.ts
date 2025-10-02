import type { Reservation } from "./reservation";

export interface LoginData {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  lastname: string;
  username: string;
  email: string;
  role: string;
  imageUrl: string;
  constructionCompanyId?: string;
  agencyId?: string;
  accessToken?: string;
  refreshToken?: string;
  reservation?: Reservation;
}

export interface UserToAdd {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  role: string;
  constructionCompanyId?: string;
  agencyId?: string;
}

export interface UserToUpdate {
  name: string;
  lastname: string;
  username: string;
  email: string;
}

export interface UserChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserAgencyFollow {
  id: string;
  userId: string;
  agencyId: string;
}

export interface UserAgencyFollowToAdd {
  userId: string;
  agencyId: string;
}

export interface Notification {
  id: string;
  userId: string;
  label: string;
  title: string;
  message: string;
  createdAt: string;
}
