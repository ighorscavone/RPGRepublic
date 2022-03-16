var registrar = function () {

    var controles = function () {

        return{
            txtUsuario: "#txtUsuario",
            txtsenha: "#txtSenha",
            txtconfirmaSenha: "#txtConfirmarSenha",
        };
    };

    var registrar = function(){
        if(validaUsuario)
        {
            alert("Usuario Cirado com Sucesso");
            window.location.href = "/home.html";
        }
        else
        {
            alert("Usuario Invalido");
        }
    };

    var validaUsuario = function(){
        return true;
        $.ajax({
            data: getDto(),
            url: "registrar/registrar",
            context: document.body
          }).done(function() {
            $( this ).addClass( "done" );
          }).fail(function(){
            alert("Erro do servidor");
          })
       
    };

    var getDto = function(){
        var dto = {
            'senha': controles.txtsenha,
            'usuario': controles.txtUsuario,
        }
    };

    return {
        registrar: registrar,
        controles: controles,
    };

}();