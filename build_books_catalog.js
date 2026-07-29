import fs from 'fs';
import path from 'path';
import pg from 'pg';
const { Client } = pg;
const connectionString = process.env.DATABASE_URL || "postgres://postgres:mYQoWBeCvX69JpRRf6RlOaOHihERjeQsUVxdqnLZflDZOL0G3UAr7s2LfNmT9Uje@91.107.212.235:25432/postgres";


const REPO_ROOT = path.resolve(process.cwd());
const WEBMEDIA_TERMINADOS = path.resolve('/Users/emmanuelayala/Desktop/CamiToons/REPOS/webmedia/images/catalog/TERMINADOS');
const LOCAL_TERMINADOS = path.join(REPO_ROOT, 'src/assets/images/catalog/TERMINADOS');
const TERMINADOS_CATALOG = fs.existsSync(WEBMEDIA_TERMINADOS) ? WEBMEDIA_TERMINADOS : LOCAL_TERMINADOS;
const FUNDAMENTACIONES_DIR = path.join(REPO_ROOT, 'src/assets/fundamentaciones');
const PUBLIC_COLOREAR_DIR = path.join(REPO_ROOT, 'public/colorear');
const OUTPUT_FILE = path.join(REPO_ROOT, 'src/data/booksCatalog.ts');

function cleanRtf(rtfContent) {
  let text = rtfContent;
  const headerEndIdx = text.lastIndexOf('\\deftab');
  if (headerEndIdx !== -1) {
    text = text.substring(headerEndIdx);
  }
  
  text = text
    .replace(/\\\'93/g, '“')
    .replace(/\\\'94/g, '”')
    .replace(/\\\'97/g, '—')
    .replace(/\\\'96/g, '–')
    .replace(/\\\'92/g, '’')
    .replace(/\\\'a1/g, '¡')
    .replace(/\\\'bf/g, '¿')
    .replace(/\\\'e1/g, 'á')
    .replace(/\\\'e9/g, 'é')
    .replace(/\\\'ed/g, 'í')
    .replace(/\\\'f3/g, 'ó')
    .replace(/\\\'fa/g, 'ú')
    .replace(/\\\'f1/g, 'ñ')
    .replace(/\\\'c1/g, 'Á')
    .replace(/\\\'c9/g, 'É')
    .replace(/\\\'cd/g, 'Í')
    .replace(/\\\'d3/g, 'Ó')
    .replace(/\\\'da/g, 'Ú')
    .replace(/\\\'d1/g, 'Ñ');

  text = text.replace(/\\\n/g, '\n').replace(/\\par/g, '\n');
  text = text.replace(/\\[a-z0-9]+\-?\d*\s?/gi, '');
  text = text.replace(/[{}]/g, '');
  text = text.replace(/d\s*deftab\d*/gi, '');
  text = text.replace(/tightenfactor\d*/gi, '');
  text = text.replace(/partightenfactor\d*/gi, '');

  const lines = text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith(';') && !l.startsWith('\\'));

  return lines.join('\n');
}

function removeActividadesYRincones(text) {
  if (!text) return text;
  let cleaned = text.replace(/7\.\s*Actividades prácticas[\s\S]*?(?=\n\d+\.|\nPropuesta|\nEsta propuesta|\nRecursos|$)/gi, '');
  cleaned = cleaned.replace(/\n8\.\s*Consejos/gi, '\n7. Consejos');
  cleaned = cleaned.replace(/\n9\.\s*Recursos/gi, '\n8. Recursos');
  cleaned = cleaned.replace(/\n\s*El rincón de[^\n]*/gi, '');
  cleaned = cleaned.replace(/\n\s*Crear un rincón[^\n]*/gi, '');
  cleaned = cleaned.replace(
    /desde una mirada pedagógica, emocional y acorde a la etapa evolutiva de los niños de 4 años\./g,
    'desde una mirada pedagógica y emocional.'
  );
  cleaned = cleaned.replace(
    'Educación vial inicial: cuidado, normas y respeto.',
    'Iniciación en la educación vial inicial: cuidado, normas y respeto.'
  );
  cleaned = cleaned.replace(
    /También se puede proponer una actividad artística:[\s\S]*?Finalizar con un mensaje sencillo y significativo:\n?/g,
    ''
  );
  cleaned = cleaned.replace(
    /"Viajar también es aprender[\s\S]*?principal medio para aprender durante la primera infancia\./g,
    `Esta propuesta favorece\nEl desarrollo de la imaginación, el juego simbólico y la creatividad, capacidades fundamentales durante los 4 años de edad. Además, fortalece el lenguaje oral, la expresión de emociones, la capacidad de representar situaciones de la vida cotidiana y el pensamiento creativo.\n\nDesde una mirada pedagógica y emocional, el cuento ofrece un primer acercamiento a la educación vial, promoviendo hábitos de cuidado, respeto por las normas y convivencia con los demás de una manera lúdica y significativa. Al mismo tiempo, estimula la curiosidad por conocer el entorno, la identificación de distintos medios de transporte y la comprensión de que viajar implica compartir espacios, respetar turnos y cuidar tanto de uno mismo como de los demás.\n\n"Viajar también es aprender. Cada camino nos invita a descubrir lugares, personas y experiencias nuevas. Cuando viajamos con imaginación, curiosidad y respeto, el mundo se llena de aventuras. Y cuando cuidamos de nosotros mismos y de quienes nos acompañan, cada viaje se vuelve más seguro, divertido y especial."`
  );
  cleaned = cleaned.replace(
    'Leé el cuento con ritmo y entusiasmo',
    'Lee el cuento con ritmo y entusiasmo'
  );
  cleaned = cleaned.replace(
    'Realizá pausas para observar las ilustraciones',
    'Realice pausas para observar las ilustraciones'
  );
  cleaned = cleaned.replace(
    'qué parte del sueño fue su favorita',
    'qué parte del sueño era su favorita'
  );
  cleaned = cleaned.replace(/\\\'97/g, '—').replace(/\\\'96/g, '–');
  cleaned = cleaned.replace(
    /Luna visita la granja de su abuela para pasar un hermoso día juntas\.[\s\S]*?compartimos tiempo con quienes nos quieren\./g,
    'Luna visita el campo de su abuela para pasar un hermoso día juntas. Mientras recorre el campo, observa cómo corre el caballo, cómo la vaca viene pasto tranquilamente, cómo las gallinas dan vueltas y cacarean, los conejos se agrupan, cómo los patitos nadan en el agua y cómo una familia de chanchitos juega feliz en el barro. Con paciencia y mucho cariño, la abuela le explica a Luna cómo vive cada animal y la importancia de cuidarlos y respetarlos. Después de un día lleno de descubrimientos, ambas comparten una rica merienda mientras observan el atardecer y disfrutan de un cálido abrazo.'
  );
  cleaned = cleaned.replace(
    'Vínculo afectivo con figuras significativas, como los abuelos.',
    'Vínculo afectivo con figuras significativas.'
  );
  cleaned = cleaned.replace(
    'Leé el cuento con un tono tranquilo y afectuoso',
    'Lee el cuento con un tono tranquilo y afectuoso'
  );
  cleaned = cleaned.replace(
    'Invitá a los niños a imitar los sonidos',
    'Invita a los niños a imitar los sonidos'
  );
  cleaned = cleaned.replace(
    /También puede proponerse una actividad de dibujo:[\s\S]*?para un desarrollo integral y saludable\./g,
    `Esta propuesta favorece\nEl desarrollo del vínculo afectivo con las figuras significativas, fortaleciendo la seguridad emocional, el sentido de pertenencia y la construcción de relaciones basadas en el cariño y el respeto.\nAsimismo, favorece la curiosidad, la observación y el conocimiento del entorno natural, promoviendo el cuidado de los animales y el respeto por todos los seres vivos desde los primeros años de vida.\nDesde una mirada pedagógica y emocional, el cuento estimula el lenguaje, la empatía, la capacidad de expresar emociones y la valoración de las experiencias compartidas como oportunidades de aprendizaje. También fortalece el desarrollo de actitudes de cuidado, responsabilidad y sensibilidad hacia la naturaleza, reconociendo que los vínculos afectivos y el contacto con el entorno son pilares fundamentales para un desarrollo integral y saludable.\n\n"Cada momento compartido con las personas que nos quieren ayudar a crecer. Cuando observamos la naturaleza con curiosidad y tratamos a los animales con respeto, aprendemos a cuidar el mundo que nos rodea. El amor, la paciencia y los pequeños gestos hacen que cada día se convierta en un recuerdo especial."`
  );
  cleaned = cleaned.replace(
    /También puede proponerse una actividad artística:[\s\S]*?necesita tiempo, acompañamiento y mucho amor\./g,
    `Esta propuesta favorece\nEl desarrollo de hábitos alimentarios saludables desde una experiencia positiva, respetando los tiempos, gustos y necesidades propias de cada niño.\nAsimismo, fortalece la exploración sensorial, el desarrollo del gusto, la autonomía y la confianza para conocer nuevos alimentos sin presiones ni exigencias, favoreciendo una relación saludable con la comida.\nDesde una mirada pedagógica y emocional, el cuento promueve la participación activa de los niños en los momentos de alimentación, fortaleciendo el vínculo con la familia y comprendiendo que comer también es una oportunidad para conversar, compartir y disfrutar juntos. Además, favorece el desarrollo del lenguaje, la curiosidad, la observación y la educación emocional, ayudando a construir hábitos que acompañarán su crecimiento y entendiendo que aprender a alimentarse también es un proceso que necesita tiempo, acompañamiento y mucho amor.\n\n"Cada alimento tiene un sabor diferente y cada persona también tiene sus propios gustos. Con tiempo, paciencia y mucho cariño podemos descubrir nuevas comidas y aprender a disfrutar de una alimentación variada. Compartir la mesa con quienes queremos hace que cada comida sea un momento de encuentro, alegría y amor que también alimenta nuestro corazón."`
  );
  cleaned = cleaned.replace(
    /También puede proponerse una actividad artística:[\s\S]*?etapa evolutiva de los niños de 3 años\./g,
    `Esta propuesta favorece\nEl desarrollo del lenguaje oral, la comunicación y la expresión de emociones, favoreciendo que los niños descubran nuevas formas de expresar sus deseos, necesidades y sentimientos.\nAsimismo, fortalece la autonomía, la autoestima y la confianza en sí mismos, acompañando de manera respetuosa el proceso gradual de dejar el chupete sin generar presiones ni sentimientos de fracaso.\nDesde una mirada pedagógica y emocional, el cuento promueve una comunicación afectiva entre adultos y niños, favoreciendo la escucha, el diálogo y el acompañamiento respetuoso durante los cambios propios del crecimiento. También ayuda a comprender que cada niño tiene su propio ritmo de desarrollo y que, con tiempo, paciencia y amor, puede adquirir nuevas habilidades que fortalecerán su seguridad, su independencia y su capacidad para vincularse con los demás.\n\n"Cada niño tiene su propio tiempo para crecer. Poco a poco aprendemos a hacer cosas nuevas y descubrimos que nuestra voz puede contar historias, pedir ayuda, expresar emociones y decir cuánto queremos a las personas que nos acompañan. Hablar nos ayuda a conectar con los demás ya mostrar quiénes somos. Crecer lleva tiempo, y cada pequeño paso merece ser celebrado con amor y paciencia."`
  );
  cleaned = cleaned.replace(
    'Este cuento acompaña a Luna, una niña de 3 años, en el descubrimiento de su propio cuerpo.',
    'Este cuento acompaña a Luna, en el descubrimiento de su propio cuerpo.'
  );
  cleaned = cleaned.replace(
    /Finalizar con un mensaje sencillo y significativo:\s*\n+"Mi cuerpo es único[\s\S]*?con quienes los rodean\./g,
    `Esta propuesta fortalece el desarrollo de la conciencia corporal, la autoestima, la educación emocional y el aprendizaje, promoviendo una relación positiva con su propio cuerpo y con quienes los rodean.\n\n"Mi cuerpo es único. Me ayuda a aprender, jugar, abrazar, sentir y crecer. Lo cuido con amor y también respeto el cuerpo de los demás, porque cada persona es única y valiosa."`
  );
  cleaned = cleaned.replace(
    'y la construcción de vínculos afectivos, respetando las necesidades propias de los niños de 3 años.',
    'y la construcción de vínculos afectivos.'
  );
  cleaned = cleaned.replace(
    /También puede proponerse un pequeño juego de conciencia corporal:[\s\S]*?propias de la primera infancia\./g,
    `Esta propuesta favorece\nel desarrollo de la motricidad gruesa, la conciencia corporal y la autonomía. Además, fortalece la capacidad de reconocer las propias sensaciones físicas y emocionales, promoviendo la autorregulación, el disfrute del movimiento y la importancia del descanso como parte del bienestar integral.\nDesde una mirada pedagógica y emocional, el cuento invita a comprender que jugar, explorar, compartir y luego recuperar energías son experiencias esenciales para un desarrollo saludable, respetando los tiempos, intereses y necesidades propias.\n\n"Nuestro cuerpo fue hecho para moverse, jugar, descubrir y aprender. Cuando jugamos crecemos, cuando descansamos recuperamos fuerzas y cuando compartimos con quienes queremos, nuestro corazón también se siente feliz. Escuchar lo que nuestro cuerpo necesita es una forma de cuidarnos y de crecer sanos y felices."`
  );
  cleaned = cleaned.replace(/\n8\.\s*Recursos adicionales[\s\S]*?(?=\nPropuesta emocional|\nEsta propuesta|\n\d+\.|$)/gi, '');
  cleaned = cleaned.replace(/\n\n(Esta propuesta ayuda a reconocer)/g, '\n$1');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
  return cleaned;
}

const STORY_MAPPINGS = {
  '2 Luna suena que viaja -': { rtf: 'Luna sueña que viaja .rtf', pdf: 'Luna y los transportes.pdf' },
  '2 Luna y la campo  -': { rtf: 'luna y el campo.rtf', pdf: 'Luna y el campo.pdf' },
  '2 Luna y su chupete -': { rtf: ' Luna y su chupete .rtf', pdf: '-Luna y el chupete .pdf' },
  '2 luna es asi': { rtf: 'Luna es asi.rtf', pdf: '-Luna  es asi.pdf' },
  '2 luna se mueve-': { rtf: 'luna se mueve.rtf', pdf: 'listo -Luna se mueve .pdf' },
  '2 luna y los sabores-': { rtf: 'luna y los sabores .rtf', pdf: 'LUNA Y LOS SABORES.pdf' },
  '2 luna y su juguete': { rtf: 'Luna y su juguete.rtf', pdf: '_Luna  y su juguete .pdf' },
  '3 Luna encuentra colores-': { rtf: 'Luna encuentra colores..rtf', pdf: 'Luna  encuentra colores .pdf' },
  '3 Luna y el arcoiris -': { rtf: 'luna y el arcoiris. .rtf', pdf: 'Luna y el arcoiris.pdf' },
  '3 Luna y el gran cambio-': { rtf: 'Luna y el gran cambio.rtf', pdf: 'Luna y el gran cambio.pdf' },
  '3 Luna y las estaciones -': { rtf: 'luna y las estaciones .rtf', pdf: 'Luna y las estaciones.pdf' },
  '3 Luna y las familias-': { rtf: 'Luna y la familia .rtf', pdf: '_Luna y las familias.pdf' },
  '3 Luna y su primer dia-': { rtf: 'luna y el primer dia .rtf', pdf: 'Luna y el primer dia  .pdf' },
  '3 luna se lava los dientes': { rtf: 'Luna se lava los dientes.rtf', pdf: '-Luna se lava los dientes.pdf' },
  '3 luna y sus emociones-': { rtf: ' Luna y sus emociones.rtf', pdf: 'Luna y sus emociones.pdf' },
  '4 Luna juego favorito-': { rtf: 'Luna y su juego favorito..rtf', pdf: 'listo- Luna y su juego favorito .pdf' },
  '4 Luna y la selva-': { rtf: 'Luna y la selva.rtf', pdf: 'Luna y la selva .pdf' },
  '4 Luna y los oficios-': { rtf: 'Luna y los oficios .rtf', pdf: 'Luna y los oficios.pdf' },
  '4 luna y los sonidos-': { rtf: 'Luna y los sonidos .rtf', pdf: 'Luna y los sonidos .pdf' },
  '4luna planta un arbol-': { rtf: 'Luna planta un arbol.rtf', pdf: 'Luna planta un arbol.pdf' },
  'falta 4 Luna y las formas -': { rtf: 'Luna y las formas.rtf', pdf: 'Luna y las formas (1).pdf' },
  'luna exploradora': { rtf: 'Luna explora .rtf', pdf: null }
};

const CUSTOM_COVERS = {
  '2 Luna suena que viaja -': '2.webp',
  '2 Luna y la campo  -': '10.webp',
  '2 Luna y su chupete -': 'otra .webp',
  '2 luna es asi': '-Luna  es asi.webp',
  '2 luna se mueve-': '6.webp',
  '2 luna y los sabores-': 'sd.jpeg',
  '2 luna y su juguete': '12.webp',
  '3 Luna encuentra colores-': '6.webp',
  '3 Luna y el arcoiris -': 'u6114657252_rellename_lo_que_falta_v7_--ar_21_--v_7_93538528-6dad-4a10-9406-d37ded71d684_2.webp',
  '3 Luna y el gran cambio-': 'Gemini_Generated_Image_cfauxdcfauxdcfau.webp',
  '3 Luna y las estaciones -': 'Gemini_Generated_Image_6iw8q16iw8q16iw8.webp',
  '3 Luna y las familias-': 'Gemini_Generated_Image_xuig7oxuig7oxuig.webp',
  '3 Luna y su primer dia-': 'u6114657252_LLENAME_LO_QUE_FALTA_--ar_21_--v_7_f1aa1168-78c3-46a8-9d8d-ab9630c08519_3.webp',
  '3 luna se lava los dientes': '10.webp',
  '3 luna y sus emociones-': '2a.webp',
  '4 Luna juego favorito-': '15.webp',
  '4 Luna y la selva-': 'ChatGPT Image 17 oct 2025, 21_50_46.webp',
  '4 Luna y los oficios-': '26.webp',
  '4luna planta un arbol-': 'ChatGPT Image 2 dic 2025, 11_36_23 p.m..webp',
  'falta 4 Luna y las formas -': 'Gemini_Generated_Image_c2nfntc2nfntc2nf.jpeg',
  'luna exploradora': 'Gemini_Generated_Image_7j6kch7j6kch7j6k.webp'
};

const CUSTOM_TITLES = {
  '2 luna se mueve-': { title: 'LUNA SE MUEVE', displayTitle: 'Luna se mueve' },
  '3 Luna y su primer dia-': { title: 'LUNA Y EL PRIMER DÍA', displayTitle: 'Luna y el primer día' }
};

const CUSTOM_INTROS = {
  '2 Luna suena que viaja -': 'Este cuento narra cómo Luna, se sumerge en el maravilloso mundo del juego simbólico. A través de experiencias divertidas, sueña que viaja y dramatiza diferentes medios de transporte: monopatín, bicicleta, moto, auto, tren y avión. Cada uno aparece acompañado de sonidos, movimientos y situaciones imaginarias que despiertan su curiosidad y creatividad. La historia promueve el reconocimiento de los distintos medios de transporte y ofrece un primer acercamiento a la educación vial, respetando la forma natural en que aprenden los niños: mediante el juego, la imaginación y las experiencias significativas. A su vez, favorece la expresión de emociones, el desarrollo del lenguaje y la construcción de aprendizajes a partir de situaciones cotidianas.',
  '2 Luna y la campo  -': 'Este cuento acompaña a Luna en una visita muy especial: un día en el campo de su abuela. Juntas recorren el campo, observan a los animales, descubren cómo viven y disfrutan de cada momento compartido. A través de esta experiencia, Luna aprende que cada animal tiene sus propias características, necesidades y formas de vivir. También descubre que la naturaleza merece ser cuidada y respetada, y que compartir tiempo con las personas que amamos nos ayuda a crecer sintiéndonos seguros y queridos. La historia invita a valorar los vínculos familiares, el contacto con la naturaleza y el respeto por todos los seres vivos, desde una mirada pedagógica, emocional y acorde al desarrollo evolutivo de cada niño\\a.',
  '4 Luna juego favorito-': 'El juego es la actividad más importante de la infancia. A través de él, los niños descubren el mundo, expresan sus emociones, desarrollan su creatividad y construyen su identidad. Durante los primeros años de vida, los niños eligen naturalmente aquello que les despierta interés y curiosidad. Algunas veces prefieren construir, otras cocinar, cuidar muñecos, jugar con animales, herramientas, bloques o autos. Todas estas elecciones son valiosas y forman parte de su desarrollo. En este cuento, Luna descubre que lo más importante no es qué juguete elige, sino la libertad para jugar con aquello que realmente disfruta. Su mamá acompaña sus intereses sin imponer reglas sobre "qué deben jugar las niñas o los niños", participando desde el respeto y enriqueciendo la experiencia compartida. La historia invita a reflexionar sobre el derecho de todos los niños a jugar libremente, favoreciendo el desarrollo de la identidad, la autoestima y la creatividad desde una mirada pedagógica, emocional y respetuosa de la etapa evolutiva.',
  'falta 4 Luna y las formas -': 'Durante la primera infancia, los niños comienzan a descubrir que el mundo que los rodea está lleno de formas. A través del juego, la observación y la exploración, empiezan a reconocer que muchos objetos cotidianos tienen formas geométricas que pueden identificar y nombrar. En este cuento, Luna disfruta de un paseo por la playa y, mientras juega y observa todo a su alrededor, descubre círculos, cuadrados, triángulos, rectángulos y rombos escondidos en distintos objetos. Poco a poco comprende que las formas están presentes en todas partes y que aprender a reconocerlas también puede ser un juego. La historia propone un primer acercamiento al pensamiento lógico-matemático desde experiencias concretas, significativas y emocionales, respetando el desarrollo evolutivo y promoviendo la curiosidad como motor del aprendizaje.'
};

const CUSTOM_AGES = {
  '2 Luna suena que viaja -': '2 años',
  '2 Luna y su chupete -': '2 años',
  'falta 4 Luna y las formas -': '2 años',
  '4 Luna juego favorito-': '2 años',
  '2 Luna y la campo  -': '2 años',
  '2 luna es asi': '3 años',
  '2 luna y su juguete': '3 años',
  '4 Luna y la selva-': '3 años',
  '3 Luna y el arcoiris -': '3 años',
  '3 luna y sus emociones-': '3 años',
  '3 Luna y las estaciones -': '3 años',
  '3 Luna y su primer dia-': '3 años',
  '4 Luna y los oficios-': '3 años',
  '2 luna y los sabores-': '3 años',
  '3 Luna encuentra colores-': '3 años',
  '2 luna se mueve-': '4 años',
  '4 luna y los sonidos-': '4 años',
  '3 Luna y el gran cambio-': '4 años',
  '3 luna se lava los dientes': '4 años',
  '3 Luna y las familias-': '4 años',
  '4luna planta un arbol-': '4 años',
  'luna exploradora': '4 años'
};

function getAllImageFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      getAllImageFiles(fullPath, fileList);
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (['.webp', '.png', '.jpeg', '.jpg'].includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

function getColorearSvgs(folderName) {
  if (!fs.existsSync(PUBLIC_COLOREAR_DIR)) return [];
  const folders = fs.readdirSync(PUBLIC_COLOREAR_DIR).filter(f => fs.statSync(path.join(PUBLIC_COLOREAR_DIR, f)).isDirectory());
  
  const cleanName = folderName.replace(/^\d+\s*/, '').replace(/-/g, '').trim().toLowerCase();
  
  const matchedFolder = folders.find(f => {
    const fClean = f.toLowerCase();
    return fClean.includes(cleanName) || cleanName.includes(fClean.replace('colorear', '').trim());
  });

  if (!matchedFolder) return [];

  const targetDir = path.join(PUBLIC_COLOREAR_DIR, matchedFolder);
  const files = fs.readdirSync(targetDir);
  return files
    .filter(file => file.endsWith('.svg'))
    .map(file => `/colorear/${encodeURIComponent(matchedFolder)}/${encodeURIComponent(file)}`);
}

function parseSections(cleanText) {
  const lines = cleanText.split('\n');
  let title = '';
  let age = '3 años';
  let intro = '';
  let objective = '';
  let summary = '';

  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.toLowerCase().includes('cuento:')) {
      title = line.replace(/cuento:/i, '').replace(/[“”"']/g, '').trim();
    } else if (line.toLowerCase().includes('edad recomendada:')) {
      age = line.replace(/edad recomendada:/i, '').trim();
    } else if (line.toLowerCase().includes('1. introducción') || line.toLowerCase().includes('introducción')) {
      currentSection = 'intro';
    } else if (line.toLowerCase().includes('2. objetivo') || line.toLowerCase().includes('objetivo del cuento')) {
      currentSection = 'objective';
    } else if (line.toLowerCase().includes('3. resumen') || line.toLowerCase().includes('resumen del cuento')) {
      currentSection = 'summary';
    } else if (line.match(/^\d+\./)) {
      currentSection = 'other';
    } else {
      if (currentSection === 'intro') intro += (intro ? ' ' : '') + line;
      else if (currentSection === 'objective') objective += (objective ? ' ' : '') + line;
      else if (currentSection === 'summary') summary += (summary ? ' ' : '') + line;
    }
  }

  return { title, age, intro, objective, summary };
}

async function main() {
  console.log("🚀 Connecting to database to retrieve assets for catalog build...");
  const client = new Client({ connectionString, ssl: false });
  await client.connect();

  let dbAssets = [];
  try {
    const res = await client.query("SELECT asset_path, asset_type FROM camitoons_media_assets");
    dbAssets = res.rows;
    console.log(`Fetched ${dbAssets.length} assets from DB for catalog generation.`);
  } catch (err) {
    console.error("Error reading database assets, falling back to empty:", err.message);
  } finally {
    await client.end();
  }

  // Separate assets by type
  const dbPdfs = dbAssets.filter(a => a.asset_type === 'pdf' || a.asset_path.endsWith('.pdf'));
  const dbSvgs = dbAssets.filter(a => a.asset_type === 'svg' || a.asset_path.endsWith('.svg'));
  const dbCovers = dbAssets.filter(a => a.asset_path.startsWith('cuentos/Portadas Cuentos Web'));

  const folders = Object.keys(STORY_MAPPINGS);

  const booksData = [];

  // Define helper normalization functions
  function normalizeStr(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/^(colorear|portada|cuento|listo|falta)\b/gi, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function getMatch(list, searchStr, key = 'asset_path') {
    const normSearch = normalizeStr(searchStr);
    if (!normSearch) return null;
    return list.find(item => {
      const filename = path.basename(item[key]);
      return normalizeStr(filename).includes(normSearch) || normSearch.includes(normalizeStr(filename));
    });
  }

  function readRtfFile(filename) {
    const normFilename = normalizeStr(filename);
    const files = fs.readdirSync(FUNDAMENTACIONES_DIR);
    const matched = files.find(f => normalizeStr(f) === normFilename);
    if (matched) {
      return fs.readFileSync(path.join(FUNDAMENTACIONES_DIR, matched), 'utf8');
    }
    // Try accentless matching just in case
    const matchNoAccents = files.find(f => {
      return normalizeStr(f).replace(/[áéíóúñ]/g, c => ({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n'}[c])) === 
             normFilename.replace(/[áéíóúñ]/g, c => ({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n'}[c]));
    });
    if (matchNoAccents) {
      return fs.readFileSync(path.join(FUNDAMENTACIONES_DIR, matchNoAccents), 'utf8');
    }
    throw new Error(`RTF file not found: ${filename}`);
  }

  folders.forEach((folderName, index) => {
    // Find cover: try to match from DB covers
    const cleanFolder = folderName.replace(/^\d+\s*/, '').replace(/-/g, '').trim();
    
    // Explicit manual mappings for covers with mismatched filenames
    const coverOverrides = {
      '2 Luna y la campo  -': 'Portada Luna y el campo.webp',
      '3 Luna encuentra colores-': 'Portada Luna encuentra juguetes.webp',
      '4 Luna juego favorito-': 'Portada luna y su juego favorito.webp'
    };

    let dbCoverMatch = null;
    if (coverOverrides[folderName]) {
      dbCoverMatch = dbCovers.find(c => path.basename(c.asset_path) === coverOverrides[folderName]);
    }
    
    if (!dbCoverMatch) {
      dbCoverMatch = getMatch(dbCovers, cleanFolder);
    }

    let coverUrl = '';
    if (dbCoverMatch) {
      coverUrl = `/${dbCoverMatch.asset_path}`;
    } else {
      // Direct guess fallback
      coverUrl = `/cuentos/Portadas Cuentos Web/Portada ${cleanFolder}.webp`;
    }

    const mapping = STORY_MAPPINGS[folderName] || {};
    let cleanText = '';
    let parsedInfo = { title: '', age: '3 años', intro: '', objective: '', summary: '' };

    if (mapping.rtf) {
      const rawRtf = readRtfFile(mapping.rtf);
      cleanText = cleanRtf(rawRtf);
      cleanText = removeActividadesYRincones(cleanText);
      parsedInfo = parseSections(cleanText);
    }

    const cleanTitle = (CUSTOM_TITLES[folderName]?.displayTitle || parsedInfo.title || folderName.replace(/^\d+\s*/, '').replace(/-/g, '').trim())
      .replace(/[\\/]+$/, '')
      .trim();
    const upperTitle = (CUSTOM_TITLES[folderName]?.title || cleanTitle.toUpperCase())
      .replace(/[\\/]+$/, '')
      .trim();
    const recommendedAge = CUSTOM_AGES[folderName] || parsedInfo.age || '3 años';

    // Find PDF Match from DB
    let pdfUrl = null;
    let pdfFileName = null;
    if (mapping.pdf) {
      const dbPdfMatch = getMatch(dbPdfs, mapping.pdf.replace(/\.pdf$/i, ''));
      if (dbPdfMatch) {
        pdfUrl = `/pdf/${encodeURIComponent(path.basename(dbPdfMatch.asset_path))}`;
        pdfFileName = path.basename(dbPdfMatch.asset_path);
      } else {
        pdfUrl = `/pdf/${encodeURIComponent(mapping.pdf)}`;
        pdfFileName = mapping.pdf;
      }
    }

    // Find Coloring SVGs Match from DB
    const coloringSvgs = [];
    const normFolder = normalizeStr(cleanFolder);
    const normPdf = mapping.pdf ? normalizeStr(mapping.pdf.replace(/\.pdf$/i, '')) : '';

    dbSvgs.forEach(svg => {
      const svgPath = svg.asset_path;
      // Get parent directory of the SVG (e.g. Colorear Luna y el campo)
      const parts = svgPath.split('/');
      const svgParent = parts.length > 1 ? parts[parts.length - 2] : '';
      const normSvgParent = normalizeStr(svgParent);

      // Check if parent directory matches book folder or pdf filename
      if ((normFolder && normSvgParent.includes(normFolder)) || 
          (normPdf && normSvgParent.includes(normPdf)) ||
          (normFolder && normFolder.includes(normSvgParent.replace('colorear', ''))) ||
          (normPdf && normPdf.includes(normSvgParent.replace('colorear', '')))) {
        coloringSvgs.push(`/${svgPath}`);
      }
    });

    // Sort coloring SVGs by filename index numerical value (e.g. 1.svg, 2.svg, 10.svg)
    coloringSvgs.sort((a, b) => {
      const getNum = (p) => {
        const m = path.basename(p).match(/^(\d+)/);
        return m ? parseInt(m[1], 10) : 0;
      };
      return getNum(a) - getNum(b);
    });

    const introText = CUSTOM_INTROS[folderName] || parsedInfo.intro || 'Cuento infantil de la colección Luna está creciendo.';

    let finalFundamentacion = cleanText;
    if (CUSTOM_INTROS[folderName] && cleanText) {
      finalFundamentacion = cleanText.replace(/(1\.\s*Introducción\s*\n)([\s\S]*?)(?=\n2\.\s*Objetivo|\n2\.|$)/i, `$1${CUSTOM_INTROS[folderName]}\n`);
    }

    finalFundamentacion = removeActividadesYRincones(finalFundamentacion);

    booksData.push({
      id: `book-${index + 1}`,
      folderName,
      title: upperTitle,
      displayTitle: cleanTitle,
      recommendedAge,
      coverRelPath: coverUrl,
      pdfUrl,
      pdfFileName,
      intro: introText,
      objective: removeActividadesYRincones(parsedInfo.objective) || 'Acompañar el desarrollo emocional e intelectual en la primera infancia.',
      summary: parsedInfo.summary || 'Luna vive una nueva aventura llena de descubrimientos, ternura y emociones.',
      fullFundamentacion: finalFundamentacion,
      coloringSvgs
    });
  });

  let tsCode = `// Generated Books Catalog Module with RTF Fundamentaciones & PDF URLs
export interface BookStory {
  id: string;
  folderName: string;
  title: string;
  displayTitle: string;
  recommendedAge: string;
  coverImage: string;
  pdfUrl: string | null;
  pdfFileName: string | null;
  intro: string;
  objective: string;
  summary: string;
  fullFundamentacion: string;
  coloringSvgs?: string[];
}

const allGlobImages = import.meta.glob<string>('../assets/images/catalog/TERMINADOS/**/*.{webp,png,jpeg,jpg}', {
  eager: true,
  import: 'default'
});

const rawBooks = ${JSON.stringify(booksData, null, 2)};

export const BOOKS_DATA: BookStory[] = rawBooks.map((book) => {
  const coverKey = book.coverRelPath.replace('./', '');
  let resolvedCover = book.coverRelPath;
  if (book.coverRelPath.startsWith('./')) {
    for (const [globPath, url] of Object.entries(allGlobImages)) {
      if (globPath.endsWith(coverKey) || coverKey.endsWith(globPath.replace('../assets/images/catalog/TERMINADOS/', ''))) {
        resolvedCover = url;
        break;
      }
    }
  }

  return {
    ...book,
    coverImage: resolvedCover
  };
});
`;

  fs.writeFileSync(OUTPUT_FILE, tsCode);
  console.log(`¡Actualizado con éxito ${booksData.length} cuentos agrupados con PDF, RTF y colorear en ${OUTPUT_FILE}!`);
}

main().catch(console.error);

