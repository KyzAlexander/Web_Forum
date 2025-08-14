import "./index.scss";

interface IEditableUserFormProps {
  user: { name: string | undefined; email: string | undefined };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const EditableUserForm: React.FC<IEditableUserFormProps> = ({
  user,
  onChange,
  onSave,
}) => (
  <div className="user-edit-form">
    <label>
      Name:
      <input type="text" name="name" value={user.name} onChange={onChange} />
    </label>
    <label>
      Email:
      <input type="email" name="email" value={user.email} onChange={onChange} />
    </label>
    <button onClick={onSave}>Save</button>
  </div>
);

export default EditableUserForm;
