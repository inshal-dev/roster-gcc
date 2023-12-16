import { Roster } from "./roster";

export interface UserRoster {
option: any;
  userId:string;
  currentMonth:string;
  rosterData: Array<Roster>;
}
