import React, { useState } from "react";
import UserContext from "./UserContext";

const UserProvider = ({ children }) => {
  const [loginUserData, setLoginUserData] = useState(null);

  return (
    <UserContext.Provider value={{ loginUserData, setLoginUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
