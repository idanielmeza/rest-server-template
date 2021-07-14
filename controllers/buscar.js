const {ObjectId} = require('mongoose').Types;
const {Usuario,Categoria,Producto} = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos'
];

const buscarUsuarios = async(termino = '', res)=>{

    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or:[{nombre: regex},{correo: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results:[usuarios]
    });

}

const buscarProducto = async(termino = '', res)=>{

    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const producto = await Producto.find({
        $or: [{nombre: regex},{descripcion: regex}],
        $and: [{estado: true}]
    }).populate('categoria', 'nombre')

    res.json({
        results:[producto]
    })
}

const buscarCategoria = async(termino = '', res)=>{

    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const producto = await Producto.findById(termino);
        return res.json({
            results: (producto) ? [producto] : []
        });
    }


    const regex = new RegExp(termino, 'i');

    const categoria = await Categoria.find({nombre: regex, estado: true})

    res.json({
        results:[categoria]
    })
}

const buscar = async (req,res)=>{

    const {coleccion,termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({msg: `Las colecciones permitidas son ${coleccionesPermitidas}`})
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res);
            break;
        case 'categorias':
            buscarCategoria(termino,res)
            
            break;
        case 'productos':
            buscarProducto(termino,res);
            
            break;
    
        default:
            res.status(500).json({msg: 'No hice esta busqueda'})
    }

}

module.exports = {
    buscar
}