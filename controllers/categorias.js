const {Categoria} = require("../models");

const crearCategoria = async(req,res)=>{


    const nombre = req.body.nombre.toUpperCase(); 
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({msg:`La categoria ${nombre} ya existe`})
    }

    //Generar la data a guardar
    const data ={
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar en db
    await categoria.save();

    res.status(201).json(categoria);

};

const obtenerCategoria = async(req,res)=>{

    const {limite=5,desde=0} = req.params;
    const [categorias,total] = await  Promise.all([
        Categoria.countDocuments({estado: true}),
        Categoria.find({estado: true})
        .populate('usuario','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
        
    ])

    res.json({
        categorias,
        total,  
    })

}


const obtenerCategoriaID = async(req,res)=>{

    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario','nombre')

    res.json({categoria});

}

const actualizarCategoria = async(req,res)=>{

    const {id} = req.params;

    const nombre = req.body.nombre.toUpperCase();

    const usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id,{nombre,usuario},{new: true})

    res.json({
        categoria
    })

}

const borrarCategoria = async(req,res)=>{

    const id = req.params.id;

    const usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id,{estado:false,usuario})

    res.json({msg:`Categoria ${categoria.nombre} eliminada`})

}


module.exports ={
    crearCategoria,
    obtenerCategoria,
    obtenerCategoriaID,
    actualizarCategoria,
    borrarCategoria
}