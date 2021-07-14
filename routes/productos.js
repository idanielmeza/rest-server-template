const {Router} = require('express');
const { check } = require('express-validator');
const { validarJWT , validarCampos, esAdmin} = require('../middlewares');
const { idCategoriaExiste, idProductoExiste } = require('../helpers/db-validators');
const { crearProducto , obtenerProductos, obtenerProductosID, actualizarProducto, borrarProducto} = require('../controllers/productos');

/** Ruta : api/productos */

const router = Router();

router.get('/',obtenerProductos);

router.get('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom(idProductoExiste)
],obtenerProductosID)

router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatorio').not().isEmpty(),
    check('categoria','No es una categoria valida').isMongoId(),
    check('categoria').custom(idCategoriaExiste)
    ,validarCampos
] ,crearProducto)

router.put('/:id',[
    validarJWT,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(idProductoExiste)
    ,validarCampos
], actualizarProducto)


router.delete('/:id',[
    validarJWT,
    esAdmin,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(idProductoExiste),
    validarCampos
], borrarProducto)

module.exports = router;
