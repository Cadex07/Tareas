const API_URL = 'http://localhost:5000/api/tasks';

let editandoId = null;

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) return alert('No autenticado');

  const tarea = {
    titulo: document.getElementById('titulo').value,
    descripcion: document.getElementById('descripcion').value,
    fecha: document.getElementById('fecha').value,
    prioridad: document.getElementById('prioridad').value,
  };

  if (editandoId) {
    // Editar tarea existente
    const res = await fetch(`${API_URL}/${editandoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(tarea),
    });
    if (res.ok) {
      alert('Tarea editada');
      editandoId = null;
      document.getElementById('submit-btn').textContent = 'Agregar';
    } else {
      const error = await res.text();
      alert('Error al editar la tarea: ' + error);
      console.error('Error al editar:', error);
    }
  } else {
    // Crear nueva tarea
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(tarea),
    });
  }

  e.target.reset();
  cargarTareas();
});

async function cargarTareas() {
  const token = localStorage.getItem('token');
  const res = await fetch(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const tareas = await res.json();
  const lista = document.getElementById('task-list');
  lista.innerHTML = '';

  tareas.forEach(t => {
    const div = document.createElement('div');
    div.className = 'task';
    div.innerHTML = `
      <h3>${t.titulo}</h3>
      <p>${t.descripcion}</p>
      <p><strong>Fecha:</strong> ${new Date(t.fecha).toLocaleDateString()}</p>
      <p><strong>Prioridad:</strong> ${t.prioridad}</p>
      <button class="eliminar-btn">Eliminar</button>
      <button class="editar-btn">Editar</button>
    `;
    div.querySelector('.eliminar-btn').addEventListener('click', () => eliminarTarea(t._id || t.id));
    div.querySelector('.editar-btn').addEventListener('click', () => cargarEnFormulario(t));
    lista.appendChild(div);
  });
}

function cargarEnFormulario(tarea) {
  document.getElementById('titulo').value = tarea.titulo;
  document.getElementById('descripcion').value = tarea.descripcion;
  document.getElementById('fecha').value = tarea.fecha.split('T')[0];
  document.getElementById('prioridad').value = tarea.prioridad;
  editandoId = tarea._id || tarea.id;
  document.getElementById('submit-btn').textContent = 'Guardar';
}

async function eliminarTarea(id) {
  const token = localStorage.getItem('token');
  if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (res.ok) {
    alert('Tarea eliminada');
    cargarTareas();
  } else {
    const error = await res.text();
    alert('Error al eliminar: ' + error);
    console.error('Error al eliminar:', error);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

cargarTareas();