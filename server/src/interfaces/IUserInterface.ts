export interface IUserInterface {
  userProfilePicture?: string;
  username: string;
  password: string;
  email: string;
  friends?: string[];
  verified?: Boolean;
}
