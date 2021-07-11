const express = require('express');
const cors = require('cors');
const {dbConnection} = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

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

    }

    router(){

        this.app.use(this.usuariosPath,require('../routes/user'));
        
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log(`corriendo en el puerto ${this.port}`);
        });
    }

}

module.exports = Server;