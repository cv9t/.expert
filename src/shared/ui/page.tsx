import { ReactNode } from "react";
import { useTitle } from "../lib/dom";

type PageProps = {
  title: string;
  children: ReactNode;
};

export const Page = ({ title, children }: PageProps) => {
  useTitle(title);

  return <>{children}</>;
};
