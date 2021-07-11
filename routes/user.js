const {Router} = require('express');
const { check } = require('express-validator');
const {usuariosGet,usuariosPut,usuariosPost,usuariosDelete} = require('../controllers/user');
const { esRoleValido,emailExiste ,idUsuarioExiste} = require('../helpers/db-validators');
const {validarCampos} = require('../middlewares/validar-campos');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(idUsuarioExiste),
    check('rol').custom( esRoleValido),
    validarCampos

] ,usuariosPut);

router.post('/', [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio y mayor de 6 caracteres').isLength({min: 6}),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol','No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido),
    validarCampos
],usuariosPost);

router.delete('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(idUsuarioExiste),
    validarCampos

] ,usuariosDelete);


module.exports = router;