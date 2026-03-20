import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; 

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await axios.post('/api/auth/register', { username, email, password });
      
      setMessage('Cont creat cu succes! Te redirecționăm la login...');
      
      setTimeout(() => {
        navigate('/login'); 
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || 'Eroare la înregistrare. Verifică datele.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Creează un cont nou 🚀</h2>
          <p className="login-subtitle">Alătură-te comunității noastre</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Nume de utilizator</label>
            <input 
              className="form-control"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="ex: raresmihai" 
              required 
            />
          </div>

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
              /* Am șters linia cu minLength="6" de aici! Acum acceptă orice parolă. */
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? 'Se creează contul...' : 'Înregistrează-te'}
          </button>
        </form>
        
        <div className="login-footer">
          <p style={{ margin: 0 }}>
            Ai deja un cont?
            <button 
              onClick={() => navigate('/login')} 
              className="login-link"
            >
              Intră în cont
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;