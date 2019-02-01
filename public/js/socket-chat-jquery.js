

var params = new URLSearchParams(window.location.search);
var persona = params.get('persona');

// referencias jQuery
var divUsuarios = $('#divUsuarios');
var mensajeForm = $('#mensajeForm');
var mensajeInput = $('#mensajeInput');
var divChatbox = $('#divChatbox');


// funciones para renderizar usuarios
function renderizarUsuarios(personas) {

    console.log(personas);

    var html = '';

    html += '<li>';
    html +=     '<a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala')+'</span></a>';
    html += '</li>';

    for( let i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a href="javascript:void(0)" data-id='+ personas[i].id +'><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+  personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo){

    var html = '';
    var fecha = new Date(mensaje.hora);
    var hora = fecha.getHours()+':'+fecha.getMinutes();

    if(yo){
        html += '<li class="reverse">'
        html += '    <div class="chat-content">'
        html += '        <h5>'+mensaje.usuario+'</h5>'
        html += '        <div class="box bg-light-inverse">'+mensaje.mensaje+'</div>'
        html += '    </div>'
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '    <div class="chat-time">'+hora+'</div>'
        html += '</li>'
    }else {

        html += '<li>'
        html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        html += '    <div class="chat-content">'
        html += '        <h5>'+ mensaje.usuario +'</h5>'
        html += '        <div class="box bg-light-info">'+ mensaje.mensaje +'</div>'
        html += '    </div>'
        html += '    <div class="chat-time">'+hora+'</div>'
        html += '</li>'
    }

    divChatbox.append(html);
}

mensajeForm.on('submit', function(e){
    e.preventDefault();

    console.log(mensajeInput.val());

    socket.emit('enviarMensaje', {
         nombre: persona,
         mensaje: mensajeInput.val()
     }, function(resp) {
         console.log('respuesta server: ', resp);

         mensajeInput.val('').focus();
         renderizarMensajes(resp, true)
     });
})