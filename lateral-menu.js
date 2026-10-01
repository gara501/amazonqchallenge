import { getSceneController } from './scene-controller.js?v=9';

const chapters = [
  { type: 'crt', name: 'Origen', title: 'EL INFINITO', accent: 'ESTÁ VIVO.', description: 'Una espiral nace del pulso y vuelve sobre sí misma. Cada giro repite una forma distinta: el infinito empieza donde mueves la mano.' },
  { type: 'sierpinski', name: 'Sierpinski', title: 'ORDEN DENTRO', accent: 'DEL CAOS.', description: 'Un triángulo se divide, deja un vacío y repite el gesto en cada fragmento. Lo que desaparece también dibuja la forma.', symbol: 'EL VACÍO CREA ESPACIO', reading: 'El triángulo se repliega una y otra vez. Como imagen espiritual, ese vacío puede recordar el Tzimtzum: retirarse para que algo nuevo pueda nacer.' },
  { type: 'fractal', name: 'Julia', title: 'OTRO MUNDO', accent: 'EN CADA PUNTO.', description: 'Cada punto recorre la misma ecuación, pero un solo valor cambia su destino. Al mover el cursor, nacen fronteras de mundos posibles.', symbol: 'MUNDOS POSIBLES', reading: 'Al fijar un solo valor, aparece un universo distinto. Es fácil leer en esas formas una imagen de nuestros estados interiores: una mínima variación transforma el paisaje entero.' },
  { type: 'mandelbrot', name: 'Mandelbrot', title: 'NUNCA VERÁS', accent: 'EL FINAL.', description: 'Una regla mínima decide qué puntos permanecen y cuáles escapan. En su frontera, cada acercamiento revela otro paisaje sin fin.', symbol: 'EL TODO EN LA PARTE', reading: 'Sus ecos a distintas escalas inspiran la idea del microcosmos dentro del macrocosmos. Una frontera acotada abre la imaginación hacia lo inagotable.' },
  { type: 'newton', name: 'Newton', title: 'TODO BUSCA', accent: 'SU EQUILIBRIO.', description: 'Cada punto busca una raíz. El camino de sus aproximaciones tiñe el plano, y entre destinos vecinos aparecen fronteras inesperadas.', symbol: 'CAMINOS Y DESTINOS', reading: 'Cada punto avanza hacia una raíz; comienzos muy cercanos pueden llegar a lugares distintos. Una metáfora de la elección y de las consecuencias de un gesto pequeño.' },
  { type: 'menger', name: 'Menger', title: 'VACÍO QUE', accent: 'TOMA FORMA.', description: 'Un cubo pierde su centro y repite la ausencia a menor escala. La materia se adelgaza; el vacío, en cambio, se vuelve arquitectura.', symbol: 'LO QUE SOSTIENE EL VACÍO', reading: 'Al retirar materia, la estructura se vuelve más visible. Puede evocar la idea de Maya: la solidez como apariencia atravesada por espacios que también dan forma.' },
  { type: 'koch', name: 'Koch', title: 'UNA LÍNEA', accent: 'SIN FIN.', description: 'Cada tramo se quiebra en otros más pequeños. La curva crece sin agotar jamás su detalle: una costa imaginaria hecha de repeticiones.', symbol: 'EL BORDE INAGOTABLE', reading: 'En su construcción ideal, el perímetro crece sin límite mientras la figura permanece acotada. Una imagen de lo inmenso contenido en un lugar pequeño.' },
  { type: 'blood', name: 'Vasos', title: 'PATRONES', accent: 'QUE VIVEN.', description: 'Como ríos bajo la piel, las ramas se bifurcan y vuelven a bifurcarse. La vida encuentra caminos multiplicando una misma forma.', symbol: 'LA FORMA QUE CONECTA', reading: 'Venas, ríos y raíces comparten el gesto de bifurcarse. En una lectura simbólica, recuerdan al Árbol de la Vida: muchos caminos nacidos de una misma fuente.' },
  { type: 'atoms', name: 'Átomos', title: 'EL UNIVERSO', accent: 'EN LO MÍNIMO.', description: 'Esta escena imagina átomos en movimiento. No es un fractal clásico, pero su danza recuerda que un patrón puede resonar entre escalas.', symbol: 'MUNDOS DENTRO DE MUNDOS', reading: 'Esta escena usa una analogía visual, no un modelo físico del átomo. Invita a imaginar escalas anidadas, como universos alojados unos dentro de otros.' }
];

class LateralMenu {
  constructor() {
    this.sceneController = getSceneController();
    this.nav = document.createElement('nav');
    this.nav.className = 'chapter-nav';
    this.nav.setAttribute('aria-label', 'Seleccionar fractal');
    this.nav.innerHTML = `
      <div class="chapter-nav-top"><span>EXPLORA LOS UNIVERSOS</span><span id="chapter-counter">01 <span>/ 09</span></span></div>
      <div class="chapter-list"></div>
      <div class="chapter-nav-bottom"><span>← &nbsp;→ &nbsp; CAMBIAR DE ESCENA</span><span>HECHO DE MATEMÁTICAS Y CURIOSIDAD</span></div>`;
    document.body.appendChild(this.nav);
    this.list = this.nav.querySelector('.chapter-list');

    chapters.forEach((chapter, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chapter-button';
      button.dataset.scene = chapter.type;
      button.innerHTML = `<span class="chapter-number">${String(index + 1).padStart(2, '0')}</span><span class="chapter-name">${chapter.name}</span>`;
      button.addEventListener('click', () => this.sceneController.createScene(chapter.type));
      this.list.appendChild(button);
    });

    window.addEventListener('scene-changed', event => this.update(event.detail.sceneNumber));
    document.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
      if (document.getElementById('loading-screen')?.style.display !== 'none') return;
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = (this.sceneController.currentSceneNumber - 1 + step + chapters.length) % chapters.length;
      this.sceneController.createScene(chapters[next].type);
    });
    this.update(this.sceneController.currentSceneNumber);
  }

  update(sceneNumber) {
    const index = Math.max(0, Math.min(chapters.length - 1, sceneNumber - 1));
    const chapter = chapters[index];
    this.nav.querySelectorAll('.chapter-button').forEach((button, i) => {
      button.classList.toggle('active', i === index);
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    document.getElementById('chapter-counter').innerHTML = `${String(sceneNumber).padStart(2, '0')} <span>/ 09</span>`;
    document.getElementById('scene-eyebrow').textContent = `${String(sceneNumber).padStart(2, '0')} / 09  —  ${chapter.name.toUpperCase()}`;
    document.getElementById('scene-heading').innerHTML = `${chapter.title}<br><em>${chapter.accent}</em>`;
    document.getElementById('scene-description').textContent = chapter.description;
    document.body.dataset.scene = String(sceneNumber);
    this.list.querySelector('.active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.lateralMenu = new LateralMenu();
});

export { LateralMenu, chapters };
