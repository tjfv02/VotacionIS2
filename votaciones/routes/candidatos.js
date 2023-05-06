const express = require('express');
const router = express.Router();

// Array donde se almacenarán los candidatos registrados
const candidatos = [];

// Variable que indica si la fase de creación de candidatos está abierta o cerrada
let faseCreacionAbierta = true;

// Endpoint para crear un candidato
router.post('/registrarCandidato', (req, res) => {
  // Verificar si la fase de creación de candidatos está abierta
  if (!faseCreacionAbierta) {
    return res.status(400).json({ error: 'La fase de creación de candidatos está cerrada' });
  }

  const { DPI, Nombre, Apellido, Edad, Partido, Puesto } = req.body;
  if (!DPI || !Nombre || !Apellido || !Edad || !Partido || !Puesto) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  // Crear un nuevo objeto de candidato y agregarlo al array de candidatos
  const nuevoCandidato = { DPI, Nombre, Apellido, Edad, Partido, Puesto };
  candidatos.push(nuevoCandidato);

  // Responder con el nuevo candidato registrado
  res.status(201).json(nuevoCandidato);
});

router.post('/cerrar-fase-creacion/:abierta', (req, res) => {
    const abierta = req.params.abierta === 'true';
  
    if (abierta === faseCreacionAbierta) {
      const estadoFase = faseCreacionAbierta ? 'abierta' : 'cerrada';
      return res.status(400).json({ error: `La fase de creación de candidatos ya está ${estadoFase}` });
    }
  
    faseCreacionAbierta = abierta;
  
    const nuevoEstado = abierta ? 'abierta' : 'cerrada';
    res.status(200).json({ message: `La fase de creación de candidatos ha sido ${nuevoEstado} exitosamente` });
  });

module.exports = router;
