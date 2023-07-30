import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";

const Context = React.createContext();

export function usePost() {
    return useContext(Context);
}

export function PostProvider({ children }) {
  const { id } = useParams();
  const { isLoading, error, value: post } = useAsync(() => getPost(id), [id]);
  return <Context.Provider value={{post: {...post, id}}}>
    {isLoading ? <h1>Loading...</h1> : error ? <h1 className="error-msg">{error}</h1> : children}
    </Context.Provider>;
}
