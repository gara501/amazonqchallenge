// The reverse of each reading card pairs the ideal mathematics with its history.
// Some shaders are artistic interpretations, so the copy distinguishes the two.
export const fractalFacts = {
  sierpinski: {
    formula: 'Aₙ = A₀ · (3/4)ⁿ',
    explanation: 'En la construcción ideal se retira el triángulo central en cada paso. Quedan 3ⁿ piezas y el área tiende a cero.',
    discovery: 'Wacław Sierpiński describió este conjunto en 1915, dentro de sus investigaciones sobre curvas y conjuntos.',
    source: 'https://mathworld.wolfram.com/SierpinskiSieve.html'
  },
  fractal: {
    formula: 'zₙ₊₁ = zₙ² + c   (c fijo)',
    explanation: 'Cada punto inicial se itera con el mismo valor de c. La frontera entre comportamientos estables y escapantes dibuja el conjunto.',
    discovery: 'Gaston Julia y Pierre Fatou desarrollaron la teoría de la iteración compleja entre 1917 y 1918. Julia continuó su trabajo durante la convalecencia por una herida de guerra.',
    source: 'https://mathshistory.st-andrews.ac.uk/Biographies/Julia/'
  },
  mandelbrot: {
    formula: 'z₀ = 0;   zₙ₊₁ = zₙ² + c',
    explanation: 'Cada píxel representa un valor de c. Pertenece al conjunto si su órbita no escapa al infinito.',
    discovery: 'Las primeras imágenes surgieron a fines de los setenta. Benoît Mandelbrot difundió visualizaciones desde IBM hacia 1980; ya había acuñado “fractal” en 1975.',
    source: 'https://www.ibm.com/history/fractal-geometry'
  },
  newton: {
    formula: 'zₙ₊₁ = zₙ − f(zₙ) / f′(zₙ)',
    explanation: 'El color indica a qué raíz converge cada punto inicial. Los límites entre cuencas de atracción pueden ser fractales.',
    discovery: 'El método nace del trabajo de Isaac Newton en el siglo XVII. La computación hizo visible la complejidad de sus cuencas en el plano complejo.',
    source: 'https://www.ams.org/bookstore/pspdf/cbms-120-prev.pdf'
  },
  menger: {
    formula: 'Nₙ = 20ⁿ;   Vₙ = V₀ · (20/27)ⁿ',
    explanation: 'Cada cubo se divide en 27 y se conservan 20. En la construcción ideal, el volumen tiende a cero.',
    discovery: 'Karl Menger la describió en 1926 al estudiar la dimensión topológica. Es el análogo tridimensional de la alfombra de Sierpiński.',
    source: 'https://mathworld.wolfram.com/MengerSponge.html'
  },
  koch: {
    formula: 'Lₙ = L₀ · (4/3)ⁿ',
    explanation: 'Cada segmento se cambia por cuatro de un tercio de su longitud. La curva ideal es continua y su longitud crece sin límite.',
    discovery: 'Helge von Koch publicó la construcción en 1904 para mostrar una curva continua sin tangente, creada con geometría elemental.',
    source: 'https://books.google.de/books?id=kf3NnQAACAAJ'
  },
  blood: {
    formula: 'p′ = p + 4·r(p),   r = fBM',
    explanation: 'Esta escena deforma coordenadas mediante ruido fractal para crear ramificaciones. No implementa literalmente un sistema L.',
    discovery: 'Aristid Lindenmayer introdujo los sistemas L en 1968 para describir el desarrollo de estructuras celulares y ramificadas.',
    source: 'https://algorithmicbotany.org/papers/lsfp.pdf'
  },
  atoms: {
    formula: 'rᵢ(t) = c + Rᵢ(cos ωᵢt, sin ωᵢt)',
    explanation: 'Las órbitas de esta escena son una animación estilizada: no constituyen un fractal ni un modelo cuántico del átomo.',
    discovery: 'Rutherford propuso el átomo nuclear en 1911. Bohr presentó en 1913 un modelo con estados de energía definidos.',
    source: 'https://nbi.ku.dk/english/www/niels/bohr/bohratomet/'
  }
};
