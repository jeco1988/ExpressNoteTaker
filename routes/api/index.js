const router = require('express').Router();
const notesRoutes = require('./notesroutes');

router.use(notesRoutes);

module.exports = router;