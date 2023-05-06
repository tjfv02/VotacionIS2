const express = require('express');
const router = express.Router();

const usuarios = [];

router.post('/', (req, res) => {
  const { DPI, nombre, apellido } = req.body;

  // Verificar si el usuario ya existe
  const usuarioExistente = usuarios.find(usuario => usuario.DPI === DPI);
  if (usuarioExistente) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }

  // Crear el usuario
  const nuevoUsuario = {
    DPI,
    nombre,
    apellido,
  };
  usuarios.push(nuevoUsuario);

  res.status(201).json(nuevoUsuario);
});

// Endpoint para obtener un usuario por su DPI
router.get('/:DPI', (req, res) => {
  const { DPI } = req.params;

  const usuario = usuarios.find(usuario => usuario.DPI === DPI);
  if (!usuario) {
    return res.status(404).json({ error: 'El usuario no existe' });
  }

  res.status(200).json(usuario);
});

module.exports = router;
