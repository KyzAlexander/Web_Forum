import React from "react";
import "./index.scss";

const AddCommentForm: React.FC<{
  onAddComment: (commentBody: string) => void;
}> = ({ onAddComment }) => {
  const [comment, setComment] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(comment);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-comment-form">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button type="submit">Add comment</button>
    </form>
  );
};

export default AddCommentForm;
