var router=require('express').Router();

router.use('/api/equipos', require('./equipo'));
router.use('/api/partidos', require('./partido'));
router.use('/api/eventos', require('./evento'));
router.use('/api/tipo_eventos', require('./tipo_evento'));
router.use('/api/jugadores', require('./jugador'));
router.use('/api/estadios', require('./estadio'));

module.exports=router;