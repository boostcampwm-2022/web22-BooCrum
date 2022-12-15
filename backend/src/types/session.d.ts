import { Session } from 'express-session';

declare module 'http' {
  interface IncomingMessage {
    session: Session & {
      user: UserSessionData;
    };
  }
}
