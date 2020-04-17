import { AccountAccess } from './account-access.model';
import { ScaUserData } from './sca-user-data.model';

export class User {
  id: string;
  email: string;
  login: string;
  branch: string;
  pin: string;
  scaUserData: ScaUserData[];
  accountAccesses: AccountAccess[];
}
