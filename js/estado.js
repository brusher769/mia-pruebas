/* Progreso de la persona. Se guarda en el navegador (localStorage).
   Si el navegador lo bloquea, la página sigue funcionando con el estado en memoria. */
const Estado = (() => {
  const CLAVE = "mia_estado_v1";
  const TOTAL = 4;

  const base = () => ({
    nombre: "",
    // estrellas: 0 = sin estrellas, 1 = bronce, 2 = plata, 3 = oro
    mundos: { 1: { completado: false, estrellas: 0 }, 2: { completado: false, estrellas: 0 },
              3: { completado: false, estrellas: 0 }, 4: { completado: false, estrellas: 0 } },
    vistos: {} // mundos cuyo desbloqueo ya se mostró
  });

  let datos = base();

  function cargar() {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (crudo) {
        const g = JSON.parse(crudo);
        const b = base();
        datos = { ...b, ...g, mundos: { ...b.mundos, ...(g.mundos || {}) }, vistos: { ...(g.vistos || {}) } };
      }
    } catch (e) { /* sin almacenamiento: seguimos en memoria */ }
  }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e) { /* ignorar */ }
  }

  return {
    TOTAL,
    cargar,
    get nombre() { return datos.nombre; },
    setNombre(n) { datos.nombre = String(n || "").trim(); guardar(); },
    desbloqueado(id) { return id === 1 || !!datos.mundos[id - 1]?.completado; },
    completado(id) { return !!datos.mundos[id]?.completado; },
    estrellas(id) { return datos.mundos[id]?.estrellas || 0; },
    completar(id, estrellas = 1) {
      const m = datos.mundos[id];
      m.completado = true;
      m.estrellas = Math.max(m.estrellas, estrellas);
      guardar();
    },
    completados() { return Object.values(datos.mundos).filter(m => m.completado).length; },
    porcentaje() { return Math.round((this.completados() / TOTAL) * 100); },
    siguiente() { for (let i = 1; i <= TOTAL; i++) if (!datos.mundos[i].completado) return i; return null; },
    visto(id) { return !!datos.vistos[id]; },
    marcarVisto(id) { datos.vistos[id] = true; guardar(); },
    reiniciar() { const n = datos.nombre; datos = base(); datos.nombre = n; guardar(); }
  };
})();
