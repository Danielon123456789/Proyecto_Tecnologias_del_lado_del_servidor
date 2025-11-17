const token = localStorage.getItem('token');

if (!token) {
  document.getElementById('mensaje').textContent = 'Token no encontrado. Inicia sesión primero.';
} else {
  fetch('http://localhost:3000/auth/perfil/data', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo obtener el perfil. ¿Token expirado?');
    }
    return response.json();
  })
  .then(data => {
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('correo').value = data.email;
    if (data.profilePictureUrl) {
      document.getElementById('fotoPerfil').src = data.profilePictureUrl;
    }
  })
  .catch(error => {
    console.error('Error al obtener perfil:', error);
    document.getElementById('mensaje').textContent = 'Error al cargar perfil';
  });
}
