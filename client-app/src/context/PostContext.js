import React, { useContext, useEffect, useMemo, useState } from "react";
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

    const [comments, setComments] = useState([]);

    const commentsByParentId = useMemo(() => {
        const group = {};
        comments.forEach(comment => {
            group[comment.parentId] ||= [];
            group[comment.parentId].push(comment);
        })

        return group;
    }, [comments]);

    console.log(commentsByParentId);

    function createLocalComment(comment) {
        setComments(prevComments => {
            return [comment, ...prevComments, ]
        })
    }

    useEffect(() => {
        if (post?.comments == null) return;
        setComments(post.comments);
    }, [post?.comments]);
    const getReplies = (parentId) => commentsByParentId[parentId];

    return (
        <Context.Provider
            value={{
                post: { ...post, id }, 
                getReplies,
                createLocalComment,
                rootComments: commentsByParentId[null]
            }}
        >
            {isLoading ? <h1>Loading...</h1> : error ? <h1 className="error-msg">{error}</h1> : children}
        </Context.Provider>);
}
