const usuariosGet = (req,res)=>{

    const {q,nombre,apikey} = req.query;

    res.json({message: 'get API',q,nombre,apikey});
};

const usuariosPut = (req,res)=>{
    const id = req.params.id;

    res.json({message: 'put API',id});
};

const usuariosPost = (req,res)=>{

    const {nombre,edad} = req.body;

    res.status(201).json({message: 'post API',nombre,edad});
};

const usuariosDelete = (req,res)=>{
    res.json({message: 'delete API'});
};

module.exports ={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete

}