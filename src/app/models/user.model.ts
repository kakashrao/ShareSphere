export interface User {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  profileImage: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistrationRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  id: string;
  password: string;
}
