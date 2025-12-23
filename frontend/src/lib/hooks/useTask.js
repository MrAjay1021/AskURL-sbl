"use client"
import { useQuery } from "@tanstack/react-query"
import { getTask } from "@/src/lib/api"

export const useTask = (id) =>
  useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id).then(r => r.data),
    enabled: !!id,
    refetchInterval: (data) =>
      data?.status === "COMPLETED" || data?.status === "FAILED"
        ? false
        : 2000,
  })

