import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';
import '../styles/Login.css';

function Dashboard() {
  const navigate = useNavigate();
  
  // Datele utilizatorului aduse din backend
  const [userData, setUserData] = useState({ username: '', email: '' });
  
  // Stările pentru formularul de actualizare
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Mesaje și loading
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Când se încarcă pagina, aducem datele userului
  useEffect(() => {
    const fetchUserData = async () => {
      // Verificăm dacă userul e logat (dacă are email-ul salvat)
      const email = localStorage.getItem('userEmail');
      
      if (!email) {
        navigate('/login'); // Nu e logat? Îl trimitem la login!
        return;
      }

      try {
        // Cerem datele de la backend
        const response = await axios.get(`/api/auth/me?email=${email}`);
        setUserData(response.data); // Salvăm username-ul și email-ul primit
      } catch (err) {
        console.error("Eroare la preluarea datelor:", err);
        navigate('/login'); // Dacă e eroare (ex: user șters), îl delogăm
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // 2. Funcția de Logout
  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // Ștergem sesiunea
    navigate('/login');
  };

  // 3. Funcția de Actualizare Profil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsUpdating(true);

    try {
      await axios.post('/api/auth/update', {
        email: userData.email, // Backend-ul are nevoie de email ca să știe pe cine modifică
        currentPassword: currentPassword,
        newUsername: newUsername,
        newPassword: newPassword
      });

      setMessage('Profil actualizat cu succes!');
      
      // Actualizăm live și numele afișat pe ecran dacă a fost schimbat
      if (newUsername) {
        setUserData({ ...userData, username: newUsername });
      }

      // Golim formularul
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Eroare la actualizare. Ai introdus parola curentă corect?');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Se încarcă datele...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      {/* Bara de Navigare */}
      <nav className="dashboard-nav">
        <h1>Salut, {userData.username}! 👋</h1>
        <button onClick={handleLogout} className="btn-logout">Deconectare</button>
      </nav>

      <div className="dashboard-content">
        
        {/* SECȚIUNEA 1: Datele Curente */}
        <div className="dash-card">
          <h3>Datele Contului</h3>
          <div className="info-group">
            <label>Nume de utilizator</label>
            <p>{userData.username}</p>
          </div>
          <div className="info-group">
            <label>Adresă Email</label>
            <p>{userData.email}</p>
          </div>
        </div>

        {/* SECȚIUNEA 2: Formularul de Actualizare */}
        <div className="dash-card">
          <h3>Actualizează Profilul</h3>
          
          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleUpdateProfile}>
            {/* Parola Curentă (Obligatorie pentru securitate) */}
            <div className="form-group">
              <label>Parolă curentă (Obligatoriu)</label>
              <input 
                className="form-control"
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                placeholder="Introdu parola actuală" 
                required 
              />
            </div>

            <hr style={{ border: '1px solid #edf2f7', margin: '20px 0' }} />

            {/* Câmpuri Opționale pentru modificare */}
            <div className="form-group">
              <label>Nume de utilizator nou (opțional)</label>
              <input 
                className="form-control"
                type="text" 
                value={newUsername} 
                onChange={(e) => setNewUsername(e.target.value)} 
                placeholder="Lasă gol dacă nu vrei să schimbi" 
              />
            </div>

            <div className="form-group">
              <label>Parolă nouă (opțional)</label>
              <input 
                className="form-control"
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Lasă gol dacă nu vrei să schimbi" 
              />
            </div>

            <button 
              type="submit" 
              className="btn-login" 
              disabled={isUpdating}
            >
              {isUpdating ? 'Se salvează...' : 'Salvează Modificările'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;