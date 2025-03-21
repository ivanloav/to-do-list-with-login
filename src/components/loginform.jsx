import './loginform.css';                     // Importa los estilos del componente LoginForm
import { useState, useEffect } from 'react';  // Importa los hooks useState y useEffect de React

export function LoginForm({ onLoginSuccess }) {
  // Definición de estados
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Definición de funciones
  const setEmail = (email) => setCredentials(prev => ({ ...prev, email }));
  const setPassword = (password) => setCredentials(prev => ({ ...prev, password }));

  // Efecto para cargar las credenciales almacenadas en localStorage
  useEffect(() => {
    const storedCredentials = localStorage.getItem('credentials');
    
    if (storedCredentials) {
      const parsedCredentials = JSON.parse(storedCredentials);
      setCredentials({ email: parsedCredentials.username, password: parsedCredentials.password });
      setRememberMe(true);
    }
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Función para simular un tiempo de espera
    setTimeout(async () => {

      // Almacenar las credenciales en localStorage si se ha marcado el checkbox o eliminarlas si no
      if (rememberMe) {
        localStorage.setItem('credentials', JSON.stringify({ username: credentials.email, password: credentials.password }));
      } else {
        localStorage.removeItem('credentials');
      }
      
      setError(false);

      // Realizar la petición de inicio de sesión
      try {
        // Configurar las opciones de la petición
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.email, password: credentials.password })
        };
        
        // Realizar la petición a la API
        const response = await fetch('https://reqres.in/api/login', requestOptions);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error);
        }
        
        onLoginSuccess();
      } catch (err) {
        setError(true);
        alert('Error de inicio de sesión: ' + err.message);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // Renderiza el componente
  return (                                                                                   
    <div>
      {isLoading && (
        <div className="loadingOverlay">
          <div className="spinner"></div>
        </div>
      )}
      <form className='formLogin' onSubmit={handleSubmit}>
        <h1>Introduce tus credenciales para iniciar sesión</h1>
        <div className='inputsButtonContainer'>
          <input
            type="email"
            value={credentials.email}
            onChange={e => setEmail(e.target.value)}
            style={{ borderColor: error ? 'red' : 'default' }}
            placeholder="Email"
          />
          <input
            type="password"
            value={credentials.password}
            onChange={e => setPassword(e.target.value)}
            style={{ borderColor: error ? 'red' : 'default' }}
            placeholder="Password"
          />
          <label className='rememberMe-container'>
            Recordar credenciales
            <input
              className='rememberMe-checkbox'
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
            />
          </label>
          <button type="submit">🔑&nbsp;&nbsp;&nbsp;Login</button>
        </div>
      </form>
    </div>
  );
}
