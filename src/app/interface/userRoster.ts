import { Roster } from "./roster";

export interface UserRoster {
  username: string;
  userId:string;
  currentMonth:string;
  roster: Array<Roster>;
}
