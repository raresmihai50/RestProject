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
  const [deletePassword, setDeletePassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
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
        const response = await axios.get(`/api/users/me?email=${email}`);
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
    setError(''); setMessage('');
    if (newPassword && newPassword !== confirmNewPassword) {
      setError('Parolele noi introduse nu se potrivesc!');
      return;
    }
    setIsUpdating(true);
    try {
      // Construim pachetul de date dinamic.
      // Adăugăm username și password DOAR dacă nu sunt goale.
      const payload = {
        email: userData.email,
        currentPassword: currentPassword
      };
      if (newUsername.trim() !== '') payload.newUsername = newUsername;
      if (newPassword !== '') payload.newPassword = newPassword;

      await axios.put('/api/users/update', payload);
      
      setMessage('Profil actualizat cu succes!');
      if (newUsername) setUserData({ ...userData, username: newUsername });
      setCurrentPassword(''); setNewUsername(''); setNewPassword(''); setConfirmNewPassword('');
    } catch (err) {
      // CITIM ERORILE EXACT CA LA REGISTER:
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && !err.response.data.error) {
          const messages = Object.values(err.response.data).join('\n');
          setError(messages);
        } else if (err.response.data.error) {
          setError(err.response.data.error);
        }
      } else {
        setError('Eroare la conexiunea cu serverul.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    if (!deletePassword) {
      setDeleteError('Te rugăm să introduci parola pentru a șterge contul!');
      return;
    }
    const confirmDelete = window.confirm("Ești sigur că vrei să îți ștergi contul definitiv?");
    if (!confirmDelete) return;

    try {
      await axios.delete('/api/users/delete', {
        data: { email: userData.email, password: deletePassword }
      });
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Eroare la ștergerea contului.');
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Se încarcă datele...</div>;

  return (
    <div className="dashboard-wrapper">
      <nav className="dashboard-nav">
        <h1>Salut, {userData.username}! 👋</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          {/* BUTON MODIFICAT CARE DUCE SPRE GARAJ */}
          <button 
            onClick={() => navigate('/garage')} 
            className="btn-garage-toggle"
          >
            🚗 Gestionează Garajul
          </button>
          <button onClick={handleLogout} className="btn-logout">Deconectare</button>
        </div>
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
              <input className="dash-form-control" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} maxLength="128" required />
            </div>
            <hr style={{ border: '1px solid #edf2f7', margin: '20px 0' }} />
            <div className="dash-form-group">
              <label>Nume de utilizator nou (opțional)</label>
              <input className="dash-form-control" type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} maxLength="128" minLength="1" placeholder="Minim 1 caracter" />
            </div>
            <div className="dash-form-group">
              <label>Parolă nouă (opțional)</label>
              <input className="dash-form-control" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} maxLength="128" minLength="4" placeholder="Minim 4 caractere" />
            </div>
            <div className="dash-form-group">
              <label>Confirmă parola nouă</label>
              <input className="dash-form-control" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} maxLength="128" />
            </div>
            <button type="submit" className="btn-save" disabled={isUpdating}>
              {isUpdating ? 'Se salvează...' : 'Salvează Modificările'}
            </button>
          </form>
        </div>

        <div className="dash-card danger-zone" style={{ flexBasis: '100%' }}>
          <h3 style={{ color: '#c53030', borderBottomColor: '#fed7d7' }}>Zonă Periculoasă</h3>
          <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '15px' }}>
            Odată ce îți ștergi contul, nu mai există cale de întoarcere. Introdu parola pentru confirmare.
          </p>
          {deleteError && <div className="dash-alert dash-alert-error">{deleteError}</div>}
          <div className="dash-form-group">
            <label>Parola ta (Obligatoriu)</label>
            <input className="dash-form-control" type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} maxLength="128" placeholder="Introdu parola pentru a confirma" />
          </div>
          <button onClick={handleDeleteAccount} className="btn-delete-account">Șterge Contul Definitiv</button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;