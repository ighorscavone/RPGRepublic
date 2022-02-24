function configuraDatatable(params) {
    var funcTratarSuccess = function (data, oSettings) {
        var mensagem = '';
        if (data.sErrorMessage != undefined && data.sErrorMessage.length > 0) {
            mensagem = data.sErrorMessage;
        } else if (oSettings.aiDisplay.length === 0) {
            mensagem = oSettings.oLanguage.sEmptyTable;
        }
        datatablesExibeMensagem(oSettings, mensagem);
    }
    var configuracaoPadrao = {
        bJQueryUI: false,
        bFilter: false,
        dom: 'Bfrtip',
        buttons: ['excelHtml5'], responsive : true,
        aaSorting: [],
        bProcessing: false,
        bServerSide: true,
        bDeferRender: true,
        bDestroy: params.destruir || true,
        bAutoWidth: false,
        bInfo: false,
        iDisplayLength: params.registrosPorPagina || 10,
        bPaginate: true,
        sPaginationType: 'full_numbers',
        bLengthChange: false,
        fnServerData: function (sSource, aoData, fnCallback, oSettings) {
            sSource += '?time=' + Math.random();
            mostrarLoading();
            oSettings.jqXHR = $.ajax({
                dataType: 'json',
                type: params.httpMethod || 'GET',
                url: sSource,
                cache: false,
                data: concatDados(params.dados, aoData),
                success: function (data) {

                    oSettings.primeiraRequisicaoCompleta = true;
                    fnCallback(data);
                    funcTratarSuccess(data, oSettings);
                    if (typeof (params.onSuccess) == 'function') {
                        params.onSuccess(data, oSettings);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {

                    oSettings.primeiraRequisicaoCompleta = true;
                    if (typeof (params.onError) == 'function') {
                        params.onError(xhr, ajaxOptions, thrownError, oSettings);
                    } else if (xhr.status == 200) {
                        datatablesExibeMensagem(oSettings, xhr.responseText);
                    } else {
                        //mostrarErroPopup(params.mensagemErroGeral || thrownError);
                        mostrarErroPopup(xhr.responseText);
                    }
                },
                beforeSend: function () {
                    if (typeof (params.onBeforeSend) == 'function') {
                        params.onBeforeSend();
                    }
                },
                complete: function () {
                    if (typeof (params.onComplete) == 'function') {
                        params.onComplete();
                    }
                    removerLoading();
                },
            });
        },
        oLanguage: params.oLanguage || {
            sUrl: base_path + "Scripts/datatables/Portuguese-Brasil.json"
        }
    };

    var config = {
        sAjaxSource: params.urlBase + params.acao,
        aoColumns: params.colunas,
        aoColumnDefs: params.configuracoesColunas,
        aaSorting: params.ordenacaoPadrao,
        fnServerParams: params.parametrosServidor,
        bPaginate: params.comPaginacao == undefined || params.comPaginacao,
        fnDrawCallback: params.drawCallback,
        fnRowCallback: params.fnRowCallback,
        sDom: params.sDom,
        bInfo: params.mostrarInformacoes
    };

    config.fnHeaderCallback = function (nHead, aData, iStart, iEnd, aiDisplay) {
        $(nHead).find('th').each(function () {
            var $this = $(this);
            if ($this.find('> span').length == 0) {
                $this.html($('<span />').html($this.html()));
            }
        });
        if (typeof (params.headerCallback) == 'function') {
            params.headerCallback(nHead, aData, iStart, iEnd, aiDisplay);
        }
    };

    $.extend(configuracaoPadrao, config);
    return $(params.seletorTabela)
        .on('processing', function (evt, oSettings, bShow) {
            var $divWrapper = $(oSettings.nTableWrapper);
            oSettings.primeiraRequisicaoCompleta ? $divWrapper.show() : $divWrapper.hide();
        }).dataTable(configuracaoPadrao);
}

function concatDados(dados, aodata) {
    if (dados == undefined || dados == null) return aodata;

    dados.iDisplayStart = $(aodata).filter(function (idx, el) { return el.name == "iDisplayStart"; }, aodata)[0].value;
    dados.iDisplayLength = $(aodata).filter(function (idx, el) { return el.name == "iDisplayLength"; }, aodata)[0].value;
    dados.iSortCol_0 = $(aodata).filter(function (idx, el) { return el.name == "iSortCol_0"; }, aodata)[0].value;
    dados.sSortDir_0 = $(aodata).filter(function (idx, el) { return el.name == "sSortDir_0"; }, aodata)[0].value;

    return dados;
}

function datatablesExibeMensagem(oSettings, mensagem) {
    var $divWrapper = $(oSettings.nTableWrapper);
    var $table = $(oSettings.nTable)
        .add(oSettings.nScrollHead)
        .add(oSettings.nScrollFoot);
    var $paginacao = $divWrapper.find('.dataTables_paginate, .dataTables_info');
    $('.dataTables_msg_container', oSettings.nTableWrapper).remove();
    $table.show();
    if (mensagem != undefined && mensagem.length > 0) {
        $table.hide();
        $paginacao.hide();
        var $divMsg = $('<div/>').addClass('dataTables_msg_container div-mensagem-vazia');
        var $spanMsg = $('<span/>').addClass('dataTables_msg');
        $spanMsg.text(mensagem);
        $divWrapper.append($divMsg.append($spanMsg));
    }
    $divWrapper.show();
}

function esconderTabela($tabela) {
    var config = $tabela.dataTable().fnSettings();
    var $divWrapper = $(config.nTableWrapper);
    $divWrapper.hide();
}

function recuperarConfiguracoesDataTable(config) {
    var configBaseDataTable = {
        bJQueryUI: false,
        bFilter: false,
        "bPaginate": false,
        "bProcessing": false,
        "bServerSide": true,
        "aaSorting": config.aaSorting || [[0, 'asc']],
        'bFilter': false,
        "bDeferRender": true,
        "bDestroy": true,
        "bAutoWidth": false,
        "bLengthChange": false,
        "bInfo": false,
        "oLanguage": config.oLanguage || {
            "sZeroRecords": "Nenhum registro encontrado.",
        }
    };

    return configBaseDataTable;
}