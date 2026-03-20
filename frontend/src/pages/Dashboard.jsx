import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({ username: '', email: '' });
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('userEmail');
      
      if (!email) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`/api/auth/me?email=${email}`);
        setUserData(response.data);
      } catch (err) {
        console.error("Eroare la preluarea datelor:", err);
        navigate('/login'); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('Parolele noi introduse nu se potrivesc!');
      return;
    }

    setIsUpdating(true);

    try {
      await axios.post('/api/auth/update', {
        email: userData.email,
        currentPassword: currentPassword,
        newUsername: newUsername,
        newPassword: newPassword
      });

      setMessage('Profil actualizat cu succes!');
      
      if (newUsername) {
        setUserData({ ...userData, username: newUsername });
      }

      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
      setConfirmNewPassword('');
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
      <nav className="dashboard-nav">
        <h1>Salut, {userData.username}! 👋</h1>
        <button onClick={handleLogout} className="btn-logout">Deconectare</button>
      </nav>

      <div className="dashboard-content">
        
        <div className="dash-card">
          <h3>Datele Contului</h3>
          <div className="dash-info-group">
            <label>Nume de utilizator</label>
            <p>{userData.username}</p>
          </div>
          <div className="dash-info-group">
            <label>Adresă Email</label>
            <p>{userData.email}</p>
          </div>
        </div>

        <div className="dash-card">
          <h3>Actualizează Profilul</h3>
          
          {error && <div className="dash-alert dash-alert-error">{error}</div>}
          {message && <div className="dash-alert dash-alert-success">{message}</div>}

          <form onSubmit={handleUpdateProfile}>
            <div className="dash-form-group">
              <label>Parolă curentă (Obligatoriu)</label>
              <input 
                className="dash-form-control"
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                placeholder="Introdu parola actuală" 
                maxLength="128" /* <-- LIMITĂ ADĂUGATĂ */
                required 
              />
            </div>

            <hr style={{ border: '1px solid #edf2f7', margin: '20px 0' }} />

            <div className="dash-form-group">
              <label>Nume de utilizator nou (opțional)</label>
              <input 
                className="dash-form-control"
                type="text" 
                value={newUsername} 
                onChange={(e) => setNewUsername(e.target.value)} 
                placeholder="Lasă gol dacă nu vrei să schimbi" 
                maxLength="50" /* <-- LIMITĂ ADĂUGATĂ */
              />
            </div>

            <div className="dash-form-group">
              <label>Parolă nouă (opțional)</label>
              <input 
                className="dash-form-control"
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Lasă gol dacă nu vrei să schimbi" 
                maxLength="128" /* <-- LIMITĂ ADĂUGATĂ */
              />
            </div>

            <div className="dash-form-group">
              <label>Confirmă parola nouă</label>
              <input 
                className="dash-form-control"
                type="password" 
                value={confirmNewPassword} 
                onChange={(e) => setConfirmNewPassword(e.target.value)} 
                placeholder="Introdu din nou parola nouă" 
                maxLength="128" /* <-- LIMITĂ ADĂUGATĂ */
              />
            </div>

            <button 
              type="submit" 
              className="btn-save" 
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