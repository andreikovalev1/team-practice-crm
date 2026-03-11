import { User } from "@/types/user.types";

export interface Department {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
}

export interface UploadAvatarResponse {
  uploadAvatar: string;
}

export interface UpdateProfileResponse {
  updateProfile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
  };
}

export interface UpdateUserResponse {
  updateUser: {
    id: string;
    department_name: string | null;
    position_name: string | null;
  };
}

export interface GetUserByIdResponse {
  user: User;
}