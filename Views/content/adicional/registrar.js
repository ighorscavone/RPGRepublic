var registrar = function () {

    var controles = function () {

        return {
            txtUsuario: "#txtUsuario",
            txtsenha: "#txtSenha",
            txtconfirmaSenha: "#txtConfirmarSenha",
            txtemail: "#txtEmail",
        };
    }();

    var registrar = function () {         
        if (validaUsuario()) {
            alert("Usuario Cirado com Sucesso");           
        }
        else {
            alert("Usuario Invalido");
        } 
    };

    var validaUsuario = function () {        
        $.ajax({
            url: "server/salvarUsuario",
            contentType: 'aplication/json',
            data: JSON.stringify(getDto()),
            method: 'POST',
            async: true
        }).done(function (retorno) {
            return true;
        }).fail(function () {
            alert("Falha na conexão com servidor");
        })

    };

    var getDto = function () {
        var dto = {
            'senha': $('#txtConfirmarSenha').val(),
            'usuario': $(controles.txtUsuario).val(),
            'email': $(controles.txtemail).val(),
        };
        debugger;
        return dto;
    };

    return {
        registrar: registrar,
        controles: controles,
    };

}();