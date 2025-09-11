import { useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <div className="planel flex-col shadow-md flex items-center justify-center bg-white rounded-md p-4">
      <h1 className="text-primary">KrovNadGlavom</h1>
      <h1 className="text-primary">KrovNadGlavom</h1>
      <h1 className="text-primary">KrovNadGlavom</h1>
      <h1 className="text-primary">{user.username}</h1>
      <div>
        <input type="text" className="form-input" />
      </div>
      <button
        className="btn btn-primary"
        onClick={() => {
          navigate("/login");
        }}
      >
        Halo
      </button>
    </div>
  );
}
