import { useContext } from "react"
import { AuthContext } from "../contexts/AuthProvider"
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const useAuth = () => {
    const auth = useContext(AuthContext)
  return auth
}

export default useAuth