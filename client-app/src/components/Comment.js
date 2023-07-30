import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";

import { IconBtn } from "./IconBtn";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
});
export function Comment({id, message, user, createdAt}) {
    return (
        <>
            <div className="comment">
                <div className="header">
                    <span className="name">{user.name}</span>
                    <span className="date">{dateFormatter.format(Date.parse(createdAt))}</span>
                </div>
                <div className="message">{message}</div>
                <div className="footer">
                    <IconBtn Icon={FaHeart} aria-label="Like"> 
                        2
                    </IconBtn>
                    <IconBtn Icon={FaReply} aria-label="Reply" /> 
                    <IconBtn Icon={FaEdit} aria-label="Edit" /> 
                    <IconBtn Icon={FaTrash} aria-label="Trash" color="danger"/> 
                </div>
            </div>
        </>
    )
}