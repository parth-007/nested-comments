import React from "react";

const Context = React.createContext();

export function PostProvider({children}) {
    return <Context.Provider value={{}}>{children}</Context.Provider>
}