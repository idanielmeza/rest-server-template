const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuariosGet = async(req,res)=>{

    const {limite=5, desde=0} = req.query;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado: true}),
        Usuario.find({estado: true})
        .skip(Number(desde))
        .limit(Number(limite))
    ])


    res.json({
        total,
        usuarios
    });
};

const usuariosPut = async(req,res)=>{
    const id = req.params.id;
    const {_id,password,google,correo ,...resto} = req.body;

    //TODO VALIDAR CONTRA db
    if(password){
        //Encrypter password
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        message: 'put API',
        usuario
    });
};

const usuariosPost = async(req,res)=>{
    
    const {nombre,correo,password,rol} = req.body;

    const usuario = new Usuario({nombre,correo,password,rol});

    //Encrypter password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en base de datos

    await usuario.save();

    res.status(201).json({
        usuario
    });
};

const usuariosDelete = async(req,res)=>{

    const {id} = req.params;

    //Borrar Fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    //Deshabilitar Usuario
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});

    res.json(
        usuario
    );
};

module.exports ={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete

}