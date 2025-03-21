import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userType: "hr" | "interviewer" | null;
  name: string;
  authToken: string;
  id: string;
  setUserType: (userType: "hr" | "interviewer" | null) => void;
  setName: (name: string) => void;
  setAuthToken: (authToken: string) => void;
  setId: (id: string) => void;
  reset: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userType: null,
      name: "",
      authToken: "",
      id: "",
      setUserType: (userType: "hr" | "interviewer" | null) =>
        set(() => ({ userType })),
      setName: (name: string) => set(() => ({ name })),
      setAuthToken: (authToken: string) => set(() => ({ authToken })),
      setId: (id: string) => set(() => ({ id })),
      reset: () =>
        set(() => ({ userType: null, name: "", authToken: "", id: "" })),
    }),
    {
      name: "cap-auth-storage", // The key under which the state will be stored in localStorage
    }
  )
);

export default useAuthStore;
