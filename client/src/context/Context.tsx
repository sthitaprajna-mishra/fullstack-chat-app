import axios, { AxiosResponse } from "axios";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { IUserInterface } from "../interfaces/IUserInterface";

export const myContext = createContext<Partial<IUserInterface>>({});

export default function AuthContext(props: PropsWithChildren<any>) {
  const [currentUser, setCurrentUser] = useState<IUserInterface>();
  useEffect(() => {
    axios
      .get("http://localhost:4000/user", { withCredentials: true })
      .then((res: AxiosResponse) => {
        setCurrentUser(res.data);
      });
  }, []);
  return (
    <myContext.Provider value={currentUser!}>
      {props.children}
    </myContext.Provider>
  );
}
