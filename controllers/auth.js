const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const Usuario = require('../models/usuario');


const login= async(req,res)=>{

    const {correo,password} = req.body;
    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({msg: 'Usuario/Contraseña Incorrecto - Correo'})
        }

        //Verificar si esta activo
        if(!usuario.estado){
            return res.status(400).json({msg: 'Usuario/Contraseña - Inactivo'})
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({mgs: 'Usuario/Contraseña Incorrecto Contraseña'})
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }


}


const googleSingin = async( req,res)=>{

    const {id_token} = req.body;

    try {

        const {correo,img,nombre} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Crear usuario si no existe
            const data = {
                nombre,
                correo,
                img,
                password : ':P',
                google: true
            };

            usuario= new Usuario(data);
            await usuario.save();
        }
        
        //El usuario en db 
        if(!usuario.estado){
            return res.json(401).json({msg:'Habla con el adminsitrador usuario bloqueado'})
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:'Token en google no es valido'})
    }

    

}

module.exports={
    login,
    googleSingin
}