import axios from "redaxios"
import { useMemo } from "react"

export const useAxios = () => {
  return useMemo(() => {
    const instance = axios.create({
      headers: {
        Authorization: "Bearer 1234",
      },
    })
    return instance
  }, [])
}
