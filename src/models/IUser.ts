import { PERMISSIONS } from "../constants/permission";

export interface IUser {
  id: number,
  email: string,
  name: string,
  permissions: PERMISSIONS[],
};
