const endpoint = 'https://rickandmortyapi.com/api/location';
const claveBusqueda = 'atlas-ubicaciones-ultima-busqueda';

const formulario = document.querySelector('#buscador');
const campoNombre = document.querySelector('#nombre');
const campoTipo = document.querySelector('#tipo');
const boton = document.querySelector('#buscar');
const mensaje = document.querySelector('#mensaje');
const tarjetas = document.querySelector('#resultados');

const mostrarMensaje = (texto, estado = '') => {
  mensaje.textContent = texto;
  mensaje.dataset.estado = estado;
};

const normalizarDato = (valor) => {
  const texto = typeof valor === 'string' ? valor.trim() : '';
  return texto && texto.toLowerCase() !== 'unknown' ? texto : 'Desconocido';
};

const crearTarjeta = (ubicacion) => {
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta';

  const titulo = document.createElement('h3');
  titulo.textContent = normalizarDato(ubicacion.name);

  const lista = document.createElement('dl');
  const datos = [
    ['Tipo', normalizarDato(ubicacion.type)],
    ['Dimensión', normalizarDato(ubicacion.dimension)],
    ['Residentes', ubicacion.residents.length],
  ];

  for (const [etiqueta, valor] of datos) {
    const fila = document.createElement('div');
    const termino = document.createElement('dt');
    const detalle = document.createElement('dd');
    termino.textContent = etiqueta;
    detalle.textContent = valor;
    fila.append(termino, detalle);
    lista.append(fila);
  }

  tarjeta.append(titulo, lista);
  return tarjeta;
};

const pedirUbicaciones = async ({ nombre, tipo }) => {
  const url = new URL(endpoint);
  if (nombre) url.searchParams.set('name', nombre);
  if (tipo) url.searchParams.set('type', tipo);

  const respuesta = await fetch(url);
  if (respuesta.status === 404) return { total: 0, ubicaciones: [] };
  if (!respuesta.ok) throw new Error('La API respondió con un error');

  const datos = await respuesta.json();
  return { total: datos.info.count, ubicaciones: datos.results };
};

const guardarBusqueda = (criterios) => {
  try {
    localStorage.setItem(claveBusqueda, JSON.stringify(criterios));
  } catch {
    // La búsqueda sigue funcionando si el navegador bloquea el almacenamiento.
  }
};

const leerBusqueda = () => {
  try {
    const datos = JSON.parse(localStorage.getItem(claveBusqueda));
    if (typeof datos?.nombre === 'string' && typeof datos?.tipo === 'string') {
      return datos;
    }
  } catch {
    // Si el dato no se puede leer, el formulario empieza vacío.
  }
  return null;
};

const buscar = async () => {
  if (boton.disabled) return;

  const criterios = {
    nombre: campoNombre.value.trim(),
    tipo: campoTipo.value.trim(),
  };

  if (!criterios.nombre && !criterios.tipo) {
    mostrarMensaje('Ingresa un nombre o un tipo para buscar.');
    return;
  }

  guardarBusqueda(criterios);
  boton.disabled = true;
  tarjetas.replaceChildren();
  mostrarMensaje('Buscando…');

  try {
    const { total, ubicaciones } = await pedirUbicaciones(criterios);
    if (!ubicaciones.length) {
      mostrarMensaje('Sin resultados. Prueba con otro nombre o tipo.');
      return;
    }

    tarjetas.append(...ubicaciones.map(crearTarjeta));
    mostrarMensaje(ubicaciones.length === 1
      ? 'Se muestra 1 ubicación.'
      : `Se muestran ${ubicaciones.length} de ${total} ubicaciones.`);
  } catch {
    mostrarMensaje('No se pudo completar la búsqueda. Revisa tu conexión e inténtalo de nuevo.', 'error');
  } finally {
    boton.disabled = false;
  }
};

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  buscar();
});

const ultimaBusqueda = leerBusqueda();
if (ultimaBusqueda) {
  campoNombre.value = ultimaBusqueda.nombre;
  campoTipo.value = ultimaBusqueda.tipo;
  buscar();
}
