import "./index.scss"

interface Comment {
  id: number;
  body: string;
}

interface ICommentsSectionProps {
  postId: number;
  comments: Comment[];
  isOpen: boolean;
  onToggle: (postId: number) => void;
}

const CommentsSection: React.FC<ICommentsSectionProps> = ({
  postId,
  comments,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      <div className="comments-toggle-btn">
        <button onClick={() => onToggle(postId)}>
          {isOpen ? "Hide Comments" : "Show Comments"}
        </button>
      </div>
      {isOpen && (
        <div className="comments-section">
          <h4>Comments</h4>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <p>{comment.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default CommentsSection;
