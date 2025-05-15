import { useEffect, useState } from "react";
import { RegisteredUserType } from "@/types/credentials";
import { getAllRegisteredUsers } from "../../actions/audit";

export function GetAllRegisteredUsersHook() {
  const [data, setData] = useState<RegisteredUserType[] | undefined>();
  useEffect(() => {
    async function fetchData() {
      const response = await getAllRegisteredUsers();
      if (response.success && response.data) {
        setData(JSON.parse(response.data));
      }
    }
    fetchData();
  }, []);

  return data;
}