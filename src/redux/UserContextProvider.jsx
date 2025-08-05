import React from "react";
import { useSelector } from "react-redux";
import Context from "./Context";

const UserContextProvider = ({ children }) => {
  // Tomar el usuario logueado desde Redux
  const user = useSelector(state => state.login.information_user);
  // Puedes agregar signIn/signOut si los necesitas
  return (
    <Context.Provider value={{ user }}>
      {children}
    </Context.Provider>
  );
};

export default UserContextProvider;
