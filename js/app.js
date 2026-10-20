/* MiA de Carvajal — hub. Orquesta las capas que salen de Blender:
   fondo, portales, mascota, videos de hover y (cuando existan) los cortes de entrada. */
(() => {
  "use strict";

  const W = 1920, H = 1080;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esperar = ms => new Promise(r => setTimeout(r, ms));
  const pct = n => (n * 100).toFixed(3) + "%";
  const num2 = n => String(n).padStart(2, "0");
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DEBUG = new URLSearchParams(location.search).has("debug");

  const stage = $("#stage");
  let transicion = false;
  let mundoActivo = null;
  let animMascota = null;
  const pendientes = [];

  /* ---------- Escala del escenario ---------- */
  function ajustar() {
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  addEventListener("resize", ajustar);
  ajustar();

  /* ---------- Logos: usan el archivo si existe, si no un texto provisional ---------- */
  function cargarLogos() {
    const archivos = { mia: "assets/ui/logo_mia_carvajal.png", carvajal: "assets/ui/logo_carvajal.png" };
    $$("[data-logo]").forEach(slot => {
      const tipo = slot.dataset.logo;
      const provisional = () => {
        slot.innerHTML = tipo === "mia"
          ? `<div class="logo-texto">MiA<small>de Carvajal</small></div>`
          : `<svg viewBox="0 0 64 64" width="86" height="86" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="none" stroke="#fff" stroke-width="5"/><circle cx="32" cy="32" r="12" fill="#c9f53a"/></svg>`;
      };
      provisional();
      const img = new Image();
      img.alt = tipo === "mia" ? "MiA de Carvajal" : "Carvajal";
      img.onload = () => { slot.innerHTML = ""; slot.appendChild(img); };
      img.src = archivos[tipo];
    });
  }

  /* ---------- Precarga con barra de progreso ---------- */
  function precargar(onProgreso) {
    const imgs = ["assets/hub/hub_bg.jpg", "assets/hub/mascota_espalda.png",
      ...DATOS.mundos.map(m => `assets/hub/portal_${num2(m.id)}.png`)];
    const vids = DATOS.mundos.map(m => `assets/video/hover_${num2(m.id)}.webm`);
    const total = imgs.length + vids.length;
    let hechos = 0;
    const sube = () => { hechos++; onProgreso(hechos / total); };

    const pi = imgs.map(src => new Promise(res => {
      const i = new Image();
      i.onload = i.onerror = () => { sube(); res(); };
      i.src = src;
    }));
    const pv = vids.map(src => new Promise(res => {
      const v = document.createElement("video");
      let listo = false;
      const fin = () => { if (listo) return; listo = true; sube(); res(); };
      v.preload = "auto"; v.muted = true;
      v.addEventListener("canplaythrough", fin, { once: true });
      v.addEventListener("error", fin, { once: true });
      setTimeout(fin, 8000);
      v.src = src;
    }));
    return Promise.all([...pi, ...pv]);
  }

  /* ---------- Pantallas ---------- */
  function mostrar(id) {
    $$(".pantalla").forEach(p => p.classList.toggle("activa", p.id === id));
  }

  /* ---------- Hub: construcción ---------- */
  function construirHub() {
    const cont = $("#portales");
    cont.innerHTML = "";
    DATOS.mundos.forEach(m => {
      const { cx, bbox: b, disco: d, hover: h } = m.layout;
      const dcx = (d[0] + d[2]) / 2, dcy = (d[1] + d[3]) / 2, dw = d[2] - d[0], dh = d[3] - d[1];
      const n = num2(m.id);
      const el = document.createElement("div");
      el.className = "portal";
      el.dataset.id = m.id;
      el.innerHTML = `
        <img class="capa portal-img" src="assets/hub/portal_${n}.png" alt="">
        <video class="hover-video" src="assets/video/hover_${n}.webm" muted loop playsinline preload="auto"
          style="left:${pct(h[0])};top:${pct(h[1])};width:${pct(h[2] - h[0])};height:${pct(h[3] - h[1])}"></video>
        <div class="emblema" style="left:${pct(dcx)};top:${pct(dcy)}">${ICONOS[m.emblema]}</div>
        <div class="candado" style="left:${pct(dcx)};top:${pct(dcy)}">${ICONOS.candado}</div>
        <div class="num" style="left:${pct(cx)};top:${pct(b[1] - 0.074)}">${n}</div>
        <div class="tarjeta" style="left:${pct(cx)};top:${pct(b[3] - 0.052)}">
          <b>${m.titulo}</b><span>${m.subtitulo}</span><div class="marca">${ICONOS.check}</div>
        </div>
        <button class="portal-hit" type="button" aria-label="Mundo ${n}: ${m.titulo}"
          style="left:${pct(dcx)};top:${pct(dcy)};width:${pct(dw * 1.34)};height:${pct(dh * 1.34)}"></button>`;
      cont.appendChild(el);

      const video = $(".hover-video", el);
      let temporizador = null;
      const activar = () => {
        clearTimeout(temporizador);
        if (transicion || el.classList.contains("bloqueado") || el.classList.contains("activo")) return;
        el.classList.add("activo");
        video.currentTime = 0;
        video.play().catch(() => {});
      };
      const desactivar = () => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
          if (transicion) return;
          el.classList.remove("activo");
          setTimeout(() => { if (!el.classList.contains("activo")) video.pause(); }, 400);
        }, 70);
      };
      [$(".portal-hit", el), $(".tarjeta", el)].forEach(nodo => {
        nodo.addEventListener("mouseenter", activar);
        nodo.addEventListener("mouseleave", desactivar);
        nodo.addEventListener("click", () => irAMundo(m.id));
      });
      $(".portal-hit", el).addEventListener("focus", activar);
      $(".portal-hit", el).addEventListener("blur", desactivar);
    });
    construirMinimapa();
  }

  /* ---------- Minimapa: posiciones calculadas a partir del layout real ---------- */
  function construirMinimapa() {
    const NS = "http://www.w3.org/2000/svg";
    const pts = DATOS.mundos.map(m => ({
      id: m.id,
      x: 50 + (m.layout.cx - 0.5) * 100,
      y: 33 + (m.layout.bbox[3] - 0.5051) * (8 / 0.0289)
    }));
    const plaza = { x: 50, y: 56 };
    let s = `<svg viewBox="0 0 100 100" xmlns="${NS}">
      <defs><radialGradient id="mmFondo" cx="50%" cy="60%" r="70%"><stop offset="0" stop-color="#3fae4f"/><stop offset="1" stop-color="#1b6f3a"/></radialGradient></defs>
      <rect width="100" height="100" fill="url(#mmFondo)"/>
      <g stroke="#e8d3a2" stroke-width="5" stroke-linecap="round" fill="none" opacity=".95">
        <path d="M50 92V${plaza.y}"/>
        ${pts.map(p => `<path d="M${plaza.x} ${plaza.y}L${p.x.toFixed(1)} ${(p.y + 3).toFixed(1)}"/>`).join("")}
      </g>
      <circle cx="${plaza.x}" cy="${plaza.y}" r="8.5" fill="#f0e1b9" stroke="#d3bb85" stroke-width="1.2"/>
      ${pts.map(p => `<g data-mm="${p.id}">
          <circle class="mm-pulso" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7" fill="none" stroke="#c9f53a" stroke-width="1.6" opacity="0"/>
          <circle class="mm-punto" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="7" fill="#7d889b" stroke="#fff" stroke-width="1.6"/>
          <text x="${p.x.toFixed(1)}" y="${(p.y + 2.6).toFixed(1)}" text-anchor="middle" font-size="7.4" font-weight="800" fill="#0b2a55" font-family="Segoe UI, sans-serif">${p.id}</text>
        </g>`).join("")}
      <path d="M50 78L57 93L50 88.5L43 93Z" fill="#fff" stroke="#0d3a8a" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>`;
    $("#minimapa").innerHTML = s;
  }

  function actualizarMinimapa() {
    const sig = Estado.siguiente();
    $$("#minimapa [data-mm]").forEach(g => {
      const id = Number(g.dataset.mm);
      const punto = $(".mm-punto", g), pulso = $(".mm-pulso", g);
      const libre = visualLibre(id);
      punto.setAttribute("fill", Estado.completado(id) ? "#c9f53a" : libre ? "#5fd6ff" : "#7d889b");
      pulso.setAttribute("opacity", libre && id === sig ? "1" : "0");
    });
  }

  /* ---------- Estado visual del hub ---------- */
  // Un mundo recién desbloqueado se ve gris hasta que corre su animación de desbloqueo.
  const visualLibre = id => Estado.desbloqueado(id) && (id === 1 || Estado.visto(id));

  function textoObjetivo() {
    const sig = Estado.siguiente();
    if (Estado.completados() === 0) return "Selecciona un portal para comenzar tu aventura con MiA.";
    if (sig === null) return "¡Completaste los 4 mundos! Muy pronto podrás reclamar tu diploma.";
    return `Entra al portal ${num2(sig)}: ${DATOS.mundos[sig - 1].titulo}.`;
  }

  function actualizarHub() {
    DATOS.mundos.forEach(m => {
      const el = $(`.portal[data-id="${m.id}"]`);
      el.classList.toggle("bloqueado", !visualLibre(m.id));
      el.classList.toggle("completado", Estado.completado(m.id));
      $(".portal-hit", el).setAttribute("aria-disabled", String(!visualLibre(m.id)));
      if (m.id === 1 && !Estado.visto(1)) Estado.marcarVisto(1);
      if (Estado.desbloqueado(m.id) && !Estado.visto(m.id) && !pendientes.includes(m.id)) pendientes.push(m.id);
    });
    $("#objetivo-txt").textContent = textoObjetivo();
    const p = Estado.porcentaje();
    $("#prog-pct").textContent = p + "%";
    $("#prog-barra").style.width = p + "%";
    $("#carga-barra-rol").setAttribute("aria-valuenow", String(p));
    actualizarMinimapa();
  }

  function chispas(x, y) {
    if (reducido) return;
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("div");
      const a = Math.random() * Math.PI * 2, r = 90 + Math.random() * 130;
      s.className = "chispa";
      s.style.left = x + "px"; s.style.top = y + "px";
      s.style.setProperty("--dx", Math.cos(a) * r + "px");
      s.style.setProperty("--dy", Math.sin(a) * r + "px");
      $("#s-hub").appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  async function revisarDesbloqueos() {
    while (pendientes.length) {
      const id = pendientes.shift();
      const m = DATOS.mundos[id - 1];
      const el = $(`.portal[data-id="${id}"]`);
      Estado.marcarVisto(id);
      el.classList.remove("bloqueado");
      el.classList.add("desbloqueando");
      const d = m.layout.disco;
      chispas(((d[0] + d[2]) / 2) * W, ((d[1] + d[3]) / 2) * H);
      toast(`¡Mundo ${num2(id)} desbloqueado!`);
      actualizarHub();
      await esperar(1700);
      el.classList.remove("desbloqueando");
    }
  }

  /* ---------- Avisos ---------- */
  let tToast = null;
  function toast(txt) {
    const t = $("#toast");
    t.textContent = txt;
    t.classList.add("visible");
    clearTimeout(tToast);
    tToast = setTimeout(() => t.classList.remove("visible"), 2600);
  }

  function rechazar(id) {
    const el = $(`.portal[data-id="${id}"]`);
    el.classList.remove("sacudir");
    void el.offsetWidth;
    el.classList.add("sacudir");
    toast(`Completa el mundo ${num2(id - 1)} para abrir este portal.`);
  }

  /* ---------- Entrada al portal ---------- */
  async function destello(encender) {
    $("#flash").classList.toggle("visible", encender);
    await esperar(reducido ? 60 : 480);
  }

  // Si existe assets/video/corte_0N.mp4 se usa; si no, un salto provisional de la mascota.
  function probarCorte(src) {
    return new Promise(res => {
      const v = $("#corte");
      let listo = false;
      const fin = ok => { if (listo) return; listo = true; res(ok); };
      v.addEventListener("canplay", () => fin(true), { once: true });
      v.addEventListener("error", () => fin(false), { once: true });
      v.src = src;
      v.load();
      setTimeout(() => fin(false), 4000);
    });
  }

  async function reproducirCorte() {
    const v = $("#corte");
    v.classList.add("visible");
    v.currentTime = 0;
    try { await v.play(); } catch (e) { return; }
    await new Promise(res => {
      v.addEventListener("ended", res, { once: true });
      setTimeout(res, ((v.duration || 6) + 1.5) * 1000);
    });
  }

  async function saltoProvisional(m) {
    const el = $("#mascota");
    const mb = DATOS.mascota.bbox, d = m.layout.disco;
    const dx = ((d[0] + d[2]) / 2 - (mb[0] + mb[2]) / 2) * W;
    const dy = ((d[1] + d[3]) / 2 * H + 70) - mb[3] * H;
    animMascota = el.animate([
      { transform: "translate(0,0) scale(1,1)", opacity: 1, offset: 0 },
      { transform: "translate(0,0) scale(1.06,.9)", opacity: 1, offset: 0.12 },
      { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 150}px) scale(.62)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: 1, offset: 0.9 },
      { transform: `translate(${dx}px,${dy}px) scale(.02)`, opacity: 0, offset: 1 }
    ], { duration: reducido ? 300 : 1700, easing: "ease-in-out", fill: "forwards" });
    await animMascota.finished.catch(() => {});
  }

  async function irAMundo(id) {
    if (transicion) return;
    if (!visualLibre(id)) { rechazar(id); return; }
    transicion = true;
    const m = DATOS.mundos[id - 1];
    document.body.classList.add("en-transicion");
    $("#hud").classList.add("oculto-suave");
    const portal = $(`.portal[data-id="${id}"]`);
    portal.classList.add("activo");
    const hv = $(".hover-video", portal);
    hv.currentTime = 0; hv.play().catch(() => {});

    const hayCorte = await probarCorte(`assets/video/corte_${num2(id)}.mp4`);
    if (hayCorte) await reproducirCorte(); else await saltoProvisional(m);

    await destello(true);
    mostrarMundo(m);
    $("#corte").classList.remove("visible");
    if (animMascota) { animMascota.cancel(); animMascota = null; }
    portal.classList.remove("activo");
    hv.pause();
    document.body.classList.remove("en-transicion");
    await destello(false);
    transicion = false;
  }

  /* ---------- Pantalla de mundo (provisional) ---------- */
  function mostrarMundo(m) {
    mundoActivo = m;
    $("#mundo-emblema").innerHTML = ICONOS[m.emblema];
    $("#mundo-num").textContent = `MUNDO ${num2(m.id)}`;
    $("#mundo-titulo").textContent = m.titulo;
    $("#mundo-sub").textContent = m.subtitulo;
    mostrar("s-mundo");
  }

  async function volverAlHub() {
    if (transicion || !mundoActivo) return;
    transicion = true;
    await destello(true);
    mundoActivo = null;
    $("#hud").classList.remove("oculto-suave");
    actualizarHub();
    mostrar("s-hub");
    await destello(false);
    transicion = false;
    await esperar(300);
    revisarDesbloqueos();
  }

  /* ---------- Inicio ---------- */
  function entrarAlHub() {
    construirHub();
    actualizarHub();
    mostrar("s-hub");
    setTimeout(revisarDesbloqueos, 900);
  }

  async function iniciar() {
    Estado.cargar();
    cargarLogos();
    await precargar(p => {
      $("#carga-barra").style.width = Math.round(p * 100) + "%";
      $("#carga-barra-rol").setAttribute("aria-valuenow", String(Math.round(p * 100)));
    });
    await esperar(350);
    $("#carga-estado").classList.add("oculto");
    if (Estado.nombre) {
      $("#nombre-guardado").textContent = Estado.nombre;
      $("#bienvenida").classList.remove("oculto");
      $("#btn-continuar").focus();
    } else {
      $("#form-nombre").classList.remove("oculto");
      $("#nombre").focus();
    }
  }

  $("#form-nombre").addEventListener("submit", e => {
    e.preventDefault();
    const n = $("#nombre").value.trim();
    if (n.length < 2) { $("#nombre").focus(); return; }
    Estado.setNombre(n);
    entrarAlHub();
  });
  $("#btn-continuar").addEventListener("click", entrarAlHub);
  $("#btn-cambiar").addEventListener("click", () => {
    $("#bienvenida").classList.add("oculto");
    $("#form-nombre").classList.remove("oculto");
    $("#nombre").value = "";
    $("#nombre").focus();
  });
  $("#btn-volver").addEventListener("click", volverAlHub);
  $("#btn-completar").addEventListener("click", () => {
    if (mundoActivo) Estado.completar(mundoActivo.id, 3);
    volverAlHub();
  });
  addEventListener("keydown", e => { if (e.key === "Escape" && mundoActivo) volverAlHub(); });

  /* ---------- Herramientas de prueba (solo con ?debug en la dirección) ---------- */
  if (DEBUG) {
    $("#btn-completar").classList.remove("oculto");
    const p = $("#panel-debug");
    p.classList.remove("oculto");
    p.innerHTML = `<span>Prueba:</span>` +
      DATOS.mundos.map(m => `<button data-c="${m.id}">Completar ${m.id}</button>`).join("") +
      `<button data-r="1">Reiniciar</button>`;
    p.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.r) { Estado.reiniciar(); location.reload(); return; }
      Estado.completar(Number(b.dataset.c), 3);
      if ($("#s-hub").classList.contains("activa")) { actualizarHub(); revisarDesbloqueos(); }
    });
  }

  iniciar();
})();
