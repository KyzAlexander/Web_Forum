import "./index.scss";

interface IAuthenticationFormProps {
  userName: string;
  password: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: () => void;
}

const AuthenticationForm: React.FC<IAuthenticationFormProps> = ({
  userName,
  password,
  onPasswordChange,
  onLogin,
}) => (
  <div className="user-authentication">
    <h2>Enter password for {userName}</h2>
    <input
      type="password"
      value={password}
      onChange={onPasswordChange}
      placeholder="Enter password"
    />
    <button onClick={onLogin}>Ok</button>
  </div>
);

export default AuthenticationForm;
