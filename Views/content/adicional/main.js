

var base_path = "";



var mostrarLoading = function () {
    $("#modal").css('display', 'block');
}

var removerLoading = function () {
    $("#modal").css('display', 'none');
}

var ExtrairObjeto = function (linhaDatatable, idDatatable) {
    if (linhaDatatable != null) {
        return JSON.parse(JSON.stringify($(idDatatable).DataTable().row($(linhaDatatable).parents('tr')).data()));
    }
}
