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

export interface UserAgencyFollowToAdd {
  userId: string;
  agencyId: string;
}
