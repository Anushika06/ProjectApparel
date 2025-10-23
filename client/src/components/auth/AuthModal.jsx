import { Link } from 'react-router-dom';

const AuthModal = ({ onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Authentication Required</h2>
        <p>You must be logged in to perform this action.</p>
        <Link to="/login" onClick={onClose}>Sign In</Link>
        <Link to="/signup" onClick={onClose}>Sign Up</Link>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AuthModal;