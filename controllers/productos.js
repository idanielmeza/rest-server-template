const {Producto, Categoria} = require('../models');

const crearProducto = async(req,res) => {

    const {nombre,precio,categoria,descripcion} = req.body;

    nombre.toUpperCase();

    if(await Producto.findOne({nombre})){
        return res.status(400).json({msg:`El producto ${nombre} ya existe`})
    }

    const id = req.usuario.id;

    const data ={
        nombre,
        precio,
        categoria,
        descripcion,
        usuario: id
    }

    const producto = new Producto(data);
    await producto.save();
    
    res.status(201).json({producto})
}

const obtenerProductos = async(req,res)=>{

    const {limite=5,desde=0} = req.params;

    const [total,productos] = await Promise.all([
        Producto.countDocuments({estado: true}),
        Producto.find({estado: true})
        .populate('usuario','nombre')
        .populate('categoria','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.status(200).json({productos,total});

}

const obtenerProductosID = async(req,res)=>{

    const id = req.params.id;

    const producto = await Producto.findById(id)
    .populate('usuario','nombre')
    .populate('categoria','nombre')

    res.status(200).json(producto)

}

const actualizarProducto = async(req,res)=>{

    const id = req.params.id;

    const viejoProducto = await Producto.findById(id);

    let {nombre,precio,categoria,descripcion} = req.body;

    if(!req.body.nombre){
        nombre = viejoProducto.nombre;
    }
    if(!req.body.precio){
        precio = viejoProducto.precio;
    }
    if(!req.body.descripcion){
        descripcion = viejoProducto.descripcion;
    }
    if(!req.body.categoria){
        categoria = viejoProducto.categoria;
    }

    nombre.toUpperCase();

    const data = {
        nombre,
        precio,
        categoria,
        descripcion
    }

    try {

        if(await  Categoria.findById(categoria)){

            const producto = await Producto.findByIdAndUpdate(id,data, {new: true})
    
            return res.json(producto);
        }
        res.status(400).json({mgs: `La categoria es invalida`});
        
    } catch (error) {
        res.status(400).json({mgs: `El id es invalido`});
    }
    
    
}

const borrarProducto = async(req,res)=>{

    const id = req.params.id;

    const usuario = req.usuario;

    const producto = await Producto.findByIdAndUpdate(id,{usuario,estado: false})

    res.json({msg: `Producto ${producto.nombre} eliminado`})
}


module.exports ={
    crearProducto,
    obtenerProductos,
    obtenerProductosID,
    actualizarProducto,
    borrarProducto
}