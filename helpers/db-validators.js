const { Categoria,Role,Usuario,Producto } = require('../models');

const esRoleValido = async(rol='') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no existe`);
    }
}

const emailExiste = async(correo)=>{
    const existe = await Usuario.findOne({correo});
    if(existe){
        throw new Error (`El correo ${correo} ya esta en uso`);
    }
}

const idUsuarioExiste = async (id) => {
    const existe = await Usuario.findById(id);
    if(!existe){
        throw new Error (`El id ${id} no existe`);
    }
}

const idCategoriaExiste = async (id) => {
    const existe = await Categoria.findById(id);
    if(!existe){
        throw new Error (`El id ${id} no existe`);
    }
}

const idProductoExiste = async (id) => {
    const existe = await Producto.findById(id);
    if(!existe){
        throw new Error (`El id ${id} no existe`);
    }
}


module.exports={
    esRoleValido,
    emailExiste,
    idUsuarioExiste,
    idCategoriaExiste,
    idProductoExiste
}