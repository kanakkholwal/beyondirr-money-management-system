
import { sessionUserType } from "./user";
type sessionType = {
  expires: Date;
  user: sessionUserType;
};

export type { sessionType };
