export interface IUserInterface {
  _id: string;
  userProfilePicture?: string;
  username: string;
  password: string;
  email: string;
  friends?: string[];
  verified?: Boolean;
}
