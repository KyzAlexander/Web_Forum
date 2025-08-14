import "./index.scss";

interface User {
  id: number;
  name: string;
}

interface IUserFilterProps {
  users: User[];
  value: number | null;
  onChange: (val: number | null) => void;
}

const UserFilter: React.FC<IUserFilterProps> = ({ users, value, onChange }) => {
  return (
    <div className="filter">
      <label>Filter by user:</label>
      <select
        value={value || ""}
        onChange={(e) => {
          const val = Number(e.target.value);
          onChange(val || null);
        }}
      >
        <option value="">All Users</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserFilter;
