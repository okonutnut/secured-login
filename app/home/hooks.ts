import { useEffect, useState } from "react";
import { GetCurrentUser } from "../actions/login";
import { RegisterCredentials } from "@/types/credentials";

export function GetCurrentUserHook() {
  const [user, setUser] = useState<RegisterCredentials>();
  useEffect(() => {
    async function fetchData() {
      setUser(await GetCurrentUser());
    }
    fetchData();
  }, []);

  return user;
}