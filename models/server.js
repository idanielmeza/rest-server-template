const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileUpload');
const {dbConnection} = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            usuarios: '/api/usuarios',
            auth: '/api/auth',
            categorias: '/api/categorias',
            produtos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        };

        //Conectar a db
        this.conectarDB();

        //Middleware
        this.middlewares();

        //Rutas de app
        this.router();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //cors
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());
        // this.app.use(express.)

        //Directorio Publico
        this.app.use(express.static('public'));

        //Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));

    }

    router(){
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.usuarios,require('../routes/user'));
        this.app.use(this.paths.categorias,require('../routes/categorias'));
        this.app.use(this.paths.produtos,require('../routes/productos'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.uploads,require('../routes/uploads'));
        
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log(`corriendo en el puerto ${this.port}`);
        });
    }

}

module.exports = Server;