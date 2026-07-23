import { SessionProvider } from "next-auth/react";

const SessionWarper = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWarper;
