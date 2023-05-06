// Importar módulos necesarios
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

let faseVotacionAbierta = true;

// Array de candidatos (simulación de base de datos)
let candidatos = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    partido: 'Partido 1',
    puesto: 'Puesto 1',
    votos: 0
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    partido: 'Partido 2',
    puesto: 'Puesto 2',
    votos: 0
  },
  {
    id: 3,
    nombre: 'Pedro',
    apellido: 'Ramírez',
    partido: 'Partido 3',
    puesto: 'Puesto 3',
    votos: 0
  }
];

// Array de votos (simulación de base de datos)
let votos = [];
let votosFraudulentos = 0;
let votosNulos = 0;

router.post('/votar', [
  body('idUsuario').notEmpty(),
  body('idCandidato')
], (req, res) => {

    if (!faseVotacionAbierta) {
        return res.status(400).json({ error: 'La fase de votación está cerrada' });
    }


  const idUsuario = parseInt(req.body.idUsuario);
  const idCandidato = parseInt(req.body.idCandidato);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Verificar que el usuario no haya votado antes
  const votoAnterior = votos.find(voto => voto.idUsuario === idUsuario);
  if (votoAnterior) {
    votosFraudulentos++;
    return res.status(400).json({ msg: 'Ya ha votado anteriormente' });
  }
  
  // Obtener el candidato seleccionado
  const candidato = candidatos.find(candidato => candidato.id === idCandidato);
  if (!candidato) {
    votosNulos++;
    return res.status(400).json({ msg: 'El candidato seleccionado no existe, por lo cual es voto nulo' });
  }
  
  // Incrementar el número de votos del candidato
  candidato.votos++;
  
  votos.push({
    idUsuario: idUsuario,
    idCandidato: idCandidato,
    fecha: new Date()
  });
  
  res.status(200).json({ msg: 'Voto registrado exitosamente' });
});

// Endpoint de estadísticas de votos
router.get('/estadisticas', (req, res) => {
  const totalVotos = votos.length;
  const totalVotosFraudulentos = votosFraudulentos;
  const totalVotosNulos = votosNulos;

  // Obtener las estadísticas de votos por candidato
  const estadisticas = candidatos.map(candidato => {
    return {
      id: candidato.id,
      nombre: candidato.nombre + ' ' + candidato.apellido,
      votos: candidato.votos,
      porcentaje: ((candidato.votos / totalVotos) * 100).toFixed(2) + '%'
    };
  });
  
  // Enviar las estadísticas en la respuesta
  res.status(200).json({ votosCandidatos: estadisticas,totalVotos: totalVotos, totalVotosNulos: totalVotosNulos, totalVotosFraudulentos: totalVotosFraudulentos }); 
});

router.post('/cerrar-fase-votacion/:abierta', (req, res) => {
  const abierta = req.params.abierta === 'true';

  if (abierta === faseVotacionAbierta) {
    const estadoFase = faseVotacionAbierta ? 'abierta' : 'cerrada';
    return res.status(400).json({ error: `La fase de votación ya está ${estadoFase}` });
  }

  faseVotacionAbierta = abierta;

  const nuevoEstado = abierta ? 'abierta' : 'cerrada';
  res.status(200).json({ message: `La fase de votación ha sido ${nuevoEstado} exitosamente` });
});
//
module.exports = router;
