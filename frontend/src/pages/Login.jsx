import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; // <-- Importăm fișierul de styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      setMessage('Autentificare cu succes! Te redirecționăm...');
      localStorage.setItem('userEmail', email);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || 'Eroare la conectare. Verifică datele.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Bine ai revenit! 👋</h2>
          <p className="login-subtitle">Conectează-te pentru a continua</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input 
              className="form-control"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="nume@exemplu.ro" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Parolă</label>
            <input 
              className="form-control"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? 'Se conectează...' : 'Intră în cont'}
          </button>
        </form>
        
        <div className="login-footer">
          <p style={{ margin: 0 }}>
            Nu ai un cont încă?
            <button 
              onClick={() => navigate('/register')} 
              className="login-link"
            >
              Creează unul acum
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;