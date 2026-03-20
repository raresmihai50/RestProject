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

  //pentru ștergere cont
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

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

  // Funcția de Ștergere Cont
  const handleDeleteAccount = async () => {
    setDeleteError(''); // Resetăm eroarea

    if (!deletePassword) {
      setDeleteError('Te rugăm să introduci parola pentru a putea șterge contul!');
      return;
    }

    const confirmDelete = window.confirm("Ești sigur că vrei să îți ștergi contul? Această acțiune este permanentă și nu poate fi anulată!");
    
    if (!confirmDelete) return;

    try {
      // Pentru axios.delete cu un "body", folosim proprietatea "data"
      await axios.delete('/api/auth/delete', {
        data: {
          email: userData.email,
          password: deletePassword
        }
      });
      
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Eroare la ștergerea contului.');
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
        {/* SECȚIUNEA 3: Ștergere Cont (Danger Zone) */}
        <div className="dash-card danger-zone">
          <h3 style={{ color: '#c53030', borderBottomColor: '#fed7d7' }}>Ștergere Cont</h3>
          <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '15px' }}>
            Odată ce îți ștergi contul, nu mai există cale de întoarcere. Introdu parola pentru confirmare.
          </p>

          {/* Afișăm eroarea dacă a greșit parola la ștergere */}
          {deleteError && <div className="dash-alert dash-alert-error">{deleteError}</div>}

          <div className="dash-form-group">
            <label>Parola ta (Obligatoriu)</label>
            <input 
              className="dash-form-control"
              type="password" 
              value={deletePassword} 
              onChange={(e) => setDeletePassword(e.target.value)} 
              placeholder="Introdu parola pentru a confirma" 
              maxLength="128"
            />
          </div>

          <button 
            onClick={handleDeleteAccount} 
            className="btn-delete-account"
          >
            Șterge Contul Definitiv
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;