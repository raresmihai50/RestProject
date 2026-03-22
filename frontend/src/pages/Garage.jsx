import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css'; // Refolosim stilurile pentru a păstra consistența UI-ului

function Garage() {
  const navigate = useNavigate();
  
  // Datele userului (avem nevoie de email pentru requesturi și username pentru titlu)
  const [userData, setUserData] = useState({ username: '', email: '' });
  
  const [cars, setCars] = useState([]);
  const [editingCarId, setEditingCarId] = useState(null);
  const [carForm, setCarForm] = useState({
    brand: '', model: '', fabricationYear: '', engineCapacity: '', horsepower: ''
  });

  const [carMessage, setCarMessage] = useState('');
  const [carError, setCarError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndCars = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        navigate('/login');
        return;
      }
      try {
        const userRes = await axios.get(`/api/users/me?email=${email}`);
        setUserData(userRes.data);
        fetchMyCars(userRes.data.email);
      } catch (err) {
        console.error("Eroare la preluarea datelor:", err);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDataAndCars();
  }, [navigate]);

  const fetchMyCars = async (email) => {
    try {
      const res = await axios.get(`/api/cars/my-cars?email=${email}`);
      setCars(res.data);
    } catch (err) {
      console.error("Eroare la preluarea mașinilor", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleCarFormChange = (e) => {
    setCarForm({ ...carForm, [e.target.name]: e.target.value });
  };

  const resetCarForm = () => {
    setCarForm({ brand: '', model: '', fabricationYear: '', engineCapacity: '', horsepower: '' });
    setEditingCarId(null);
    setCarError('');
  };

  const handleEditClick = (car) => {
    setEditingCarId(car.id);
    setCarForm({
      brand: car.brand, model: car.model, fabricationYear: car.fabricationYear,
      engineCapacity: car.engineCapacity, horsepower: car.horsepower
    });
    setCarMessage(''); setCarError('');
  };

  const handleSaveCar = async (e) => {
    e.preventDefault();
    setCarError(''); setCarMessage('');
    const payload = { email: userData.email, ...carForm };

    try {
      if (editingCarId) {
        await axios.put(`/api/cars/update/${editingCarId}`, payload);
        setCarMessage('Mașină actualizată cu succes!');
      } else {
        await axios.post('/api/cars/add', payload);
        setCarMessage('Mașină adăugată cu succes!');
      }
      resetCarForm();
      fetchMyCars(userData.email);
    } catch (err) {
      if (err.response && err.response.data) {
        // Dacă e o eroare generală setată de noi manual (Map.of("error", "..."))
        if (err.response.data.error) {
          setCarError(err.response.data.error);
        } 
        // Dacă e o eroare de validare de la @Valid (care returnează mai multe mesaje)
        else if (typeof err.response.data === 'object') {
          // Luăm toate mesajele de eroare din JSON și le unim cu un "Enter" între ele
          const errorMessages = Object.values(err.response.data).join('\n');
          setCarError(errorMessages);
        }
      } else {
        setCarError('Eroare de conexiune la server.');
      }
    }
  };

  const handleDeleteCar = async (carId) => {
    const confirm = window.confirm("Ești sigur că vrei să ștergi această mașină din garaj?");
    if (!confirm) return;
    try {
      await axios.delete(`/api/cars/delete/${carId}?email=${userData.email}`);
      setCarMessage('Mașină ștearsă cu succes!');
      fetchMyCars(userData.email);
    } catch (err) {
      setCarError(err.response?.data?.error || 'Eroare la ștergerea mașinii.');
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Se încarcă garajul...</div>;

  return (
    <div className="dashboard-wrapper">
      <nav className="dashboard-nav">
        <h1>Garajul lui {userData.username} 🚘</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          {/* BUTON DE ÎNTOARCERE LA DASHBOARD */}
          <button onClick={() => navigate('/dashboard')} className="btn-garage-toggle">
            👤 Înapoi la Profil
          </button>
          <button onClick={handleLogout} className="btn-logout">Deconectare</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dash-card garage-section" style={{ flexBasis: '100%' }}>
          <h2>Gestionează Garajul</h2>
          
          {carError && <div className="dash-alert dash-alert-error">{carError}</div>}
          {carMessage && <div className="dash-alert dash-alert-success">{carMessage}</div>}

          <div className="garage-container">
            {/* Formular Adăugare/Editare */}
            <div className="car-form-wrapper">
              <h3>{editingCarId ? 'Editează Mașina' : 'Adaugă o Mașină Nouă'}</h3>
              <form onSubmit={handleSaveCar}>
                <div className="dash-form-group">
                  <label>Marcă (Brand)</label>
                  <input type="text" name="brand" className="dash-form-control" value={carForm.brand} onChange={handleCarFormChange} required maxLength="128" placeholder="ex: BMW" />
                </div>
                <div className="dash-form-group">
                  <label>Model</label>
                  <input type="text" name="model" className="dash-form-control" value={carForm.model} onChange={handleCarFormChange} required maxLength="128" placeholder="ex: Seria 3" />
                </div>
                <div className="dash-form-group">
                  <label>An Fabricație</label>
                  <input type="number" name="fabricationYear" className="dash-form-control" value={carForm.fabricationYear} onChange={handleCarFormChange} required min="1800" max="9999" placeholder="ex: 2015" />
                </div>
                <div className="dash-form-group">
                  <label>Capacitate Cilindrică (cm3)</label>
                  <input type="number" step="0.1" name="engineCapacity" className="dash-form-control" value={carForm.engineCapacity} onChange={handleCarFormChange} required min="0" max="100000" placeholder="ex: 1995" />
                </div>
                <div className="dash-form-group">
                  <label>Putere (CP)</label>
                  <input type="number" name="horsepower" className="dash-form-control" value={carForm.horsepower} onChange={handleCarFormChange} required min="1" max="100000" placeholder="ex: 190" />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button type="submit" className="btn-save" style={{ flex: 1 }}>
                    {editingCarId ? 'Salvează Modificările' : '➕ Adaugă în Garaj'}
                  </button>
                  {editingCarId && (
                    <button type="button" className="btn-cancel" onClick={resetCarForm}>Anulează</button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de Mașini */}
            <div className="car-list-wrapper">
              <h3>Mașinile Tale ({cars.length})</h3>
              {cars.length === 0 ? (
                <p style={{ color: '#718096' }}>Nu ai adăugat nicio mașină încă.</p>
              ) : (
                <div className="car-grid">
                  {cars.map(car => (
                    <div key={car.id} className="car-card">
                      <div className="car-details">
                        <h4>{car.brand} {car.model}</h4>
                        <p><strong>An:</strong> {car.fabricationYear}</p>
                        <p><strong>Motor:</strong> {car.engineCapacity} cm³</p>
                        <p><strong>Putere:</strong> {car.horsepower} CP</p>
                      </div>
                      <div className="car-actions">
                        <button onClick={() => handleEditClick(car)} className="btn-edit-car">✏️ Editează</button>
                        <button onClick={() => handleDeleteCar(car.id)} className="btn-delete-car">🗑️ Șterge</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Garage;