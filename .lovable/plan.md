
# Plan de Mejora Integral — SKY CLUB

Objetivo: elevar la web a nivel "luxury digital" con mejor conversión, rendimiento, accesibilidad y coherencia de marca, sin romper la estética actual (void black + molten gold).

Está organizado en 6 bloques. Puedes aprobar todo o decirme cuáles aplicar primero.

---

## 1. Identidad de marca y contenido real

Problema actual: textos genéricos tipo "lorem premium", imágenes de Unsplash, datos inventados (membresías, testimonios, transformaciones).

Acciones:
- Centralizar el contenido en `src/content/` (un archivo por sección: `barberia.ts`, `tienda.ts`, `libreria.ts`, `podcast.ts`, `gym.ts`, `membership.ts`, `testimonials.ts`). Esto te permite editar copy sin tocar componentes.
- Sustituir imágenes Unsplash por placeholders propios marcados como "REEMPLAZAR" para que tú subas fotos reales de la barbería, productos, equipo.
- Añadir bloque de **info real de contacto** en Footer: dirección, teléfono, horario, WhatsApp, Instagram, Google Maps embebido.
- Añadir sección "Equipo / Maestros barberos" con foto + bio breve (refuerza confianza).

## 2. Conversión y reservas (lo más importante)

La barbería debería convertir visitantes en citas. Hoy el CTA "Reservar Cita" abre un iframe a otra app Lovable.

Acciones:
- **Botón flotante WhatsApp** (esquina inferior derecha, junto al Concierge) con mensaje pre-rellenado: "Hola, quiero reservar [servicio]".
- En cada precio del acordeón de la barbería, añadir botón discreto "Reservar" que abre WhatsApp con ese servicio pre-rellenado.
- CTA sticky en mobile en la sección Barbería ("Reservar — desde 15€").
- Integrar (opcional) un sistema real de booking: Calendly embebido, Booksy, o un formulario propio con Lovable Cloud que envíe email + guarde en BD.

## 3. UX, navegación y estructura

Problemas detectados:
- Nav inferior con 7 iconos pero "Tienda", "Librería", "Gym" no aparecen como entradas directas.
- No hay indicación visible de que las cards del Bento son clickables hasta hover.
- En mobile el bento grid puede colapsar mal (muchas cards row-span 2).
- La sección Hero tapa el scroll indicator con el FloatingNav.

Acciones:
- Rehacer `FloatingNav` para incluir todas las secciones reales (Inicio, Barbería, Tienda, Librería, Podcast, Gym, Membresía, Contacto) o agruparlas en un menú "Servicios" desplegable.
- Añadir un pequeño "tag" dorado "Click para descubrir" sobre las cards del bento al cargar (desaparece tras 3s).
- Revisar grid responsive: en mobile cada card a 1 columna y altura propia.
- Subir el scroll indicator y reducir su tamaño para no chocar con la nav flotante.
- Header superior minimalista con logo + CTA "Reservar" siempre visible.

## 4. Rendimiento y técnica

Problemas:
- 60 estrellas animadas + storm clouds + orb pulsante + parallax = mucho repaint en Hero.
- Imágenes Unsplash a 800q80 sin formato moderno (webp/avif).
- `framer-motion` se carga eager en todas las secciones.
- No hay meta SEO ni Open Graph.

Acciones:
- Reducir estrellas en mobile (20 en vez de 60), pausar animaciones con `prefers-reduced-motion`.
- Migrar imágenes propias a `/public/images/` con `webp` + `loading="lazy"` + `decoding="async"` + `width/height` explícitos para evitar CLS.
- Lazy-load de secciones pesadas (`Testimonials`, `TransformationSlider`, `PodcastVisualizer`, `CommunityTeaser`) con `React.lazy` + `Suspense`.
- Añadir meta tags SEO en `index.html`: title, description, keywords, Open Graph (imagen 1200x630), Twitter Card, favicon dorado, theme-color.
- `sitemap.xml` y `robots.txt` correctos.
- Schema.org JSON-LD para `LocalBusiness` (barbería) → mejora ranking local en Google Maps.

## 5. Accesibilidad y pulido visual

- Añadir `alt` descriptivos reales en imágenes (no solo el título).
- Contraste: el texto `text-white/40` sobre void en algunos sitios falla WCAG AA. Subir a `/60` mínimo en párrafos largos.
- Focus states visibles dorados en todos los botones/links (hoy hay `focus-visible:ring` pero algunos botones lo pierden).
- Soporte `prefers-reduced-motion` global (desactiva parallax, audio wave, marquee).
- Página 404 (`NotFound.tsx`) con estética de marca, no la genérica.

## 6. Funcionalidades nuevas de alto impacto

Propuestas (puedes elegir cuáles activar):
- **Galería antes/después** real con fotos de cortes (sustituir el TransformationSlider de relleno).
- **Tarjeta regalo digital** (gift card) — formulario que envía un PDF al destinatario.
- **Newsletter** con Lovable Cloud: capturar emails para lanzamientos de la tienda y nuevos episodios del podcast.
- **Reseñas Google embebidas** automáticamente en la sección Testimonios.
- **Modo "ficha de servicio"**: al click en un precio, se abre un drawer con descripción detallada, duración, qué incluye, fotos.
- **Selector de idioma** ES/EN si hay público internacional.

---

## Implementación sugerida por fases

Fase 1 (impacto máximo, 1 sesión):
- WhatsApp flotante + botones reservar en precios
- Meta SEO + Open Graph + JSON-LD LocalBusiness
- Footer con contacto real (placeholders para que rellenes)
- Fix responsive mobile del Bento

Fase 2 (estructura, 1 sesión):
- Centralizar contenido en `src/content/`
- Rehacer FloatingNav completo + header con CTA
- Lazy-load de secciones pesadas + reducir animaciones en mobile

Fase 3 (extras, según prioridad tuya):
- Newsletter / Gift card / Drawer de servicio / Galería real

---

¿Apruebas el plan completo, prefieres ir solo con la Fase 1, o quieres que ajuste/elimine alguna parte antes de empezar?
