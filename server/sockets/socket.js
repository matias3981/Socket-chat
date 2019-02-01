const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { enviarMensaje } = require('../utils/utils');


const usuarios = new Usuarios();
io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (data, callback) => {
        console.log(data);

        if(!data.nombre) {
            return callback({
                err: true,
                msg: ' El nombre es necesario '
            });
        }

        client.join(data.sala)

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('personasConectadas', usuarios.getPersonaPorSala(data.sala));
        callback(usuarios.getPersonaPorSala(data.sala));
    })

    client.on('enviarMensaje', (resp, callback) => {
        let persona = usuarios.getPersona(client.id)
        let mensaje = enviarMensaje(persona.nombre, resp.mensaje);

        client.broadcast.to(persona.sala).emit('enviarMensaje', mensaje);
        callback(mensaje);
    });

    client.on('mensajePrivado', (data) => {
        console.log('mensajeprivado',data.para)
        let persona = usuarios.getPersona(client.id);

        let mensaje = enviarMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
    })

    client.on('disconnect', () => {
       let personaBorrada = usuarios.eliminarPersona(client.id);
        console.log(personaBorrada)
       client.broadcast.to(personaBorrada.sala).emit('crearMensaje', enviarMensaje('Administrador', `${personaBorrada.nombre} salió`))
       client.broadcast.to(personaBorrada.sala).emit('personasConectadas', usuarios.getPersonas());

    })
  
});