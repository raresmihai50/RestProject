import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });

      setSuccess('Cont creat cu succes! Te redirecționăm la login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        // Cazul 1: Erori de validare multiple (trimise de GlobalExceptionHandler pentru @Valid)
        if (typeof err.response.data === 'object' && !err.response.data.error) {
          const messages = Object.values(err.response.data).join('\n');
          setError(messages);
        } 
        // Cazul 2: Eroare specifică de logică (ex: Email deja folosit)
        else if (err.response.data.error) {
          setError(err.response.data.error);
        }
      } else {
        setError('A apărut o eroare la conexiunea cu serverul.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Creare Cont</h2>
          <p className="login-subtitle">Completează datele de mai jos</p>
        </div>

        {/* Afișare erori cu suport pentru linii multiple */}
        {error && <div className="alert alert-error" style={{ whiteSpace: 'pre-line' }}>{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Nume de utilizator</label>
            <input
              type="text"
              className="form-control"
              placeholder="Minim 1 caracter"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength="128"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="exemplu@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength="128"
              required
            />
          </div>
          <div className="form-group">
            <label>Parolă</label>
            <input
              type="password"
              className="form-control"
              placeholder="Minim 4 caractere"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength="128"
              required
            />
          </div>
          <button type="submit" className="btn-login">Înregistrare</button>
        </form>

        <div className="login-footer">
          Ai deja un cont? <Link to="/login" className="login-link">Autentifică-te</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;