import { usePost } from "../context/PostContext"

export function Post(p) {
    const { post } = usePost();
    return (
        <>
            <h1>{post.title}</h1>
            <article>{post.body}</article>
            <h3 className="comments-title">Comments</h3>
            
        </>
    )
}