
const esAdmin = (req,res, next)=>{

    if(!req.usuario){
        return res.status(500).json({msg:"Se quiere verificar el rol sin verificar el token"})
    }

    const {rol,nombre} = req.usuario;
    if(rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({msg:`${nombre} no es adminsitrador y no esta autorizado`});
    }

    next()

}

const tieneRole = (...roles)=>{

    return (req,res,next)=>{

        if(!req.usuario){
            return res.status(500).json({msg:"Se quiere verificar el rol sin verificar el token"})
        }

        if( !roles.includes(req.usuario.rol)){
            return res.status(401).json({msg:`Debe ser rol ${roles} y es rol ${req.usuario.rol}`})
        }


        next();
    }

}

module.exports ={
    esAdmin,
    tieneRole
}