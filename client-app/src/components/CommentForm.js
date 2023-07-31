import { useState } from "react";

export function CommentForm({loading, error, onSubmit, autoFocus = true, initialValue = ""}) {
    const [message, setMessage] = useState(initialValue);

    function handleSubmit(e) {
        e.preventDefault();

        onSubmit(message).then(() => setMessage(""));
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="comment-form-row">
                <textarea autoFocus={autoFocus} className="message-input" value={message} onChange={e => setMessage(e.target.value)}></textarea>
                <button type="submit" className="btn" disabled={loading}>{loading ? "Loading..." : "Post"}</button>
            </div>
            <div className="error-msg">{error}</div>
        </form>
    )
}