
import { UserContext } from "./UserContext";
import PropTypes from "prop-types"; 
import { useState, useMemo } from "react";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Cache the object reference. It only updates when 'user' state changes.
  const contextValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
// Define prop types to satisfy the linter
UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContextProvider;