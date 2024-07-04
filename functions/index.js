const functions = require('firebase-functions');
const axios = require('axios');

const apiKey = 'AIzaSyCO6lrsxiYODxCPDFt1X64vfMWb4Fu_km0'; // Reemplaza esto con tu API Key
const model = 'gemini-1.5-pro';

async function generateContent(prompt) {
  try {
    const response = await axios.post('https://api.generativeai.google.com/v1/generate', {
      model: model,
      prompt: prompt,
      temperature: 0.7,
      top_p: 0.9,
      top_k: 50,
      max_output_tokens: 1024,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response.data.output;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

exports.flaskApp = functions.https.onRequest(async (req, res) => {
  // Habilitar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const inputText = req.body.input;
  const promptBase = `
  Dame el incidente del partido de fútbol, según el contexto de la entrada. Solamente da el incidente con la estructura. Es importante que el incidente tenga la misma estructura de los ejemplos, manteniendo las mismas palabras usadas y solo cambiando los valores cambiantes. Y que sea el incidente específico que pide la entrada comprendiendo el contexto de esta. Basta con poner Incidente y Descripción. Los siguientes elementos no son requeridos:

## Resumen de Incidentes Partido de Fútbol:

**Formato:**

**Incidente:** [Descripción breve del incidente]
**Descripción:** [Descripción detallada del incidente]

**Rellenar con información del partido:**

En el siguiente incidente debemos cambiar "Dr." por "C." **Incidente:** Médico habilitado
**Descripción:** El Club Tecos habilitó como médico de campo al Dr. Ricardo Murillo, quien se identificó con su cédula profesional No. 12345, brindando atención médica para ambos equipos.

Prefiero que al dar un incidente, tenga en paréntesis o con "xx" los datos cambiantes, por ejemplo:
Es importante que siempre pongas un símbolo o una señal a los datos cambiantes como minutos, nombres, etc.

Ejemplo: 
input: dimos rehidratación
output:  **Incidente:** Rehidratación
**Descripción:** Se llevó a efecto el proceso de rehidratación a los minutos XX y XX aproximadamente debido a los factores climatológicos.

input: Conducta del Público
output: La conducta del público fue buena durante el encuentro.
input: Cuando no llega la ambulancia
output: El partido entre los equipos xxx vs xxx no pudo dar inicio debido a que el club local no contaba con la ambulancia, a pesar de la tolerancia de 30 minutos otorgada después de la hora programada.
input: El club Atlas no cubrió el pago de honorarios del equipo arbitral y asesor
output: El club Atlas no cubrió el pago de honorarios del equipo arbitral y asesor, a pesar de enviar los recibos fiscales en tiempo y forma.
input: Cuando se retira la ambulancia por traslado de jugador lesionado
output: Debido a que la ambulancia trasladó a un jugador lesionado a un hospital al minuto xx, se habilitó un vehículo en caso de ser necesario.
input: Estado de las Instalaciones
output: El estado de las instalaciones fue reportado como bueno.
input: Estado del Terreno
output: El terreno de juego se encontraba en condiciones regulares.
input: Firma de la revisión
output: Entregué hoja de alineación y acreditaciones a las XXXXhoras, así mismo me hago responsable de las sustituciones durante el partido.
input: Golpe conducta violenta
output: Golpear con la mano abierta a un adversario a la altura del rostro con uso de fuerza excesiva.
input: Juego amateur antes de partido
output: Al arribar a las instalaciones, el terreno de juego estaba siendo ocupado por un partido de fútbol del sector amateur, finalizando el mismo aproximadamente 1:30 hrs antes del encuentro.
input: Jugadores identificándose con documentos
output: El Club PRO CAMP presentó en su hoja de alineación a jugadores identificándose con documentos oficiales como INE y pasaportes.
input: Lesión al final de encuentro
output: Al finalizar el encuentro, el jugador No. 22 Pérez Sebastián del Club Tapatíos Soccer F.C. resultó con una posible lesión en la pierna derecha producto de una acción de juego.
input: Lluvia (Tormenta eléctrica)
output: Transcurridos 25 minutos de espera, decidí suspender definitivamente el encuentro debido a las condiciones climatológicas (tormenta eléctrica) que ponían en riesgo la integridad física de equipos y árbitros.
input: Médico habilitado
output: El Club Nacional habilitó como médico de campo al C. Casillas Cisneros Raúl, identificado con su cédula profesional No. 2622612, brindando atención médica para ambos equipos.
input: No aparece el lugar en la designación
output: El partido se llevó a cabo en las instalaciones de Cancha Alterna Estadio 3 de Marzo perteneciente al municipio de Zapopan Jalisco.
input: Sin lonas de publicidad TDP
output: El Club Gallos Viejos no colocó lona de la Liga TDP detrás de ninguna portería.
input: Sin regaderas agua potable baño
output: El espacio habilitado por el Club Legado del Centenario como vestidor para el equipo arbitral no contaba con servicio de regaderas, sanitarios ni agua potable.
input: Sin servicio de cómputo e internet
output: El club Nacional F.C. no presentó equipo de cómputo ni internet para la elaboración del informe arbitral.
input: Suspensión del partido
output: Transcurridos 25 minutos de espera decidí suspender definitivamente el encuentro debido a que las condiciones climatológicas (Tormenta eléctrica) ponían en riesgo la integridad física de equipos y miembros del cuerpo arbitral.
input: Entrega de alineación y acreditaciones
output: Entregué hoja de alineación y acreditaciones a las XXXXhoras así mismo me hago responsable de las sustituciones durante el partido.
input: Lugar del partido
output: El partido se llevó a cabo en las instalaciones de Cancha Alterna Estadio 3 de Marzo perteneciente al municipio de Zapopan Jalisco.
input: Falta de ambulancia
output: El partido entre los equipos xxx vs xxx no pudo dar inicio debido a que el club local no contaba con la ambulancia a pesar de que se otorgó para su arribo la tolerancia de 30 minutos posteriores a la hora programada para el inicio del encuentro.
input: Retiro de ambulancia
output: Debido a que la ambulancia trasladó a un jugador lesionado a un hospital al minuto xx se habilitó un vehículo en caso de ser necesario.
input: Falta de equipo de cómputo e internet
output: El club Nacional F.C. no presentó equipo de cómputo ni internet para la elaboración del informe arbitral.
input: Falta de regaderas, agua potable y baños
output: El espacio habilitado por el Club Legado del Centenario como vestidor para el equipo arbitral no contaba con servicio de regaderas, sanitarios ni agua potable.
input: Falta de lonas de publicidad
output: El Club Gallos Viejos no colocó lona de la Liga TDP detrás de ninguna portería.
input: Médico para ambos equipos
output: El Club Tecos presentó en su hoja de alineación a C. Ceballos Luis quién fungió como médico de campo brindando atención a ambos clubes desde su banca.
input: Lesión al final del encuentro
output: Al finalizar el encuentro el jugador No. 22 Pérez Sebastián del Club Tapatíos Soccer F.C. resultó con una posible lesión en la pierna derecha producto de una acción de juego.
input: Contacto directo con el público
output: Del vestidor arbitral al terreno de juego existe contacto directo con el público aproximadamente 100 metros siendo escoltados por elementos de seguridad privada sin incidente alguno.
input: Penales
output: Al finalizar el encuentro y conforme al artículo 29 del reglamento de competencia de la Liga TDP se ejecutaron una serie de tiros desde el punto penal siendo el marcador Tecos (5) cinco vs cuatro (4) Tapatíos Soccer F.C.
input: Juego amateur antes del partido
output: Al arribar a las instalaciones el terreno de juego estaba siendo ocupado por un partido de fútbol del sector amateur finalizando el mismo aproximadamente 1:30 hrs antes del encuentro.
input: Médico habilitado
output: El Club Nacional habilitó como médico de campo al C. Casillas Cisneros Raúl, identificado con su cédula profesional No. 2622612, brindando atención médica para ambos equipos.
input: Rehidratación
output: Se llevó a efecto el proceso de rehidratación a los minutos 25 y 70 aproximadamente debido a los factores climatológicos.
input: Golpe con conducta violenta
output: Golpear con la mano abierta a un adversario a la altura del rostro con uso de fuerza excesiva.
input: Jugadores identificándose con documentos
output: El Club PRO CAMP presentó en su hoja de alineación a jugadores identificándose con documentos oficiales como INE y pasaportes.
input: Falta de servicio sanitario y regaderas
output: El vestidor arbitral no cuenta con servicio sanitario ni regaderas.
input: Falta de equipo de cómputo e internet
output: El Club Caja Oblatos CFD-Furia Roja no presentó equipo de cómputo ni internet para la elaboración del informe arbitral.
input: Identificación del cuerpo técnico
output: El Club Deportivo Tepatitlán de Morelos presentó en su hoja de alineación a miembros de su cuerpo técnico identificados con documentos oficiales.
input: Médico habilitado
output: El Club Caja Oblatos CFD-Furia Roja habilitó como médico de campo al C. De León Angel quién se identificó con cédula profesional No. 9946227.
input: Lesión durante el encuentro
output: Aproximadamente al minuto 2 el jugador No. 7 Ruiz David del Club Deportivo Cimagol, presentó una posible lesión en la pierna derecha, abandonando el terreno de juego para posteriormente ser sustituido al minuto 7.
input: Confusión del short
output: El club Deportivo Toluca utilizó el short color blanco debido a que el short color negro designado presentaba una similitud confusa con el short designado del club Necaxa Sub 17.
"input: Pago de honorarios",
  "output: El club Atlas no cubrió el pago de honorarios del equipo arbitral y asesor.",
  "input: Posible agresión del 4to oficial",
  "output: Aproximadamente al minuto 74 se da un saque de banda al Club Mazatlán FC y una botella cayó sobre la espalda del jugador No.22 Catalán Andres, quien interpretó que el cuarto oficial se la aventó, golpeándolo en respuesta.",
  "input: Minuto de silencio",
  "output: Se guardó un minuto de silencio previo al inicio del encuentro.",
  "input: Lanzamiento de objetos a cancha",
  "output: Al finalizar el encuentro cercano a la portería poniente, se lanzaron botellas de refresco desde la grada por parte de la porra del Club Deportivo Ayense hacia los jugadores del Club Catedráticos Elite F.C.",
  "input: Amonestaciones",
  "output: Conducta antideportiva, desaprobación con palabras o acciones, no respetar la distancia reglamentaria en un saque de esquina, entre otras.",
  "input: Expulsiones",
  "output: Impedir con mano intencionada un gol, juego brusco grave, conducta violenta, entre otras.",
  "input: Condiciones del terreno",
  "output: El terreno de juego se encontraba en condiciones regulares.",
  "input: Definición en penales",
  "output: Al finalizar el encuentro se ejecutaron una serie de tiros desde el punto penal conforme al reglamento.",
  "input: Falta de equipo de cómputo",
  "output: El Club Caja Oblatos CFD-Furia Roja no presentó equipo de cómputo ni internet para la elaboración del informe arbitral.",
  "input: Falta de tablas electrónicas",
  "output: El club Mineros de Fresnillo F.C. no proporcionó tablero electrónico para sustituciones y tiempo agregado.",
  "input: Uniformidad del equipo",
  "output: El club Deportivo Toluca utilizó un short de color blanco debido a una confusión con el short designado del club Necaxa Sub 17.",
  "input: Identificación con documentos oficiales",
  "output: El Club PRO CAMP presentó en su hoja de alineación a los jugadores: No. 13 Saldaña Carlos, No. 39 Nabor Santiago, identificándose con documento oficial (Escolar); No. 38 Rivera Sergio, No. 26 Llamas Carlos, identificándose con documento oficial (Pasaporte); No. 41 González Juan, identificándose con documento oficial (INE).",
  "input: Identificación con carnet",
  "output: El Club Deportivo Tepatitlán de Morelos presentó en su hoja de alineación a los miembros del cuerpo técnico de la siguiente manera: DT. Pérez Fernando identificándose con carnet de Liga de Expansión, TP. Ponce Carlos identificándose con documento oficial INE, apareciendo ambos activos en el sistema de captura de informe arbitral SIID.",
  "input: Suspensión de partido por invasión de cancha",
  "output: Al minuto [XX], el partido fue suspendido debido a una invasión de cancha por parte de los aficionados del Club [Nombre del Club]. Los invasores ingresaron al terreno de juego, comprometiendo la seguridad de los jugadores y del cuerpo arbitral. Tras varios intentos de controlar la situación, se decidió suspender definitivamente el encuentro. Al momento de la suspensión, el marcador se encontraba [Club A] [X] - [Club B] [Y]. No se reportaron heridos graves durante el incidente. En caso de ser necesario, se ampliará el informe.",
  "input: dimos rehidratación",
  "output: **Incidente:** Rehidratación **Descripción:** Se llevó a efecto el proceso de rehidratación a los minutos XX y XX aproximadamente debido a los factores climatológicos.
  `;

  const fullPrompt = `${promptBase}\ninput: ${inputText}`;
  try {
    const output = await generateContent(fullPrompt);
    res.status(200).send({ output });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
