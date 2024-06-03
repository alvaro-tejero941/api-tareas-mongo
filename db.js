require("dotenv").config();
const { MongoClient,ObjectId } = require("mongodb");

function conectar(){
    return  MongoClient.connect(process.env.URL_MONGO);
}

function tareas(){
    return new Promise(async (ok,ko) => {
    
        try{
            const conexion = await conectar();

            let tareas = await conexion.db("tareas").collection("tareas").find({}).toArray();
            
            conexion.close();

            ok(tareas.map( ({_id,tarea,terminada}) => {
                return {id:_id, tarea , terminada};
            }));

        }catch(error){

            ko({ error : "error en BBDD" });
        }

    });
}

function crearTarea(tarea){
    return new Promise(async (ok,ko) => {
    
        try{
            const conexion = await conectar();

            let {insertedId} = await conexion.db("tareas").collection("tareas").insertOne({tarea,terminada :false});

            conexion.close();

            ok(insertedId);

        }catch(error){
            ko({ error : "error en BBDD" });
        }

    });
}

function borrarTarea(id){
    return new Promise(async (ok,ko) =>{
        try{
            const conexion = await conectar();

            let {insertedId} = await conexion.db("tareas").collection("tareas").deleteOne({_id :new ObjectId(id)});

            conexion.close();

            ok(insertedId);

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

function editarTexto(id,tarea){
    return new Promise(async (ok,ko) =>{
        try{
            const conexion = await conectar();

            let resultado = await conexion.db("tareas").collection("tareas").updateOne({_id :new ObjectId(id)},{$set : {tarea : tarea }});

            conexion.close();

            ok(resultado);

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

function toggleEstado(id){
    return new Promise(async (ok,ko) =>{
        try{
            const conexion = await conectar();

            let {terminada} = await conexion.db("tareas").collection("tareas").findOne({_id : new ObjectId(id)});
            

            let {modifiedCount} = await conexion.db("tareas").collection("tareas").updateOne({_id : new ObjectId(id)},{$set : {terminada: !terminada}});            
            conexion.close();

            ok(modifiedCount);

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

module.exports = {tareas,crearTarea,borrarTarea,editarTexto,toggleEstado}
