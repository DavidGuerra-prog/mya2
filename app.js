// -------------------- LOGIN & REGISTER --------------------
if (document.getElementById('loginForm')) {
  function getStoredUsers() {
    let u = localStorage.getItem('appUsers');
    try { return u ? JSON.parse(u) : []; } catch { return []; }
  }
  function setStoredUsers(users) {
    localStorage.setItem('appUsers', JSON.stringify(users));
  }
  if(!localStorage.getItem('appUsers')) {
    setStoredUsers([
      { username: 'alumno1', password: '1234', nombre: 'María González', avatar: "" },
      { username: 'alumno2', password: 'abcd', nombre: 'Juan Pérez', avatar: "" }
    ]);
  }
  function userAvatarOrDefault(user) {
    return user && user.avatar ? user.avatar : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.nombre || user.username || "Estudiante") + "&background=527ba0&color=fff&rounded=true&size=128";
  }
  // Login
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value;
    let users = getStoredUsers();
    let user = users.find(u => u.username === username && u.password === password);
    if(user) {
      localStorage.setItem("loggedUser", username);
      window.location.href = "index.html";
    } else {
      document.getElementById('loginError').style.display = "block";
    }
  };
  // Registro
  document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault();
    let nombre = document.getElementById('registerNombre').value.trim();
    let username = document.getElementById('registerUsername').value.trim();
    let password = document.getElementById('registerPassword').value;
    let users = getStoredUsers();
    if(users.find(u => u.username === username)) {
      document.getElementById('registerError').style.display = "block";
      document.getElementById('registerSuccess').style.display = "none";
      return;
    }
    let avatar = "";
    const registerAvatar = document.getElementById('registerAvatar');
    if(registerAvatar && registerAvatar.files && registerAvatar.files[0]) {
      let reader = new FileReader();
      reader.onload = function(evt) {
        avatar = evt.target.result;
        users.push({ username, password, nombre, avatar });
        setStoredUsers(users);
        document.getElementById('registerError').style.display = "none";
        document.getElementById('registerSuccess').style.display = "block";
        setTimeout(() => {
          document.getElementById('registerForm').reset();
          document.getElementById('registerSuccess').style.display = "none";
        }, 1400);
      };
      reader.readAsDataURL(registerAvatar.files[0]);
      return;
    }
    users.push({ username, password, nombre, avatar: "" });
    setStoredUsers(users);
    document.getElementById('registerError').style.display = "none";
    document.getElementById('registerSuccess').style.display = "block";
    setTimeout(() => {
      document.getElementById('registerForm').reset();
      document.getElementById('registerSuccess').style.display = "none";
    }, 1400);
  };
}

// -------------------- DASHBOARD --------------------
if (document.getElementById('mainMenuLinks')) {
  // --------- Navegación de secciones ---------
  const menuLinks = document.querySelectorAll('#mainMenuLinks a[data-section]');
  const sections = [
    "inicio", "grupos", "calendario", "anuncios", "guia", "modulos",
    "tareas", "foros", "evaluaciones", "calificaciones", "archivos", "personas", "configuracion"
  ].reduce((obj, s) => (obj[s] = document.getElementById("section-"+s), obj), {});

  function showSection(section) {
    Object.keys(sections).forEach(key => sections[key].style.display = 'none');
    if (sections[section]) sections[section].style.display = '';
    if(section === 'grupos') renderGrupos();
    if(section === 'calendario') renderCalendario(0);
    if(section === 'anuncios') renderAnuncios();
    if(section === 'modulos') renderModulos();
    if(section === 'tareas') renderTareas();
    if(section === 'foros') renderForos();
    if(section === 'evaluaciones') renderEvals();
    if(section === 'calificaciones') renderCalificaciones();
    if(section === 'archivos') renderArchivos();
    if(section === 'personas') renderPersonas();
    if(section === 'configuracion') renderPerfil();
  }
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const seccion = this.getAttribute('data-section');
      menuLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      showSection(seccion);
    });
  });
  showSection('inicio');

  // --------- Sidebar Toggle ---------
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if(sidebarToggle){
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('closed');
    });
  }

  // --------- Tema Claro/Oscuro ---------
  const themeBtn = document.getElementById('toggleThemeBtn');
  themeBtn.onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark':'light');
    themeBtn.textContent = document.body.classList.contains('dark') ? '☀️':'🌙';
  };
  // Mantener preferencia de tema
  if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️';
  }

  // --------- User info y Perfil ---------
  function getStoredUsers() {
    let u = localStorage.getItem('appUsers');
    try { return u ? JSON.parse(u) : []; } catch { return []; }
  }
  function setStoredUsers(users) {
    localStorage.setItem('appUsers', JSON.stringify(users));
  }
  function userAvatarOrDefault(user) {
    return user && user.avatar ? user.avatar : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.nombre || user.username || "Estudiante") + "&background=527ba0&color=fff&rounded=true&size=128";
  }
  function setUserUI() {
    const username = localStorage.getItem('loggedUser');
    const users = getStoredUsers();
    const user = users.find(u => u.username === username);
    if(!user) return;
    document.getElementById('usernameDisplay').textContent = user.nombre;
    document.getElementById('userAvatarThumb').src = userAvatarOrDefault(user);
    document.getElementById('userAvatarThumb').style.display = "inline-block";
  }
  setUserUI();

  // --------- LOGOUT ---------
  document.getElementById('logoutBtn').onclick = function() {
    localStorage.removeItem("loggedUser");
    window.location.href = 'login.html';
  };

  // --------- Perfil/Configuración ---------
  document.getElementById('profileBtn').onclick = function() {
    menuLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-section="configuracion"]').classList.add('active');
    showSection('configuracion');
  };
  function renderPerfil() {
    const username = localStorage.getItem('loggedUser');
    const users = getStoredUsers();
    const user = users.find(u => u.username === username);
    if(!user) return;
    document.getElementById('perfilNombreInput').value = user.nombre;
    document.getElementById('perfilUsernameInput').value = user.username;
    document.getElementById('perfilForm').onsubmit = function(e){
      e.preventDefault();
      user.nombre = document.getElementById('perfilNombreInput').value.trim();
      const perfilAvatarInput = document.getElementById('perfilAvatarInput');
      if(perfilAvatarInput && perfilAvatarInput.files && perfilAvatarInput.files[0]){
        let reader = new FileReader();
        reader.onload = function(evt){
          user.avatar = evt.target.result;
          setStoredUsers(users);
          setUserUI();
        };
        reader.readAsDataURL(perfilAvatarInput.files[0]);
      } else {
        setStoredUsers(users);
        setUserUI();
      }
      alert('Perfil actualizado');
    };
  }

  // --------- Notificaciones simuladas ---------
  const notifBell = document.getElementById('notificationBell');
  const notifDropdown = document.getElementById('notifDropdown');
  let notifs = [
    {title:"Nuevo material en Módulos", time:"Hace 2h"},
    {title:"Tienes una nueva tarea", time:"Hace 1h"},
    {title:"Mensaje en Foro de Español", time:"Hace 40min"},
    {title:"¡Bienvenido a la plataforma!", time:"Hoy"},
  ];
  function renderNotifs() {
    notifDropdown.innerHTML = `<ul>${notifs.map(n=>`<li><div class="notif-title">${n.title}</div><div class="notif-time">${n.time}</div></li>`).join('')}</ul>`;
  }
  notifBell.onclick = function(){
    if(notifDropdown.style.display === 'block'){
      notifDropdown.style.display = 'none';
    } else {
      renderNotifs();
      notifDropdown.style.display = 'block';
      notifBell.classList.remove('has-unread');
    }
  };
  notifBell.classList.add('has-unread');
  document.body.addEventListener('click', e=>{
    if (!notifDropdown.contains(e.target) && e.target !== notifBell) notifDropdown.style.display = 'none';
  });

  // --------- Buscador Global ---------
  document.getElementById('globalSearch').addEventListener('input', function(){
    const val = this.value.trim().toLowerCase();
    // Puedes expandir la búsqueda a todos los recursos reales
    // Aquí solo ejemplo para anuncios y tareas
    if(val.length > 0) {
      let found = [];
      found = found.concat(anunciosData.filter(a=>a.titulo.toLowerCase().includes(val)));
      found = found.concat(tareasData.filter(t=>t.titulo.toLowerCase().includes(val)));
      notifDropdown.innerHTML = `<div style="font-weight:600;margin-bottom:.4em">Resultados:</div>
        <ul>${found.length ? found.map(f=>`<li>${f.titulo || f.title || "Sin título"}</li>`).join('') : "<li>No hay coincidencias</li>"}</ul>`;
      notifDropdown.style.display = 'block';
    } else {
      notifDropdown.style.display = 'none';
    }
  });

  // --------- GRUPOS ---------
  function gruposKey() {
    const u = localStorage.getItem("loggedUser") || "demo";
    return "grupos_" + u;
  }
  function cargarGrupos() {
    let g = localStorage.getItem(gruposKey());
    return g ? JSON.parse(g) : [];
  }
  function guardarGrupos(grupos) {
    localStorage.setItem(gruposKey(), JSON.stringify(grupos));
  }
  function renderGrupos() {
    const listaDiv = document.getElementById('gruposLista');
    const grupos = cargarGrupos();
    listaDiv.innerHTML = "";
    if (grupos.length === 0) {
      listaDiv.innerHTML = "<p style='color:#527ba0'>No has creado grupos.</p>";
      return;
    }
    grupos.forEach((g, idx) => {
      const d = document.createElement('div');
      d.className = "grupo-card";
      d.innerHTML = `<div class="grupo-titulo">${g.nombre}</div>
      <div class="grupo-desc">${g.descripcion}</div>
      <button class="btn" style="background:#527ba0;font-size:0.9em;" onclick="eliminarGrupo(${idx})">Eliminar</button>`;
      listaDiv.appendChild(d);
    });
  }
  window.eliminarGrupo = function(idx) {
    let grupos = cargarGrupos();
    grupos.splice(idx,1);
    guardarGrupos(grupos);
    renderGrupos();
  }
  document.getElementById('grupoForm').onsubmit = function(e) {
    e.preventDefault();
    const nombre = document.getElementById('grupoNombre').value.trim();
    const descripcion = document.getElementById('grupoDesc').value.trim();
    if (!nombre) return alert("El grupo debe tener nombre");
    let grupos = cargarGrupos();
    grupos.push({nombre, descripcion});
    guardarGrupos(grupos);
    this.reset();
    renderGrupos();
  };

  // --------- CALENDARIO ---------
  function calendarKey() {
    const u = localStorage.getItem("loggedUser") || "demo";
    return "eventosCalendar_" + u;
  }
  function cargarEventos() {
    let e = localStorage.getItem(calendarKey());
    return e ? JSON.parse(e) : [];
  }
  function guardarEventos(eventos) {
    localStorage.setItem(calendarKey(), JSON.stringify(eventos));
  }
  function renderCalendario(monthOffset = 0) {
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    if (typeof renderCalendario.mOffset === "number") {
      renderCalendario.mOffset += monthOffset;
    } else {
      renderCalendario.mOffset = 0;
    }
    let showMonth = new Date(currentYear, currentMonth + renderCalendario.mOffset, 1);
    let year = showMonth.getFullYear();
    let month = showMonth.getMonth();
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    document.getElementById('calendarMonth').textContent = meses[month] + " " + year;
    let firstDay = new Date(year, month, 1);
    let startDay = (firstDay.getDay() || 7)-1;
    let daysInMonth = new Date(year, month+1, 0).getDate();
    let tbody = document.getElementById('calendarBody');
    tbody.innerHTML = "";
    let row = document.createElement('tr');
    for(let i=0; i<startDay; i++) row.appendChild(document.createElement('td'));
    let eventos = cargarEventos();
    let fechaISO = "";
    for(let d=1; d<=daysInMonth; d++) {
      if ((row.children.length) % 7 === 0 && d !== 1) {
        tbody.appendChild(row);
        row = document.createElement('tr');
      }
      let td = document.createElement('td');
      fechaISO = year + "-" + String(month+1).padStart(2,'0') + "-" + String(d).padStart(2,'0');
      td.textContent = d;
      if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) td.classList.add('today');
      if (eventos.some(ev => ev.fecha === fechaISO)) td.classList.add('event-day');
      td.onclick = function() {
        document.getElementById('eventDate').value = fechaISO;
        document.getElementById('eventTitle').focus();
      }
      row.appendChild(td);
    }
    while (row.children.length<7) row.appendChild(document.createElement('td'));
    tbody.appendChild(row);
    let eventosList = document.getElementById('calendarEventsList');
    eventosList.innerHTML = "";
    eventos.filter(ev=>ev.fecha.slice(0,7)===fechaISO.slice(0,7))
      .sort((a,b)=>a.fecha.localeCompare(b.fecha))
      .forEach(ev=>{
        let li = document.createElement('li');
        li.innerHTML = `<span class="event-date">${ev.fecha}</span>: <b>${ev.titulo}</b> ${ev.descripcion?("("+ev.descripcion+")"):""}
        <button style="font-size:0.9em;background:#527ba0;border-radius:5px;border:none;margin-left:0.6em;color:#fff;cursor:pointer;" onclick="eliminarEvento('${ev.fecha}','${ev.titulo.replace(/'/g,"")}')">Eliminar</button>`;
        eventosList.appendChild(li);
      });
  }
  window.eliminarEvento = function(fecha,titulo) {
    let eventos = cargarEventos();
    guardarEventos(eventos.filter(ev=>!(ev.fecha===fecha&&ev.titulo===titulo)));
    renderCalendario(0);
  }
  document.getElementById('prevMonthBtn').onclick = ()=>renderCalendario(-1);
  document.getElementById('nextMonthBtn').onclick = ()=>renderCalendario(1);
  document.getElementById('calendarEventForm').onsubmit = function(e){
    e.preventDefault();
    let fecha = document.getElementById('eventDate').value;
    let titulo = document.getElementById('eventTitle').value.trim();
    let descripcion = document.getElementById('eventDesc').value.trim();
    if (!fecha || !titulo) return alert("El evento debe tener fecha y título");
    let eventos = cargarEventos();
    eventos.push({fecha, titulo, descripcion});
    guardarEventos(eventos);
    this.reset();
    renderCalendario(0);
  };

  // --------- Datos simulados para secciones ---------
  // Anuncios
  const anunciosData = [
    {titulo:"Nuevo módulo: Expresiones coloquiales", contenido:"¡Ya disponible el nuevo módulo de expresiones coloquiales!"},
    {titulo:"Horario de tutoría actualizado", contenido:"Consulta el calendario para ver los nuevos horarios."}
  ];
  function renderAnuncios() {
    const anunciosList = document.getElementById('anunciosList');
    anunciosList.innerHTML = anunciosData.map(a=>`<li><b>${a.titulo}</b><p>${a.contenido}</p></li>`).join("");
  }
  // Modulos
  const modulosData = [
    {titulo:"Gramática básica", desc:"Aprende los fundamentos del español."},
    {titulo:"Conversación", desc:"Practica el habla real y fluida."}
  ];
  function renderModulos() {
    const modulosList = document.getElementById('modulosList');
    modulosList.innerHTML = modulosData.map(m=>`<li><b>${m.titulo}</b> - ${m.desc}</li>`).join("");
  }
  // Tareas
  const tareasData = [
    {titulo:"Redacción: Mi día favorito", fecha:"2025-05-28"},
    {titulo:"Cuestionario de gramática", fecha:"2025-05-30"}
  ];
  function renderTareas() {
    const tareasList = document.getElementById('tareasList');
    tareasList.innerHTML = tareasData.map(t=>`<li><b>${t.titulo}</b> - Entregar antes de ${t.fecha}</li>`).join("");
  }
  // Foros
  const forosData = [
    {titulo:"Dudas de pronunciación", posts:12},
    {titulo:"Presentaciones personales", posts:7}
  ];
  function renderForos() {
    const forosList = document.getElementById('forosList');
    forosList.innerHTML = forosData.map(f=>`<li><b>${f.titulo}</b> - ${f.posts} mensajes</li>`).join("");
  }
  // Evaluaciones
  const evalsData = [
    {titulo:"Evaluación inicial", fecha:"2025-06-05"},
    {titulo:"Examen oral", fecha:"2025-06-15"}
  ];
  function renderEvals() {
    const evalsList = document.getElementById('evalsList');
    evalsList.innerHTML = evalsData.map(e=>`<li><b>${e.titulo}</b> - Fecha: ${e.fecha}</li>`).join("");
  }
  // Calificaciones
  function renderCalificaciones() {
    document.getElementById('calificacionesContent').innerHTML =
      `<ul>
        <li>Gramática básica: <b>9.5</b></li>
        <li>Conversación: <b>8.8</b></li>
        <li>Redacción: <b>9.0</b></li>
      </ul>`;
  }
  // Archivos
  const archivosData = [
    {titulo:"PDF: Guía de estudio", url:"#"},
    {titulo:"Audio: Diálogos", url:"#"}
  ];
  function renderArchivos() {
    const archivosList = document.getElementById('archivosList');
    archivosList.innerHTML = archivosData.map(a=>`<li><a href="${a.url}">${a.titulo}</a></li>`).join("");
  }
  // Personas
  const personasData = [
    {nombre:"María González", rol:"Estudiante"},
    {nombre:"Juan Pérez", rol:"Profesor"}
  ];
  function renderPersonas() {
    const personasList = document.getElementById('personasList');
    personasList.innerHTML = personasData.map(p=>`<li>${p.nombre} - ${p.rol}</li>`).join("");
  }

  // --------- Inicialización ---------
  renderGrupos();
  renderCalendario();
  renderAnuncios();
  renderModulos();
  renderTareas();
  renderForos();
  renderEvals();
  renderCalificaciones();
  renderArchivos();
  renderPersonas();
}
