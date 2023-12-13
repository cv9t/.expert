import { useEffect } from "react";
import { APP_NAME } from "../config/env";

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = `${APP_NAME} | ${title}`;
  }, [title]);
};
