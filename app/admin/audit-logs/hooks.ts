import { useEffect, useState } from "react";
import { AuditLogsType } from "@/types/credentials";
import { getAllAuditLogs } from "../../actions/audit";

export function GetAllAuditLogsHook() {
  const [data, setData] = useState<AuditLogsType[] | undefined>();
  useEffect(() => {
    async function fetchData() {
      const response = await getAllAuditLogs();
      if (response.success && response.data) {
        setData(response.data);
      }
    }
    fetchData();
  }, []);

  return data;
}