var home = function () {
    var controles = function () {
        return {
            TxtSala: "#txtSala",
        }

    };

    var validaEntrarSala = function () {
        if (validaSala($("#txtSala").val())) {

            window.location.href = "/sala.html";
        }
        else {
            alert("Sala Inexistente");
        }
    };

    var validaSala = function (sala) {
        debugger;
        if (sala ) {
            return true;
        }
        else {
            return false;
        }
    };

    var criarSala = function () {
        debugger;
        window.location.href = "/sala.html";
    };

    return {
        criarSala: criarSala,
        validaEntrarSala: validaEntrarSala
    };
}();