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
            $.ajax({
                url: "salvarUsuario",
                contentType: 'aplication/json',
                data: JSON.stringify(getDto()),
                method: 'POST',
                async: true
            }).done(function (retorno) {
                debugger;
                alert("Usuario Cirado com Sucesso" + retorno);
            }).fail(function () {
                alert("Falha na conexão com servidor");
            })                       
        }
        else {
            alert("Usuario Invalido");
        } 
    };

    var validaUsuario = function () {        
       return true;

    };

    var getDto = function () {
        var dto = {
            'senha': $(controles.txtsenha).val(),
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