/* Datos del hub: posiciones (salen de out/layout.json de Blender, normalizadas 0..1
   sobre un lienzo de 1920x1080) y textos de cada mundo.
   Si se vuelve a renderizar el hub, actualiza las posiciones aquí. */
window.DATOS = {
  lienzo: [1920, 1080],
  mascota: { bbox: [0.443, 0.5499, 0.557, 0.8644] },
  mundos: [
    {
      id: 1,
      titulo: "Fundamentos de IA",
      subtitulo: "Porqué, casos de uso, tokens y prompts",
      emblema: "cerebro",
      layout: {
        cx: 0.1782, cy: 0.3432,
        bbox: [0.047, 0.2127, 0.2907, 0.534],
        disco: [0.1198, 0.2581, 0.2304, 0.433],
        hover: [0.02604, 0.19259, 0.31146, 0.55556]
      }
    },
    {
      id: 2,
      titulo: "¿Qué es MiA?",
      subtitulo: "Propósito corporativo y arquitectura de modelos",
      emblema: "pantalla",
      layout: {
        cx: 0.4006, cy: 0.3362,
        bbox: [0.2945, 0.2156, 0.501, 0.5051],
        disco: [0.3544, 0.2576, 0.4443, 0.4149],
        hover: [0.27396, 0.19444, 0.52187, 0.52593]
      }
    },
    {
      id: 3,
      titulo: "Ecosistema MiA",
      subtitulo: "Herramientas especializadas del portafolio",
      emblema: "herramientas",
      layout: {
        cx: 0.5994, cy: 0.3362,
        bbox: [0.4993, 0.2156, 0.7016, 0.5051],
        disco: [0.5557, 0.2576, 0.6456, 0.4149],
        hover: [0.47917, 0.19444, 0.72188, 0.52593]
      }
    },
    {
      id: 4,
      titulo: "Uso Responsable",
      subtitulo: "Políticas de datos, seguridad y buenas prácticas",
      emblema: "escudo",
      layout: {
        cx: 0.8218, cy: 0.3432,
        bbox: [0.7175, 0.2127, 0.9506, 0.534],
        disco: [0.7696, 0.2581, 0.8802, 0.433],
        hover: [0.69688, 0.19259, 0.97083, 0.55556]
      }
    }
  ]
};
