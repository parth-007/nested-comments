import { useState } from "react";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";

import { usePost } from "../context/PostContext";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment, deleteComment, updateComment } from "../services/comments";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { IconBtn } from "./IconBtn";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
});
export function Comment({ id, message, user, createdAt }) {
    const { post, getReplies, createLocalComment, updateLocalComment, deleteLocalComment } = usePost();
    const childComments = getReplies(id);
    const [areChildrenHidden, setAreChildrenHidden] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const createCommentFn = useAsyncFn(createComment);
    const updateCommentFn = useAsyncFn(updateComment);
    const deleteCommentFn = useAsyncFn(deleteComment);

    const onCommentReply = (message) => {
        return createCommentFn.execute({ postId: post.id, message, parentId: id }).then(comment => {
            setIsReplying(false);
            createLocalComment(comment);
        });
    }

    const onCommentUpdate = (message) => {
        return updateCommentFn.execute({ postId: post.id, message, id }).then(comment => {
            setIsEditing(false);
            console.log(comment);
            deleteLocalComment(id);
        });
    }

    const onCommentDelete = () => {
        return deleteCommentFn.execute({ postId: post.id, id }).then((comment) => deleteLocalComment(comment.id));
    }
    return (
        <>
            <div className="comment">
                <div className="header">
                    <span className="name">{user.name}</span>
                    <span className="date">{dateFormatter.format(Date.parse(createdAt))}</span>
                </div>
                {isEditing ? <CommentForm autoFocus initialValue={message} onSubmit={onCommentUpdate} loading={updateCommentFn.loading} error={updateCommentFn.error} /> : <div className="message">{message}</div>}
                <div className="footer">
                    <IconBtn Icon={FaHeart} aria-label="Like">
                        2
                    </IconBtn>
                    <IconBtn Icon={FaReply} onClick={() => setIsReplying(prev => !prev)} isActive={isReplying} aria-label={isReplying ? `Cancel Reply` : `Reply`} />
                    <IconBtn Icon={FaEdit} onClick={() => setIsEditing(prev => !prev)} isActive={isEditing} aria-label={isEditing ? `Cancel Edit` : `Edit`} />
                    <IconBtn Icon={FaTrash} onClick={onCommentDelete} disabled={deleteCommentFn.loading} aria-label="Trash" color="danger" />
                </div>
                {deleteCommentFn.error && (
                    <div className="error-msg mt-1">
                        {deleteCommentFn.error}
                    </div>
                )}
            </div>

            {isReplying && (
                <div className="mt-1 ml-3">
                    <CommentForm autoFocus onSubmit={onCommentReply} loading={createCommentFn.loading} error={createCommentFn.error} />
                </div>
            )}
            {childComments && childComments.length > 0 && (
                <>
                    <div className={`nested-comments-stack ${areChildrenHidden ? 'hide' : ''}`}>
                        <button className="collapse-line" aria-label="Hide Replies" onClick={() => setAreChildrenHidden(true)}></button>
                        <div className="nested-comments">
                            <CommentList comments={childComments}></CommentList>
                        </div>
                    </div>
                    <button className={`btn mt-1 ${!areChildrenHidden ? 'hide' : ''}`} onClick={() => setAreChildrenHidden(false)}>
                        Show Replies
                    </button>
                </>
            )}
        </>
    )
}