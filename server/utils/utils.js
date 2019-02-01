const enviarMensaje = (usuario, mensaje) => {
    return {
        usuario,
        mensaje,
        hora: new Date().getTime()
    }
}

module.exports = {
    enviarMensaje
}