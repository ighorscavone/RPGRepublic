var $ListaFuncionalidades = [];
var CopiarImagemAluno;
var $tabelaGeral;
var $ItemTabelaGeral;

function exportarTabelaExcelPadrao(divTabela) {
    var tab_text = "<table border='2px'><tr>";
    var textRange; var j = 0;

    if (divTabela) {
        tab = $('#' + divTabela)[0];
    }
    else
        $('.table-responsive').find('table').each(function () {

            var $divAux = $(this).clone(true);
            $divAux.prop('id', 'divAuxExport');

            $("#fakeTable").empty();
            $("#fakeTable").append($divAux);

            $("#divAuxExport").find('th:hidden,td:hidden').remove();

            tab = $divAux[0];
        });

    if ($("#" + tab.id).find("tr.selected").length > 0) {

        $("#" + tab.id).find("tr.selected, tr.header-mapa").each(function () {
            tab_text = tab_text + $(this).html() + "</tr>";
        });

    } else {
        for (j = 0 ; j < tab.rows.length ; j++) {
            tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        }
    }

    tab_text = tab_text + "</table>";
    // tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove links
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove imagem
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); //remove inputs

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (detectIE())//Internet Explorer
    {
        txtExportExcel.document.open("txt/html", "replace");
        txtExportExcel.document.write(tab_text);
        txtExportExcel.document.close();
        txtExportExcel.focus();
        sa = txtExportExcel.document.execCommand("SaveAs", true, "Documento Portal.xls");
    }
    else {   //outros browsers          
        sa = window.open('data:application/vnd.ms-excel,' + escape(tab_text))
    }

    $("#fakeTable").empty();
    return (sa);
}


function tornaBotaoDefault(idBotao, idObjectFocus) {
    $(document).keypress(function (e) {
        if ($(":focus").attr("id") == idObjectFocus || idObjectFocus == undefined || idObjectFocus == "") {
            //codigo da tecla enter
            if (e.which == 13) {
                e.preventDefault();
                $('#' + idBotao).click();
            }
        }
    });
}

function validarHoraSemSegundos(hora) {

    if (!/^\d{2}:\d{2}$/.test(hora)) return false;
    var parts = hora.split(':');
    if (parts[0] > 23 || parts[1] > 59) return false;
    return true;

}

function validarHoraCompleta(hora) {

    if (!/^\d{2}:\d{2}:\d{2}$/.test(hora)) return false;
    var parts = hora.split(':');
    if (parts[0] > 23 || parts[1] > 59) return false;
    return true;

}

///Ambos os parametros serão validados como obrigatórios
function validaHoraInicioTerminoInString(inicio, termino) {

    if (!inicio || !validarHoraSemSegundos(inicio)) {
        mostrarAvisoPopup('Horario de Início Inválido');
        return false;
    }

    if (!termino || !validarHoraSemSegundos(termino)) {
        mostrarAvisoPopup('Horario de Término Inválido');
        return false;
    }

    //data qualquer
    var year = '2016';
    var month = '01';
    var day = '01';

    var partsInicio = inicio.split(':');
    var hourInicio = partsInicio[0];
    var minInicio = partsInicio[1];

    var partsTermino = termino.split(':');
    var hourTermino = partsTermino[0];
    var minTermino = partsTermino[1];

    var dataInicio = new Date(year, month, day, hourInicio, minInicio)
    var dataTermino = new Date(year, month, day, hourTermino, minTermino)

    if (dataInicio >= dataTermino) {
        mostrarAvisoPopup('Horario de Início não pode ser maior ou igual o Horário de Término!');
        return false;
    }

    return true;
}

function pesquisarUsuarioLogado() {

    // $.ajax({
    //     type: "POST",
    //     url: base_path + "Home/GetUsuarioLogado",
    //     cache: false,
    //     dataType: "json",
    //     success: function (data) {

    //         localStorage.setItem('UsuarioLogadoCompleto', JSON.stringify(data.usuario));
    //     },
    //     error: function (XMLHttpRequest, textStatus, errorThrown) {
    //         mostrarErroPopup("Não foi possível obter o usuário logado! Erro:  " + errorThrown);

    //     },
    //     complete: function () {
    //         removerLoading();
    //     }
    // });
}


//mantém somente as local storage base
//foto do usuario 
//posição do menu lateral
function clearAllLocalStorage() {

    var extensaoFotoUsuario = localStorage.getItem('ExtensaoFotoUsuario');
    var conteudoBase64FotoUsuario = localStorage.getItem('ConteudoBase64FotoUsuario');
    var navegacaoOpened = localStorage.getItem('navegacaoOpened');
    var simulacaoAtiva = localStorage.getItem('SimulacaoAtiva');
    var cssAtivo = localStorage.getItem('cssAtivo');
    var usuarioLogadoCompleto = localStorage.getItem('UsuarioLogadoCompleto');
    var camposDoRelatorioDeMP = localStorage.getItem("camposSelecionados");

    localStorage.clear();

    localStorage.setItem('ExtensaoFotoUsuario', extensaoFotoUsuario);
    localStorage.setItem('ConteudoBase64FotoUsuario', conteudoBase64FotoUsuario);
    localStorage.setItem('navegacaoOpened', navegacaoOpened);
    localStorage.setItem('cssAtivo', cssAtivo);
    localStorage.setItem('UsuarioLogadoCompleto', usuarioLogadoCompleto);
    localStorage.setItem('camposSelecionados', camposDoRelatorioDeMP);

    if (simulacaoAtiva)
        localStorage.setItem('SimulacaoAtiva', simulacaoAtiva);
}

function limparLocalStoragePerfil() {
    clearAllLocalStorage();
}

function limparLocalStorageFotoUsuario() {

    localStorage.removeItem('ExtensaoFotoUsuario');
    localStorage.removeItem('ConteudoBase64FotoUsuario');
}

function simularUsuario(login) {

    limparLocalStoragePerfil();
    limparLocalStorageFotoUsuario();

    $('#btnSairSimulacao').show();
    localStorage.setItem('SimulacaoAtiva', true);

    window.location = base_path + "SimularUsuario/TrocarUsuario/?usuarioLogin=" + login;
}

function encerrarSimulacaoUsuario() {

    limparLocalStoragePerfil();
    limparLocalStorageFotoUsuario();

    $('#btnSairSimulacao').hide();
    localStorage.removeItem('SimulacaoAtiva');
    window.location = base_path + "SimularUsuario/EncerrarSimulacaoUsuario";
}


function criaLinksPorPerfil() {

    // verificaValidadePerfil();

    // if (localStorage.getItem('PermissoesPerfil') != null) {
    //     $ListaFuncionalidades = JSON.parse(localStorage.getItem('PermissoesPerfil'));
    //     habilitaLinks();
    // }
    // else {
    //     mostrarLoading();
    //     $.ajax({
    //         type: "POST",
    //         url: base_path + "Home/FiltrarLinksPorPerfil",
    //         cache: false,
    //         dataType: "json",
    //         success: function (data) {
    //             $ListaFuncionalidades = data.aaData.Funcionalidades;
    //             localStorage.setItem('PermissoesPerfilUsuarioLogado', data.aaData.Usuario);
    //             localStorage.setItem('PerfilUsuarioLogado', JSON.stringify(data.aaData.Perfil));
    //             localStorage.setItem('PermissoesPerfilTemporizador', new Date().getTime());
    //             localStorage.setItem('PermissoesPerfil', JSON.stringify(data.aaData.Funcionalidades));
    //             habilitaLinks();

    //         },
    //         error: function (XMLHttpRequest, textStatus, errorThrown) {
    //             mostrarErroPopup("N&atilde;o foi poss&iacute;vel carregar o seu perfil de acesso! Erro:  " + errorThrown);

    //         },
    //         complete: function () {
    //             removerLoading();
    //         }
    //     });
    // }
}

function isAdministrador() {

    if (localStorage.getItem('PerfilUsuarioLogado') == null)
        return false;

    var listaPerfil = JSON.parse(localStorage.getItem('PerfilUsuarioLogado'));
    for (var i in listaPerfil) {
        if (listaPerfil[i].toUpperCase() == "ADMINISTRADOR") {

            return true;
        }
    }

    return false;
}

function verificaValidadePerfil() {

    //significa que o usuario foi trocado, consequentemente as permissões também deverão ser ...
    var usuarioAnterior = localStorage.getItem('PermissoesPerfilUsuarioLogado');
    if (usuarioAnterior != null)
        if (usuarioLogado != usuarioAnterior) {
            limparLocalStoragePerfil();
            criaLinksPorPerfil();
            return;
        }

    //limpa o localStorage se fazer mais de uma hora que as permissões foram verificadas
    var dataInicial = localStorage.getItem('PermissoesPerfilTemporizador')
    var dataAtual = new Date().getTime();


    if (dataInicial != null) {
        var hours = Math.abs(dataAtual - dataInicial) / 3600000;
        if (hours >= 1) {
            limparLocalStoragePerfil();
            criaLinksPorPerfil();
        }
    }
}

function habilitaLinks() {
    if ($ListaFuncionalidades.length > 0) {
        for (var i = 0; i < $ListaFuncionalidades.length; i++) {

            var func = '#' + $ListaFuncionalidades[i].replace('.', '_');
            try {
                $(func).removeClass('invisible');
                var pai = $(func).parent().parent().parent();
                if ($(pai).hasClass('invisible')) {
                    $(pai).removeClass('invisible');
                }

                //Para itens de 3º nivel-- cadastrar o link com a classe Neto
                if ($(func).hasClass('neto')) {

                    var pai = $(func).parent().parent().parent();
                    if ($(pai).hasClass('invisible')) {
                        $(pai).removeClass('invisible');
                    }

                    var avo = $(func).parent().parent().parent().parent().parent();
                    if ($(avo).hasClass('invisible')) {
                        $(avo).removeClass('invisible');
                    }
                }
            }
            catch (error) {

            }

        }
    }
    $('.menu-filho').each(function () {
        if ($(this).hasClass('invisible')) {
            $(this).remove();
        }
    });
}

function habilitaBotaoSair() {
    if (detectIE())
        $('#btnSair').show();
    else
        $('#btnSair').hide();

}

function validaDatas(dataInicio, dataTermino) {
    if (!isDataValida(dataInicio)) {
        mostrarAvisoPopup("Data de In&iacute;cio Inv&aacute;lida!");
        return false;
    }

    if (dataTermino != "" && !isDataValida(dataTermino)) {
        mostrarAvisoPopup("Data de T&eacute;rmino Inv&aacute;lida!");
        return false;
    }

    if (dataTermino != "") {
        if (parseDMY(dataTermino) < parseDMY(dataInicio)) {
            mostrarAvisoPopup("Data de T&eacute;rmino n&atilde;o pode ser menor que Data de In&iacute;cio!");
            return false;
        }
    }
    return true;
}

function validaCnpj(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '') return false;
    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida Digitos Validadores
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}

///Devolve o objeto com o valor maximo na propriedade passada 
function getMaxValueInJsonArray(array, propName) {
    var max = 0;

    var maxItem = null;
    for (var i = 0; i < array.length; i++) {
        var item = array[i];

        if (item[propName] > max) {
            max = item[propName];
            maxItem = item;
        }
    }

    return maxItem;
}

///Verifica se existe um objeto no array com o valor desejado, a partir de uma propriedade 
///Parametros
///valor : valor desejado, um id por exemplo
///propName : Nome da propriedade a ser verificada
///list : lista onde a verificação irá acontecer
function Any(valor, propName, list) {

    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item[propName] === valor) {
            return true;
        }
    }

    return false;
}

String.prototype.toHHMM = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    var time = hours + ':' + minutes;
    return time;
}

function parseDMY(value) {

    var date = value.split("/");
    var d = parseInt(date[0], 10),
        m = parseInt(date[1], 10),
        y = parseInt(date[2], 10);
    return new Date(y, m - 1, d);
}

function calculaIdade(textoNascimento) {
    if (textoNascimento === null ||
      textoNascimento == undefined ||
      textoNascimento == '') {
        return '';
    }
    else {

        var dataFormatada = formataDataFromDatepicker(textoNascimento);
        dob = new Date(dataFormatada);
        var today = new Date();
        var age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
        if (isNaN(age))
            age = 0;
        return age;
    }
}

function ConverterStringToDate(data) {
    var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    return new Date(data.replace(pattern, '$3/$2/$1'));
}

function converterDataServidor(data) {
    if (data) {
        var datafinal = moment(new Date(parseInt(data.substr(6))));
        return datafinal.format('DD/MM/YYYY');
    } else {
        return "";
    }
}

function ExtrairObjeto(linhaDatatable, idDatatable) {
    if (linhaDatatable != null) {
        //return JSON.parse(JSON.stringify($(idDatatable).DataTable().row($(linhaDatatable).parents('tr')).data()));

        var current_row = $(linhaDatatable).parents('tr');

        if (current_row.hasClass('child')) {//Check if the current row is a child row
            current_row = current_row.prev();//If it is, then point to the row before it (its 'parent')
        }

        return JSON.parse(JSON.stringify($(idDatatable).DataTable().row(current_row).data()));
    }
}

function getListaTabela(idtabela) {
    try {
        if (idtabela) {
            return JSON.parse(JSON.stringify($(idtabela).DataTable().rows().data().toArray()))

        }
    }
    catch (error) {

    }
}

function formataDataFromDatepicker(data) {
    var dia = data.substring(0, 2);
    var mes = data.substring(3, 5);
    var ano = data.substring(6, 10);

    return ano + '-' + mes + '-' + dia;
}

function formataDataEmStringDMY(data, separador) {
    var novaData = "";
    var parts = data.split(separador);
    var ano = parts[0];
    var mes = parts[1];
    var dia = parts[2];

    novaData = dia + '/' + mes + '/' + ano;

    return novaData;
}

function CriaArray(n) {
    this.length = n;
}

function GetDiaSemana(data) {
    NomeDia = new CriaArray(7);
    NomeDia[0] = "Segunda-feira";
    NomeDia[1] = "Ter&ccedil;a-feira";
    NomeDia[2] = "Quarta-feira";
    NomeDia[3] = "Quinta-feira";
    NomeDia[4] = "Sexta-feira";
    NomeDia[5] = "S&aacute;bado";
    NomeDia[6] = "Domingo";

    data = formataDataFromDatepicker(data);
    var dia = new Date(data);
    return HtmlDecode(NomeDia[dia.getDay()]);
}
///Função que detecta se o navegador utilizado é o IE
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // IE 12 => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function habilitarDatePicker() {

    $('.input-calendario').datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "1900:+5",
        dateFormat: 'dd/mm/yy',
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'S&aacute;bado', 'Domingo'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S&aacute;b', 'Dom'],
        monthNames: ['Janeiro', 'Fevereiro', 'Mar&ccedil;o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        nextText: 'Próximo',
        prevText: 'Anterior',
        /* fix buggy IE focus functionality */
        fixFocusIE: false,
        onSelect: function (dateText, inst) {
            this.fixFocusIE = true;
            $(this).change().focus();
        },
        onClose: function (dateText, inst) {
            this.fixFocusIE = true;
            this.focus();
        },
        beforeShow: function (input, inst) {
            $('#ui-datepicker-div').maxZIndex();
            var result = detectIE() ? !this.fixFocusIE : true;
            this.fixFocusIE = false;
            return result;
        }
    }).mask('99/99/9999', { placeholder: '' }).click(function () { console.log('Y'); $(this).focus() });

    $('.glyphicon-calendar,.icon-calendar').parent('button').click(function () {
        console.log('X');

        $(this).parent().prev('.input-calendario').focus();
    });
}

// function verificaTamanhoTela() {
//     if (!isMobileMini()) {
//         //Mantém o menu aberto (se não for mobile)
//         if (typeof $(".navegacao") != 'undefined'
//                 && $(".navegacao") != null) {
//             if (localStorage.getItem('navegacaoOpened') == 'true') {
//                 $(".navegacao").fadeIn(350);
//                 document.getElementById('conteudo').setAttribute('class', '');
//             } else {
//                 $(".navegacao").fadeOut(350);
//                 document.getElementById('conteudo').setAttribute('class', 'full-width');
//             }
//         }
//         $("#logo").find('img').prop('src', base_path + 'Content/images/logotipos/logo_termomecanica_app.png');
//         verificaAmbiente();
//         $('#perfil').find('img').show();

//         // $("#logo").find('img').removeClass('grayscale')
//     }
//     else {
//         //Se for Mobile retrai o menu quando recarregar a página
//         $(".navegacao").fadeOut(360);
//         document.getElementById('conteudo').setAttribute('class', 'full-width');
//         $("#logo").find('img').prop('src', base_path + 'Content/images/logotipos/LOGO_TM.PNG');
//         // $("#logo").find('img').addClass('grayscale')
//         $('#span_nome_ambiente').html('');
//         $('#perfil').find('img').hide();

//     }
// }

function habilitarAutocomplete() {
    //Para funcionar o autocomplete
    $('*[data-autocomplete-url]').each(function () {

        $(this).autocomplete({
            source: $(this).data("autocomplete-url")
        });
    });
}

$(document).ready(function () {
    verificaAmbiente();
    //Esta chamada torna os links de acessos dinâmicos
    //criaLinksPorPerfil();

    //Para funcionar o autocomplete
    habilitarAutocomplete();

    //if (typeof (document.getElementById('navegacao')) != 'undefined'
    //            && document.getElementById('navegacao') != null) {
    //    if (localStorage.getItem('navegacaoOpened') == 'true') {
    //        document.getElementById('navegacao').setAttribute('class', 'show');
    //        document.getElementById('conteudo').setAttribute('class', '');
    //    } else {
    //        document.getElementById('navegacao').setAttribute('class', 'hide');
    //        document.getElementById('conteudo').setAttribute('class', 'full-width');
    //    }
    //}

    // window.onresize = function (event) {
    //     verificaTamanhoTela();
    // };

    // verificaTamanhoTela();

    ////Bloqueia o clique direito
    //$(this).bind("contextmenu", function (e) {
    //    if (e.button == 2) {
    //        //Verifica se o usuário tem acesso a copiar a imagem de aluno e libera
    //        if ($(e.target).hasClass("moldura")) {
    //            if (!CopiarImagemAluno) {
    //                mostrarInfoPopup("Comando n&atilde;o permitido!");
    //                e.preventDefault();
    //            }
    //        }
    //        else {
    //            mostrarInfoPopup("Comando n&atilde;o permitido!");
    //            e.preventDefault();
    //        }
    //    }
    //    else { e.preventDefault(); }
    //});


    /////Bloqueia o F12
    document.onkeydown = function (e) {
        e = (e || window.event);
        //if (e.keyCode == 123 || e.keyCode == 18) {
        //    e.preventDefault();
        //    return false;
        //}

        var preventKeyPress;
        if (e.keyCode == 8) {
            var d = e.srcElement || e.target;
            switch (d.tagName.toUpperCase()) {
                case 'TEXTAREA':
                    preventKeyPress = d.readOnly || d.disabled;
                    break;
                case 'INPUT':
                    preventKeyPress = d.readOnly || d.disabled ||
                        (d.attributes["type"] && $.inArray(d.attributes["type"].value.toLowerCase(), ["radio", "checkbox", "submit", "button"]) >= 0);
                    break;
                case 'DIV':
                    preventKeyPress = d.readOnly || d.disabled || !(d.attributes["contentEditable"] && d.attributes["contentEditable"].value == "true");
                    break;
                default:
                    preventKeyPress = true;
                    break;
            }
        }
        else
            preventKeyPress = false;

        if (preventKeyPress)
            e.preventDefault();
    }
    bindsLoad();

});


function bindSimulacao() {

    var simulacaoAtiva = localStorage.getItem('SimulacaoAtiva');
    if (simulacaoAtiva)
        $('#btnSairSimulacao').show();
    else
        $('#btnSairSimulacao').hide();
}

function bindsLoad() {

    bindSimulacao();
    bindCarateresEspeciais();
    bindSkin();
    bindNumericKeypress();
    bindDecimalKeypress();
    criarEventosDePopup();
    // bindSalvar();
    bindNumerico();
    habilitarDatePicker();
    habilitaBotaoSair();
    verificarCssAtivo();
   // feedback.verificarSeJaHouveFeedback();
}

function verificarCssAtivo() {

    if (localStorage.getItem('cssAtivo')) {
        var cor = localStorage.getItem('cssAtivo');
        changeCor(cor);
    }
}

function changeCor(cor) {

    switch (cor) {
        case 'preto': {
            var caminhoCssAtivo = base_path + 'Content/preto.css';

            $('#cssMain').attr('href', caminhoCssAtivo);
            localStorage.setItem('cssAtivo', cor);
        }
            break;

        case 'amarelo': {
            var caminhoCssAtivo = base_path + 'Content/amarelo.css';

            $('#cssMain').attr('href', caminhoCssAtivo);
            localStorage.setItem('cssAtivo', cor);
        }
            break;
        case 'azul': {
            var caminhoCssAtivo = base_path + 'Content/azul.css';

            $('#cssMain').attr('href', caminhoCssAtivo);
            localStorage.setItem('cssAtivo', cor);
        }
            break;
        default: {
            var caminhoCssAtivo = base_path + 'Content/preto.css';

            $('#cssMain').attr('href', caminhoCssAtivo);
            localStorage.setItem('cssAtivo', cor);
        }
    }
}

function bindCarateresEspeciais() {

    var regex = new RegExp("^[ A-Za-za-záàâãéèêíìîïóòôõöúùûüçñÁÀÂÃÉÈÊÍÌÎÏÓÒÔÕÖÚÙÛÇÑ0-9()\"'*{}\\r\\n§|°=_@.,:;!$%?ªº/#&+-]*$");
    var mensagemColar = "Caracteres não permitidos foram encontrados. Colagem cancelada!"

    $('input').bind('keypress', function (event) {

        if (event.keyCode >= 8 && event.keyCode <= 46) { return; }

        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            mostrarAvisoPopup("Caracter " + key + "  não permitido!");
            return false;
        }
    });

    $('textarea').bind('keypress', function (event) {

        if (event.keyCode >= 8 && event.keyCode <= 46) { return; }

        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            mostrarAvisoPopup("Caracter " + key + "  não permitido!");
            return false;
        }
    });

    $("textarea").on("paste", function (e) {

        var pastedData = '';
        if (detectIE())
            pastedData = window.clipboardData.getData('Text')
        else
            pastedData = e.originalEvent.clipboardData.getData('text');

        if (!regex.test(pastedData)) {
            e.preventDefault();
            mostrarAvisoPopup(mensagemColar);
            return false;
        }
    });

    $("input").on("paste", function (e) {

        var pastedData = '';
        if (detectIE())
            pastedData = window.clipboardData.getData('Text')
        else
            pastedData = e.originalEvent.clipboardData.getData('text');

        if (!regex.test(pastedData)) {
            e.preventDefault();
            mostrarAvisoPopup(mensagemColar);
            return false;
        }
    });
}

function bindNumerico() {
    /*Função para evitar digitação de caracteres em campos Numéricos
        Obtém cada tecla digitada nos campos que possuem a classe "Numerico" para verificação.*/
    $('.numerico').keypress(function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }

        return true;
    });
}

function bindSkin() {
    $('#corAzul').click(function () {
        $('link[href$="azul.css"]').attr('href', 'Content/amarelo.css');
    });

    $('#corAmarelo').click(function () {
        $('link[href$="amarelo.css"]').attr('href', 'Content/azul.css');
    });
}

function bindNumericKeypress() {
    ///classe que deixa os textBox aceitarem somente números
    $(".numeric").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter 
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode == 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $(".numeric").bind('paste', function (e) {

        var data = "";
        if (detectIE())
            data = window.clipboardData.getData("Text");
        else
            data = e.originalEvent.clipboardData.getData('Text');

        try {
            if (isNaN(parseInt(data)))
                e.preventDefault();
        }
        catch (error) {
            e.preventDefault();
        }
    });
}

function bindDecimalKeypress() {
    $(".decimal").keydown(function (e) {

        // Ensure only one comma
        if (($(this).val().match(/,/g) || []).length == 1 && (e.keyCode == 188 || e.keyCode == 110)) {
            e.preventDefault();
            return;
        }

        // Allow: backspace, delete, tab, escape, enter 
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode == 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: ,
            (e.keyCode == 188 || e.keyCode == 110) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }

        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $(".decimal").bind('paste', function (e) {
        var data = "";
        if (detectIE())
            data = window.clipboardData.getData("Text");
        else
            data = e.originalEvent.clipboardData.getData('Text');

        try {
            if (isNaN(parseInt(data)))
                e.preventDefault();
        }
        catch (error) {
            e.preventDefault();
        }
    });
}
//diferencia os ambientes
function verificaAmbiente() {

    if (!isMobile()) {
        //testes
        if (window.location.toString().toUpperCase().indexOf('TMPORTALTESTES') > 0) {
            $('#perfil').css('background', 'rgba(232, 145, 12, 1)');
            $('#span_nome_ambiente').html('<b>AMBIENTE DE TESTES</b>');
            $('#span_nome_ambiente').show();
        }
            //Homologação
        else if (window.location.toString().toUpperCase().indexOf('TMPORTAL') > 0 &&
            (
            window.location.toString().toUpperCase().indexOf('TMDC1PORTALHOM') > 0
            ||
            window.location.toString().toUpperCase().indexOf('PORTALTMHOM') > 0
            )

            ) {
            $('#perfil').css('background', 'rgba(6, 134, 61, 1)');
            $('#span_nome_ambiente').html('<b>AMBIENTE DE HOMOLOGAÇÃO</b>');
            $('#span_nome_ambiente').show();
        }
            // DESENVOLVIMENTO
        else if (window.location.toString().toUpperCase().indexOf('LOCALHOST') > 0) {
            $('#perfil').css('background', 'black');
            $('#span_nome_ambiente').html('<b>AMBIENTE DE DESENVOLVIMENTO</b>');
            $('#span_nome_ambiente').show();
        }
    }

    // if (window.location.toString().toUpperCase().indexOf('TMDC1PORTALHOM') > 0) {
    //     var urlAux = window.location.toString();
    //     urlAux = urlAux.toUpperCase().replace('HTTP://TMDC1PORTALHOM', 'https://portaltmhom.termomecanica.com.br').toLowerCase();

    //     window.location = urlAux;
    // }

    // if (window.location.toString().toUpperCase().indexOf('TMDC1PORTALPRD') > 0) {
    //     var urlAux = window.location.toString();
    //     urlAux = urlAux.toUpperCase().replace('HTTP://TMDC1PORTALPRD', 'https://portaltm.termomecanica.com.br').toLowerCase();
    //     window.location = urlAux;
    // }
}

// (function ($) {


//     $(window).ready(function () {
//         BackToTop({
//             autoShowOffset: '200',
//             text: '<span class="glyphicon glyphicon-chevron-up btn-subir-pagina"></span>',
//             effectScroll: 'linear',
//             appearMethod: 'fade'
//         });
//         $('.menu a[data-toggle=collapse]').click(function () {
//             if (!$(this).parent().hasClass('active')) {
//                 $(this).parent().addClass('active');
//                 $(this).children('.open-collapse')
//                         .removeClass('icon-angle-down')
//                         .addClass('icon-angle-up');
//             } else {
//                 $(this).parent().removeClass('active');
//                 $(this).children('.open-collapse')
//                         .removeClass('icon-angle-up')
//                         .addClass('icon-angle-down');
//             }
//         });
//         $('#menu-comando').click(function () {

//             if ($('#conteudo').hasClass('full-width')) {
//                 localStorage.setItem('navegacaoOpened', true);
//                 $('.navegacao').fadeIn(500);
//                 $('#conteudo').removeClass('full-width');

//                 $("#container-principal").addClass('fix-reponsividade');

//                 //Ocultar scroll da página ao abrir menu - mantém somente scroll do menu
//                 $('body').addClass('no-scroll');

//                 if (isMobile()) {
//                     $("#BackToTop").hide();
//                     $("#SaveButtonPage").hide();
//                 }
//             } else {
//                 localStorage.setItem('navegacaoOpened', false);
//                 $('.navegacao').fadeOut(190);
//                 $('#conteudo').addClass('full-width');
//                 $('body').removeClass('no-scroll');
//                 $("#container-principal").removeClass('fix-reponsividade');

//                 if (isMobile()) {
//                     $("#BackToTop").show();
//                     $("#SaveButtonPage").show();
//                 }
//             }

//         });
//         $('[data-toggle=tooltip]').tooltip();
//     });
// })(jQuery);



function transformarArrayString(data) {
    var retorno = "";

    if (data == undefined) return retorno;

    for (var i = 0; i < data.length; i++) {
        if (retorno == "") {
            retorno = data[i];
        }
        else {
            retorno += '<br />' + data[i];
        }
    }
    if (!retorno) {
        retorno = '';
    }
    return retorno;
}

function extrairCampoLista(data, campo) {
    var retorno = "";

    if (data == undefined) return retorno;

    for (var i = 0; i < data.length; i++) {
        if (retorno == "") {
            retorno = recuperarValorPropriedade(data, i, campo);
        }
        else {
            retorno += '<br />' + recuperarValorPropriedade(data, i, campo);
        }
    }
    if (!retorno) {
        retorno = '';
    }
    return retorno;
}

/// <summary>
/// Transforma o conteúdo de um DTO em uma string HTML de múltiplas linhas
/// </summary>
/// <param name="data">Objeto DTO contendo os dados a serem exibidos</param>
/// <param name="campos">Objeto do tipo Array contendo os nomes dos campos do DTO a serem utilizados</param>
/// <param name="mascara">Objeto do tipo Array contendo as máscaras relativas a cada um dos itens a serem exibidos</param>
/// <returns>String com múltiplas linhas com os campos informados formatados conforme solicitado. Exemplo em: Estagio.AgenteIntegrador</returns>
function converterListaEmStringFormatada(data, campos, mascara) {
    var retorno = "";

    if (data == undefined || mascara == undefined || campos == undefined) return retorno;

    for (var i = 0; i < data.length; i++) {
        var valoresLinha = new Array();
        var mascaraLinha = "";
        for (var x = 0; x < campos.length; x++) {
            var campo = campos[x];
            if (recuperarValorPropriedade(data, i, campo) != '') {
                valoresLinha.push(recuperarValorPropriedade(data, i, campo));
                if (mascaraLinha != "")
                    mascaraLinha += ' ';

                mascaraLinha += mascara[x];
            }
            else
                valoresLinha.push('');
        }

        if (retorno != "")
            retorno += '<br />';

        retorno += formatarString(mascaraLinha, valoresLinha);
    }

    if (!retorno) {
        retorno = '';
    }
    return retorno;
}

/// <summary>
/// Função que equivale ao String.Format do .Net: Substitui os campos chaves ({0}, {1}, {2}, etc) pelos valores contidos no parametros "args"
/// </summary>
/// <param name="format">String a ser formatada</param>
/// <param name="Args">Conteúdo a ser utilizado na máscara informada</param>
function formatarString(format, args) {
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
    });
}

function recuperarValorPropriedade(data, indice, campo) {
    var valor;
    var subCampos = campo.split(".");
    for (var i = 0; i < subCampos.length; i++) {
        if (valor) {
            valor = valor[subCampos[i]];
        }
        else {
            valor = data[indice][subCampos[i]];
        }
    }
    if (!valor) {
        valor = "";
    }
    return valor;
}

function autocomplete(idLista, idCampo) {
    var lista = 'ul' + idLista + ' li';
    var listaItens = [];

    $(lista).each(function () {
        listaItens.push($(this).text().trim());
    });

    $(idCampo).autocomplete({
        minLength: 3,
        source: listaItens,
        delay: 200
    });
}

function mostrarLoading() {
   
    var $carregandoOverlay = $('<div>')
        .addClass("ui-widget-overlay-person")
        .addClass("overlay-carregando");

    var $loaderLogo = $('<div>')
        .addClass("TMloaderLogo")
        .addClass("center")
        .html("");

    var $loader = $('<div>')
        .addClass("TMloader")
        .html("");

    $loaderLogo.append($loader);

    $carregandoOverlay.append($loaderLogo);

    $('body').append($carregandoOverlay);
}

var loadingCount = 0;
var loadingLockedOut;

function setEventAfterComboReady(callback) {
    loadingLockedOut = callback;
}

function mostrarLoadingLocked() {
   
    loadingCount++;
    if (loadingCount == 1) {

        var $carregandoOverlay = $('<div>')
            .addClass("ui-widget-overlay-combo")
            .addClass("overlay-combo");

        var $loaderLogo = $('<div>')
            .addClass("TMloaderLogo")
            .addClass("center")
            .html("");

        var $loader = $('<div>')
            .addClass("TMloader")
            .html("");

        $loaderLogo.append($loader);

        $carregandoOverlay.append($loaderLogo);

        $('body').append($carregandoOverlay);

    }
}

function removerLoadingLocked() {
    loadingCount--;
    if (loadingCount == 0) {

        $(".overlay-combo").remove();
        $(".ui-widget-overlay-combo").remove();

        if (loadingLockedOut != undefined && loadingLockedOut != null) {
            loadingLockedOut();
            loadingLockedOut = null;
        }
    }
}

var contadorLoading = 0;

function controleLoading(x) {

    contadorLoading = x ? ++contadorLoading : --contadorLoading;
    
    if (contadorLoading == 0) {
        removerLoading();
    }
    else {
        removerLoading();
        mostrarLoading();
    }
}

function mostrarLoadingModal() {

   
    var $carregandoOverlay = $('<div>')
        .addClass("ui-widget-overlay-person-2")
        .addClass("overlay-modal");

    var $loaderLogo = $('<div>')
        .addClass("TMloaderLogo")
        .addClass("center")
        .html("");

    var $loader = $('<div>')
        .addClass("TMloader")
        .html("");

    $loaderLogo.append($loader);

    $carregandoOverlay.append($loaderLogo);

    $('body').append($carregandoOverlay);
}

function criarOverlay() {

    var $carregandoOverlay = $('<div>')
        .addClass("ui-widget-overlay-person-2")
        .addClass("overlay-carregando");

    var $loaderLogo = $('<div>')
        .addClass("TMloaderLogo")
        .addClass("center")
        .html("");

    var $loader = $('<div>')
        .addClass("TMloader")
        .html("");

    $loaderLogo.append($loader);

    $carregandoOverlay.append($loaderLogo);

    $('body').append($carregandoOverlay);
}


function removerOverlay() {
    $(".ui-widget-overlay-person-2").remove();
}

function validarLoading() {
    if (!isFormValido())
        return;

    mostrarLoading();
}

function removerLoading() {
   

    $(".overlay-carregando").remove();
    $(".ui-widget-overlay-person").remove();
}

function removerLoadingModal() {
   
    $(".overlay-modal").remove();
    $(".ui-widget-overlay-person-2").remove();
}

function criarEventosDePopup() {
    var msgErro = $("#hdnMsgErro").val();
    if (msgErro != null && msgErro != "") {
        mostrarErroPopup(msgErro);
        $("#hdnMsgErro").val("");
    }

    var msgSucesso = $("#hdnMsgSucesso").val();
    if (msgSucesso != null && msgSucesso != "") {
        mostrarSucessoPopup(msgSucesso);
        $("#hdnMsgSucesso").val("");
    }
}

function mostrarSucessoPopup(msg, beforeClose, parametroBeforeClose) {
    if (msg != null && msg != "") {
        $(".dialog-msg-sucesso").remove();

        var html = "<div id='dialog-msg-sucesso' class='dialog-msg-sucesso msgSucesso'>" +
                        "<div id='msg-sucesso'>" +
                            "<span class='control-label'>" + msg + "</span>" +
                        "</div>" +
                    "</div>";

        $("#renderbody").append(html);

        return $(".dialog-msg-sucesso").dialog({
            autoOpen: true,
            closeText: "",
            width: 466,
            resizable: false,
            modal: true,
            show: "puff",
            hide: "puff",
            title: 'Sucesso!',
            dialogClass: 'dialogSucesso',
            beforeClose: function (event, ui) {
                $(".overlay-carregando").remove();
                if (typeof beforeClose !== "undefined") {
                    if (parametroBeforeClose)
                        beforeClose(parametroBeforeClose);
                    else
                        beforeClose();
                }
                $(this).remove();
            }
        });
    }
}

function mostrarInfoPopup(msg, beforeClose) {
    if (msg != null && msg != "") {
        $(".dialog-msg-info").remove();

        var html = "<div id='dialog-msg-info' class='dialog-msg-info msgInfo'>" +
                        "<div id='msg-info'>" +
                            "<span class='control-label'>" + msg + "</span>" +
                        "</div>" +
                    "</div>";

        $("#renderbody").append(html);

        return $(".dialog-msg-info").dialog({
            autoOpen: true,
            closeText: "",
            width: 466,
            resizable: false,
            modal: true,
            show: "puff",
            hide: "puff",
            title: 'Informativo',
            dialogClass: 'dialogInfo',
            beforeClose: function (event, ui) {
                $(".overlay-carregando").remove();
                if (typeof beforeClose !== "undefined")
                    beforeClose();
                $(this).remove();
            }
        });
    }
}

function mostrarErroPopupComParametro(msg, beforeClose, parametro) {

    return mostrarErroPopupTituloParametro("Erro!", msg, beforeClose, parametro);
}

function mostrarErroPopupTituloParametro(Titulo, msg, beforeClose, parametro) {
    if (msg != null && msg != "") {
        $(".dialog-msg-erro").remove();

        var html = "<div id='dialog-msg-erro' class='dialog-msg-erro msgErro'>" +
                        "<div id='msg-erro'>" +
                            "<span class='control-label'>" + msg + "</span>" +
                        "</div>" +
                    "</div>";

        $("#renderbody").append(html);

        return $(".dialog-msg-erro").dialog({
            autoOpen: true,
            width: 466,
            resizable: false,
            modal: true,
            show: "puff",
            hide: "puff",
            title: Titulo,
            dialogClass: 'dialogErro',
            beforeClose: function (event, ui) {
                $(".overlay-carregando").remove();
                if (beforeClose != undefined) {
                    if (parametro)
                        beforeClose(parametro);
                    else
                        beforeClose();
                }
                $(this).remove();
            }
        });
    }
}

function mostrarAvisoPopup(msg, beforeClose, parametroBeforeClose) {

    if (msg != null && msg != "") {
        $(".dialog-msg-erro").remove();

        var html = "<div id='dialog-msg-erro' class='dialog-msg-erro msgErro'>" +
                        "<div id='msg-erro'>" +
                            "<span class='control-label'>" + msg + "</span>" +
                        "</div>" +
                    "</div>";

        $("#renderbody").append(html);

        return $(".dialog-msg-erro").dialog({
            autoOpen: true,
            closeText: "",
            width: 466,
            resizable: false,
            modal: true,
            show: "puff",
            hide: "puff",
            title: 'Aviso!',
            dialogClass: 'dialogErro',
            beforeClose: function (event, ui) {
                $(".overlay-carregando").remove();
                if (typeof beforeClose !== "undefined") {
                    if (parametroBeforeClose)
                        beforeClose(parametroBeforeClose);
                    else
                        beforeClose();
                }
                $(this).remove();
            }
        });
    }

}


function mostrarErroPopup(msg, beforeClose) {

    return mostrarErroPopupTitulo("Erro!", msg, beforeClose);
}


function mostrarErroPopupTitulo(Titulo, msg, beforeClose) {
    if (msg != null && msg != "") {
        $(".dialog-msg-erro").remove();

        var html = "<div id='dialog-msg-erro' class='dialog-msg-erro msgErro'>" +
                        "<div id='msg-erro'>" +
                            "<span class='control-label'>" + msg + "</span>" +
                        "</div>" +
                    "</div>";

        $("#renderbody").append(html);

        return $(".dialog-msg-erro").dialog({
            autoOpen: true,
            closeText: "",
            width: 466,
            resizable: false,
            modal: true,
            show: "puff",
            hide: "puff",
            title: Titulo,
            dialogClass: 'dialogErro',
            beforeClose: function (event, ui) {
                $(".overlay-carregando").remove();
                if (beforeClose != undefined)
                    beforeClose();

                $(this).remove();
            }
        });
    }
}


function mostrarNumeroClassificacao(msg) {
    if (msg != null && msg != "") {
        $(".dialog-msg-erro").remove();

        var html = "<div id='dialog-msg-erro' class='dialog-msg-erro msgErro'>" +
                        "<div id='msg-erro'>" +
                            "<span class='control-label align-center' style='font-size: 45px ;'>" + msg + "</span>" +
                        "</div>" +
                    "</div>";
        html += "<script> $(document).ready(function () {  $('.ui-dialog-titlebar').css('display', 'none');  });  </script>";
        $("#renderbody").append(html);

        setTimeout(function () { $(".dialog-msg-erro").dialog('close'); }, 500);

        return $(".dialog-msg-erro").dialog({
            autoOpen: true,
            closeText: "",
            width: 5,
            resizable: false,
            modal: true,
            show: "puff",
            hide: "puff",
            dialogClass: 'dialogErro',
        });


    }
}

/*
* Renderiza o Popup com efeitos de entrada e saída
*/
function montarModalComEfeito(IdDivComHashtag, calbackFunction, widthModal) {
    //habilitarDatePicker();
    if (widthModal)
        return $(IdDivComHashtag).dialog({
            autoOpen: true, show: "puff", hide: "puff",
            width: widthModal,
            open: function (event, ui) {
                //hide close button.
                $(this).parent().children().children('.ui-dialog-titlebar-close').attr('id', 'btn_close_modal');
                if (calbackFunction)
                    calbackFunction();
            },
        });
    else
        return $(IdDivComHashtag).dialog({
            autoOpen: true, show: "puff", hide: "puff",
            open: function (event, ui) {
                //hide close button.
                $(this).parent().children().children('.ui-dialog-titlebar-close').attr('id', 'btn_close_modal');
                if (calbackFunction)
                    calbackFunction();
            },
        });
}

function montarModalComEfeitoEClickBotaoClose(IdDivComHashtag, calbackFunctionClose, parametro) {
    return $(IdDivComHashtag).dialog({

        autoOpen: true, show: "puff", hide: "puff",
        open: function (event, ui) {
            //hide close button.
            $(this).parent().children().children('.ui-dialog-titlebar-close').click(function () {
                calbackFunctionClose(parametro);
            });
        },
    });
}

function mostrarWarningPopup(msg, beforeClose) {
    mostrarErroPopupTitulo("Aviso!", msg, beforeClose);
}

/*
* Cria uma caixa de dialógo com o botões Sim e Não com propagação do evento click quando pressiona Sim.
* Para ser utilizada com o botão submit do form.
*/
function criarDialog(idDialog, idConfirmar, idCancelar, idClick, msg) {
    var html = '<div id="' + idDialog + '">' +
                    '<p>' + msg + '</p>' +
                    '<div class="div-botao">' +
                        '<button class="btn btn-primary" id="' + idCancelar + '">' +
                            'N&atilde;o' +
                        '</button>' +
                        '<button class="btn btn-default" id="' + idConfirmar + '">' +
                            'Sim' +
                        '</button>' +
                    '</div>' +
                '</div>';

    $('#' + idDialog).remove();

    $("body").append(html);

    $('#' + idDialog).dialog({
        autoOpen: false, closeText: "",
        width: 466,
        modal: true,
        show: "puff",
        hide: "puff",
        title: 'Confirma',
        resizable: false,
        beforeClose: function (event, ui) {

            $(this).remove();
        }
    });

    $('#' + idConfirmar).click(function () {
        $('#' + idDialog).dialog('close');
        $('#' + idClick).unbind('click');
        $('#' + idClick).click();
    });

    $('#' + idCancelar).click(function () {
        $('#' + idDialog).dialog('close');
    });
}

function mensagemPopup(msg) {
    mostrarAvisoPopup(msg);
}

/*
* Cria uma caixa de dialógo com os botões Sim e Não e chama uma função quando termina a execução
*/

function criarDialogComCallback(idDialog, idConfirmar, idCancelar, callbackFunction, msg) {
    var html = '<div id="' + idDialog + '">' +
                    '<p>' + msg + '</p>' +
                    '<div class="div-botao">' +
                        '<button class="btn btn-default" id="' + idCancelar + '">' +
                            'N&atilde;o' +
                        '</button>' +
                        '<button class="btn btn-primary" id="' + idConfirmar + '">' +
                            'Sim' +
                        '</button>' +
                    '</div>' +
                '</div>';

    $('#' + idDialog).remove();

    $("body").append(html);

    $('#' + idDialog).dialog({
        autoOpen: false, closeText: "",
        width: 466,
        modal: true,
        show: "puff",
        hide: "puff",
        title: 'Confirma',
        resizable: false,
        beforeClose: function (event, ui) {

            $(this).remove();
        }
    });

    $('#' + idConfirmar).click(function () {
        $('#' + idDialog).dialog('close');
        callbackFunction();
    });

    $('#' + idCancelar).click(function () {
        $('#' + idDialog).dialog('close');
    });
}

function criarDialogComCallbackDuplo(idDialog, idConfirmar, idCancelar, callbackFunctionConfirmar, callbackFunctionCancelar, msg) {
    var html = '<div id="' + idDialog + '">' +
                    '<p>' + msg + '</p>' +
                    '<div class="div-botao">' +
                        '<button class="btn btn-default" id="' + idCancelar + '">' +
                            'N&atilde;o' +
                        '</button>' +
                        '<button class="btn btn-primary" id="' + idConfirmar + '">' +
                            'Sim' +
                        '</button>' +
                    '</div>' +
                '</div>';

    $('#' + idDialog).remove();

    $("body").append(html);

    $('#' + idDialog).dialog({
        autoOpen: false, closeText: "",
        width: 466,
        modal: true,
        show: "puff",
        hide: "puff",
        title: 'Confirma',
        resizable: false,
        beforeClose: function (event, ui) {

            $(this).remove();
        }
    });

    $('#' + idConfirmar).click(function () {
        $('#' + idDialog).dialog('close');
        callbackFunctionConfirmar();
    });

    $('#' + idCancelar).click(function () {
        $('#' + idDialog).dialog('close');
        callbackFunctionCancelar();
    });
}

function criarDialogComCallbackEParametro(idDialog, idConfirmar, idCancelar, callbackFunction, msg, parametro) {
    var html = '<div id="' + idDialog + '">' +
                    '<p>' + msg + '</p>' +
                    '<div class="div-botao">' +
                        '<button class="btn btn-default" id="' + idCancelar + '">' +
                            'N&atilde;o' +
                        '</button>' +
                        '<button class="btn btn-primary" id="' + idConfirmar + '">' +
                            'Sim' +
                        '</button>' +
                    '</div>' +
                '</div>';

    $('#' + idDialog).remove();

    $("body").append(html);

    $('#' + idDialog).dialog({
        autoOpen: false, closeText: "",
        width: 466,
        modal: true,
        show: "puff",
        hide: "puff",
        title: 'Confirma',
        resizable: false,
        beforeClose: function (event, ui) {

            $(this).remove();
        }
    });

    $('#' + idConfirmar).click(function () {
        $('#' + idDialog).dialog('close');
        callbackFunction(parametro);
    });

    $('#' + idCancelar).click(function () {
        $('#' + idDialog).dialog('close');
    });
}

function criarDialogComCallbackEParametro(idDialog, idConfirmar, idCancelar, callbackFunction, msg, parametroDaFuncaoCallBack) {

    var html = '<div id="' + idDialog + '">' +
                    '<p>' + msg + '</p>' +
                    '<div class="div-botao">' +
                        '<button class="btn btn-default" id="' + idCancelar + '">' +
                            'N&atilde;o' +
                        '</button>' +
                        '<button class="btn btn-primary" id="' + idConfirmar + '">' +
                            'Sim' +
                        '</button>' +
                    '</div>' +
                '</div>';

    $('#' + idDialog).remove();

    $("body").append(html);

    $('#' + idDialog).dialog({
        autoOpen: false, closeText: "",
        width: 466,
        modal: true,
        show: "puff",
        hide: "puff",
        title: 'Confirma',
        resizable: false,
        beforeClose: function (event, ui) {

            $(this).remove();
        }
    });

    $('#' + idConfirmar).click(function () {
        $('#' + idDialog).dialog('close');
        callbackFunction(parametroDaFuncaoCallBack);
    });

    $('#' + idCancelar).click(function () {
        $('#' + idDialog).dialog('close');
    });
}

function abrirModalSelecaoEmail(callback) {
    mostrarLoading();
    $.ajax({
        method: 'POST',
        url: base_path + 'Email/GetModalSelecao',
        cache: false
    })
    .done(function (data) {

        adicionarHtmlPopup('popup_selecao_email', 'form_selecao_email', 'Seleção de E-mail');

        $("#form_selecao_email").html(data);

        montarModalComEfeito('#form_selecao_email').on("dialogclose", function (event, ui) {
            $('#form_selecao_email').remove();
            removerLoading();
        });

        funcaoCallback = callback;
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
        mostrarErroPopup('Problemas ao carregar o modal de selecao de email. ' + errorThrown);
    });
}

function abrirModalSelecaoEmailParaModal(callback, idModalOrigem) {
    mostrarLoadingModal();
    $.ajax({
        method: 'POST',
        url: base_path + 'Email/GetModalSelecao',
        cache: false
    })
    .done(function (data) {

        adicionarHtmlPopup('popup_selecao_email', 'form_selecao_email', 'Seleção de E-mail');

        $("#form_selecao_email").html(data);

        montarModalComEfeito('#form_selecao_email').on("dialogbeforeclose", function (event, ui) {
            $('#form_selecao_email').remove();
            $(idModalOrigem).dialog('open');
            removerLoadingModal();
            return false;
        });

        funcaoCallback = callback;
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
        mostrarErroPopup('Problemas ao carregar o modal de selecao de email. ' + errorThrown);
    });
}

function abrirModalSelecaoUsuarioAtivo(callback) {
    mostrarLoadingModal();
    $.ajax({
        method: 'POST',
        url: base_path + 'Usuario/GetModalPesquisaUsuariosFuncionariosAtivos',
        cache: false
    })
    .done(function (data) {

        adicionarHtmlPopup('popup_selecao_usuario', 'form_selecao_usuario', 'Seleção de Usuários');

        $("#form_selecao_usuario").html(data);

        montarModalComEfeito('#form_selecao_usuario', null, 1200).on("dialogclose", function (event, ui) {
            $('#form_selecao_usuario').remove();
            removerLoadingModal();
        });

        funcaoCallback = callback;
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
        mostrarErroPopup('Problemas ao carregar o modal de selecao de usuários. ' + errorThrown);
    });
}

function abrirModalSelecaoUsuarioAtivoParaModal(callback, idModalOrigem) {
    mostrarLoadingModal();
    $.ajax({
        method: 'POST',
        url: base_path + 'Usuario/GetModalPesquisaUsuariosFuncionariosAtivos',
        cache: false
    })
    .done(function (data) {

        adicionarHtmlPopup('popup_selecao_usuario', 'form_selecao_usuario', 'Seleção de Usuários');

        $("#form_selecao_usuario").html(data);

        montarModalComEfeito('#form_selecao_usuario', null, 1200).on("dialogbeforeclose", function (event, ui) {
            $('#form_selecao_usuario').remove();
            removerLoadingModal();

            $(idModalOrigem).dialog('open');
            return false;
        });

        funcaoCallback = callback;
    })
    .fail(function (XMLHttpRequest, textStatus, errorThrown) {
        mostrarErroPopup('Problemas ao carregar o modal de selecao de usuários. ' + errorThrown);
    });
}


function montarImagemArquivo(arquivoFoto, idDivImagem, largura, altura) {
    largura = largura || 100;
    altura = altura || 100;
    if (arquivoFoto == null) {
        montarImagem(null, null, idDivImagem, largura, altura);
    } else {
        montarImagem(arquivoFoto.Extensao, arquivoFoto.ConteudoBase64, idDivImagem, largura, altura);
    }
}

function montarImagem(extensao, conteudoBase64, idDivImagem, width, height, classeOpcional, styleOpcional) {

    var _styleOpcional = (typeof styleOpcional !== 'undefined' && styleOpcional !== null ? styleOpcional : "");
    var _classeOpcional = (typeof classeOpcional !== 'undefined' && classeOpcional !== null ? classeOpcional : "");
    var _width = (typeof width !== 'undefined' && width !== null ? "width:" + width + "px;" : "");
    var _height = (typeof height !== 'undefined' && height !== null ? "height:" + height + "px;" : "");

    var elemento;
    if ((extensao != null && extensao != "") && (conteudoBase64 != null && conteudoBase64 != "")) {
        elemento = "<div class='moldura " + _classeOpcional + "' style='background-image: url(data:image/" + extensao + ";base64," + conteudoBase64 + "); " + _width + _height + _styleOpcional + "'></div>";
    }
    else {
        elemento = "<div class='moldura " + _classeOpcional + "' style='background-image: url(" + fotoGenerica + "); " + _width + _height + _styleOpcional + ";background-position: 50% 0px;'></div>";
    }

    $(idDivImagem).empty();
    $(idDivImagem).append(elemento);
}

function montarImagemGenerica(idDivImagem, largura, altura, caminhoImagem) {

    var width = (largura !== null ? "width:" + largura + "px;" : "");
    var height = (altura !== null ? "height:" + altura + "px;" : "");

    var elemento = "<div class='moldura' style='background-image: url(" + +base_path + caminhoImagem + + "); " + width + height + "'></div>";

    $(idDivImagem).empty();
    $(idDivImagem).append(elemento);
}

function montarImagemClasse(extensao, conteudoBase64, idDivImagem, classeCss, usarCameraGenerica) {
    var imagem = document.createElement("img");
    imagem.alt = 'Imagem';
    imagem.id = 'foto_imagem'

    $(imagem).addClass(classeCss);

    if ((extensao != null && extensao != "") && (conteudoBase64 != null && conteudoBase64 != "")) {
        imagem.src = "data:image/" + extensao + "; base64," + conteudoBase64;
    }
    else {
        if (usarCameraGenerica)
            imagem.src = fotoCameraGenerica;
        else
            imagem.src = fotoGenerica;
    }

    $(idDivImagem).empty();
    $(idDivImagem).append(imagem);
}

/*
* Cria duas divs e adiciona este html em uma div do Layout Padrão
* Parametros: idDivPopup - nome do id da div do Popup que será criada entre aspas simples ' sem o sustenido '#'
*               idDivForm - nome do id da div do Formulário que será criada entre aspas simples ' sem o sustenido '#'
*               titulo - Titulo do formulário
*/
function adicionarHtmlPopup(idDivPopup, idDivForm, titulo) {
    var popup = '#' + idDivPopup;
    var form = '#' + idDivForm;

    var html = "<div id=" + "'" + idDivPopup + "'" + ">" +
                    "<div id=" + "'" + idDivForm + "'" + " title=" + "'" + titulo + "'" + " style='display:none;'></div>" +
                "</div>";

    $(popup).remove();

    $("#renderbody").append(html);

    bindEventos(popup, form);

    return $(popup);
}

function adicionarHtmlPopupTitleBar(idDivPopup, idDivForm, titulo) {
    var popup = '#' + idDivPopup;
    var form = '#' + idDivForm;

    var html = "<div id=" + "'" + idDivPopup + "'" + ">" +
                    "<div id=" + "'" + idDivForm + "'" + " title=" + "'" + titulo + "'" + " style='display:none;background-color: #666666;color:white;margin-top:0px;'></div>" +
                "</div>";

    $(popup).remove();

    $("#renderbody").append(html);

    bindEventos(popup, form);

    return $(popup);
}

/*
* Abre o dialógo do Jquery UI
* Parametros: idDivPopup - nome do id da div do Popup que será criada entre aspas duplas ' com o sustenido '#'
*               idDivForm - nome do id da div do Formulário que será criada entre aspas duplas ' com o sustenido '#'
*/
function bindEventos(idDivPopup, idDivForm) {
    $(idDivForm).dialog({
        autoOpen: false, closeText: "",
        width: 960,
        modal: true,

        open: function () {
            $(".ui-widget-overlay").appendTo(idDivPopup);
            $(this).dialog("widget").appendTo(idDivPopup);
        },
        close: function () {
            $(".ui-widget-overlay").remove();
            $(idDivForm).dialog("close");
        }
    });
}

function htmlEncode(valor) {
    return $('<div/>').text(valor).html();
}

function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

    var form = $(document.createElement("form"))
        .attr({
            "method": method, "action": path
        });

    $.each(params, function (key, value) {
        $.each(value instanceof Array ? value : [value], function (i, val) {
            $(document.createElement("input"))
                .attr({
                    "type": "hidden", "name": key, "value": val
                })
                .appendTo(form);
        });
    });

    form.appendTo(document.body).submit();
}

function getQueryString(variavel) {
    var variaveis = location.search.replace(/\x3F/, "").replace(/\x2B/g, " ").split("&")
    var nvar
    if (variaveis != "") {
        var qs = []
        for (var i = 0; i < variaveis.length; i++) {
            nvar = variaveis[i].split("=")
            qs[nvar[0]] = unescape(nvar[1])
        }
        return qs[variavel]
    }
    return null
}

// Validates that the input string is a valid date formatted as "dd/mm/yyyy"
function isValidDateInString(dateString) {
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

function isDataValida(data) {
    return moment(data, ["DD-MM-YYYY"]).isValid()
}

function isDataJavascript(data) {

    if (!data)
        return false;

    if (data.indexOf('Date') > 0)
        return true;
    else
        return false;
}

function converterDataJavascript(data) {
    //return new Date(parseInt(data.replace("/Date(", "").replace(")/", "")))
    if (data) {
        try {
            if (isDataJavascript(data))
                return moment(data).format("DD/MM/YYYY");
        }
        catch (error) {
            try {
                var dateFormatada = moment(data).format("DD/MM/YYYY");
                return dateFormatada;
            }
            catch (error) {

            }
        }

        return moment(data).format("DD/MM/YYYY");
    }
    else
        return '';
}


function stringToDate(_date, _format, _delimiter) {

    _format = _format ? _format : "dd/mm/yyyy";
    _delimiter = _delimiter ? _delimiter : "/";

    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}

function transformarMesesEmDias(meses) {

    if (meses * 30.436875 != 0) {
        return meses * 30.436875;
    } else
        return 0;

}

/// <summary>
/// Retorna a quantidade de meses entre as duas datas informadas
/// </summary>
function mesesNoPeriodo(dataInicio, dataFim) {

    var meses = dataFim.getMonth() - dataInicio.getMonth() + (12 * (dataFim.getFullYear() - dataInicio.getFullYear()));

    return meses;
}

function limparTodosCampos(elemento) {
    $(elemento).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
}

function validarEmail(email) {
    var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (email == undefined || email == '') {
        return false;
    }
    else if (!emailRegex.test(email)) {
        return false;
    }
    else
        return true;
}

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

// //$(function () {
//     $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
//     $.datepicker._updateDatepicker = function (inst) {
//         $.datepicker._updateDatepicker_original(inst);
//         var afterShow = this._get(inst, 'afterShow');
//         if (afterShow)
//             afterShow.apply((inst.input ? inst.input[0] : null));  // trigger custom callback
//     }
// });

function listarItemsSelecionados(lista) {
    return ($.grep(lista, function (element, index) {
        return element.Selecionado == true;
    }));
}

function removeFormatacaoDinheiro(valorFormatado) {

    valorFormatado = String(valorFormatado);

    valorFormatado = valorFormatado.replace("R$", "");

    var valorSemFormatacao;

    //se o valor não tiver centavos, converter o mesmo para float.
    if (valorFormatado.substr(valorFormatado.length - 2, 2) == "00") {
        if ((valorFormatado.split(",").length - 1) == 0 && (valorFormatado.split(".").length - 1) == 0)
            valorSemFormatacao = valorFormatado
        else
            valorSemFormatacao = parseFloat(valorFormatado.substr(0, valorFormatado.length - 3)
                .replace(".", "").replace(",", ""));
    }
    else {
        if ((valorFormatado.split(",").length - 1) == 1)
            valorSemFormatacao = valorFormatado.replace(".", "");
        else
            valorSemFormatacao = valorFormatado.replace(".", ",");
    }
    return valorSemFormatacao;
}

function validarEmail(email) {

    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(email)) {
        mostrarAvisoPopup('Formato do e-mail inv&aacute;lido.');
        return false;
    }
    return true;
}

function isMobile() {
    return $(window).width() < 979;
}

function isMobileMini() {
    return $(window).width() < 768;
}

function isMobileBrowser() {

    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;

}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito 
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito 
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

function scrollToBotton() {
    window.scrollTo(0, document.body.scrollHeight);
}

(function ($) {
    if ($.fn.style) {
        return;
    }

    // Escape regex chars with \
    var escape = function (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    // For those who need them (< IE 9), add support for CSS functions
    var isStyleFuncSupported = !!CSSStyleDeclaration.prototype.getPropertyValue;
    if (!isStyleFuncSupported) {
        CSSStyleDeclaration.prototype.getPropertyValue = function (a) {
            return this.getAttribute(a);
        };
        CSSStyleDeclaration.prototype.setProperty = function (styleName, value, priority) {
            this.setAttribute(styleName, value);
            var priority = typeof priority != 'undefined' ? priority : '';
            if (priority != '') {
                // Add priority manually
                var rule = new RegExp(escape(styleName) + '\\s*:\\s*' + escape(value) +
                    '(\\s*;)?', 'gmi');
                this.cssText =
                    this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
            }
        };
        CSSStyleDeclaration.prototype.removeProperty = function (a) {
            return this.removeAttribute(a);
        };
        CSSStyleDeclaration.prototype.getPropertyPriority = function (styleName) {
            var rule = new RegExp(escape(styleName) + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?',
                'gmi');
            return rule.test(this.cssText) ? 'important' : '';
        }
    }

    // The style function
    $.fn.style = function (styleName, value, priority) {
        // DOM node
        var node = this.get(0);
        // Ensure we have a DOM node
        if (typeof node == 'undefined') {
            return this;
        }
        // CSSStyleDeclaration
        var style = this.get(0).style;
        // Getter/Setter
        if (typeof styleName != 'undefined') {
            if (typeof value != 'undefined') {
                // Set style property
                priority = typeof priority != 'undefined' ? priority : '';
                style.setProperty(styleName, value, priority);
                return this;
            } else {
                // Get style property
                return style.getPropertyValue(styleName);
            }
        } else {
            // Get CSSStyleDeclaration
            return style;
        }
    };
})(jQuery);

var fotoPessoa = function () {

    var getModalFotoPessoa = function (foto) {
        $.ajax({
            method: 'POST',
            url: base_path + 'Pessoa/AbrirPesquisarFotoPessoaModal',
            cache: false
        })
           .done(function (data) {
               montarModalFotoPessoa(data, foto);
           })
           .fail(function (XMLHttpRequest, textStatus, errorThrown) {
               mostrarErroPopup('Problemas ao carregar o modal de fotos. ' + errorThrown);
           });
    }

    var montarModalFotoPessoa = function (html, foto) {

        adicionarHtmlPopup('popup_foto', 'form_foto', '');
        $("#form_foto").html(html);

        $('#form_foto').dialog({
            autoOpen: true,
            show: "explode",
            hide: "explode",
            width: "250",
            open: function (event, ui) {
                $(this).parent().children().children('.ui-dialog-titlebar-close').attr('id', 'btn_close_modal');
            },
        });

        montarImagem(foto.Extensao, foto.ConteudoBase64, "#insert-image", "200", "200")
    }

    var fecharModal = function () {
        $('#form_foto').dialog('close');
    };

    var abrirFotoPessoaPorIdPessoa = function (idPessoa) {

        $.ajax({
            type: "POST",
            url: base_path + "Pessoa/GetFotoPorIdPessoa",
            data: {
                'idPessoa': idPessoa
            },
            cache: false
        })
        .done(function (data) {
            if (data.dto)
                getModalFotoPessoa(data.dto);
            else
                mostrarAvisoPopup('Foto não encontrada!');
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) {

            mostrarErroPopup("Falha ao carregar a foto da pessoa. " + errorThrown);
        });
    }

    return {
        abrirFotoPessoaPorIdPessoa: abrirFotoPessoaPorIdPessoa,
        fecharModal: fecharModal
    }

}();

function textEditor(idTextArea, param) {
    //utilizar script ckeditor/ckeditor.js

    var instancia = CKEDITOR;

    instancia.config.allowedContent = true;

    var intc = instancia.instances[idTextArea];
    if (intc) {
        instancia.remove(intc);
    }

    var editor;
    if (param !== undefined && param != null)
        editor = instancia.replace(idTextArea, param);
    else
        editor = instancia.replace(idTextArea);

    return editor;
}

var dadosBancarios = function () {

    var dtoBanco = {};

    var controles = function () {
        return {
            ddlTgBanco: "#IdTgBanco",
            txtAgencia: "#Agencia",
            txtAgenciaDigito: "#AgenciaDigito",
            ddlTgTipoContaBancaria: "#IdTgTipoContaBancaria",
            txtConta: "#Conta",
            txtContaDigito: "#ContaDigito",
            form_dados_bancarios: "#form_dados_bancarios",
            ckbOrdemPagamento: "#OrdemPagamento",
            ckbContaPreferencial: "#ContaPreferencial"
        }
    }

    var getModal = function (callback) {

        mostrarLoading();
        $.ajax({
            method: 'POST',
            url: base_path + 'Banco/GetModalBanco',
            cache: false
        })
        .done(function (data) {
            montarModal(data, callback);
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar o modal de cadastro de dados bancários. ' + errorThrown);
        });
    }

    var montarModal = function (html, callback) {

        adicionarHtmlPopup('popup_dados_bancarios', 'form_dados_bancarios', 'Dados Bancários');

        $(controles().form_dados_bancarios).html(html);

        //fechar o modal dentro da função callback, a fim de realizar validações sem fechar o modal
        montarModalComEfeito(controles().form_dados_bancarios).on("dialogbeforeclose", function (event, ui) {
            try {
                callback(dtoBanco, controles().form_dados_bancarios);
            }
            catch (e) {
                cancelar();
            }
        });
    }

    var preencheDtoCadastro = function () {

        dtoBanco = {
            TgBanco: {
                Id: $(controles().ddlTgBanco + " :selected").val(),
                Descricao: $(controles().ddlTgBanco + " :selected").text()
            },
            Agencia: $(controles().txtAgencia).val(),
            AgenciaDigito: $(controles().txtAgenciaDigito).val(),
            TgTipoContaBancaria: {
                Id: $(controles().ddlTgTipoContaBancaria + " :selected").val(),
                Descricao: $(controles().ddlTgTipoContaBancaria + " :selected").text()
            },
            Conta: $(controles().txtConta).val(),
            ContaDigito: $(controles().txtContaDigito).val(),
            OrdemPagamento: $(controles().ckbOrdemPagamento).prop('checked'),
            ContaPreferencial: $(controles().ckbContaPreferencial).prop('checked')
        };
    }

    var salvar = function () {

        if (isFormValidoPopup('form_dados_bancarios', 'mensagem-validacao-obg-modal', false)) {
            preencheDtoCadastro();

            $(controles().form_dados_bancarios).dialog('close');
        }
    }

    var cancelar = function () {
        dtoBanco = null;
        $(controles().form_dados_bancarios).remove();
        removerLoading();
    }

    return {
        getModal: getModal,
        cancelar: cancelar,
        salvar: salvar
    }

}();

function downloadArquivoBase64(arquivoDto) {
    if (arquivoDto) {
        if (detectIE()) {
            var image_data = atob(arquivoDto.ConteudoBase64);

            var arraybuffer = new ArrayBuffer(image_data.length);
            var view = new Uint8Array(arraybuffer);
            for (var i = 0; i < image_data.length; i++) {
                view[i] = image_data.charCodeAt(i) & 0xff;
            }
            var bb = new (window.MSBlobBuilder);
            bb.append(arraybuffer);
            var blob = bb.getBlob(arquivoDto.ContentType);
            window.navigator.msSaveOrOpenBlob(blob, arquivoDto.Nome);
        }
        else {

            var blob = b64toBlob(arquivoDto.ConteudoBase64, arquivoDto.ContentType);
            var blobUrl = URL.createObjectURL(blob);

            //Para abrir diretamente no browser (não funciona com todos os tipos de arquivo)
            // window.open(blobUrl);

            //Para sempre fazer download
            var link = document.createElement('a');
            link.href = blobUrl;
            link.target = "_blank";
            link.setAttribute('download', arquivoDto.Nome);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

var dadosItemTabelaGeral = function () {
    var callback;

    var controles = function () {
        return {
            txtDescricao: "#ItemDto_Descricao",
            hdfTabelaSuperior: "#hdfTabelaSuperior",
            hdfSiglaSuperior: "#hdfSiglaSuperior",
            form_dados_item_tabela_geral: "#form_dados_item_tabela_geral"
        }
    }

    var getModal = function (tabela, modalCallback, modalIdform, tabelaSuperior, siglaSuperior) {

        callback = modalCallback;

        mostrarLoading();
        $.ajax({
            method: 'POST',
            url: base_path + 'TabelaGeral/GetModalItemTabelaGeral?Tabela=' + tabela,
            cache: false
        })
        .done(function (data) {
            montarModal(data, tabelaSuperior, siglaSuperior);
        })
        .fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar o modal de cadastro de item tabela geral. ' + errorThrown);
        });
    }

    var montarModal = function (html, tabelaSuperior, siglaSuperior) {

        adicionarHtmlPopup('popup_dados_item_tabela_geral', 'form_dados_item_tabela_geral', 'Dados Item Tabela Geral');

        $(controles().form_dados_item_tabela_geral).html(html);

        //fechar o modal dentro da função callback, a fim de realizar validações sem fechar o modal
        montarModalComEfeito(controles().form_dados_item_tabela_geral).on("dialogbeforeclose", function (event, ui) {
            $(controles().form_dados_item_tabela_geral).remove();
            removerLoading();
        });


        if (tabelaSuperior)
            $(controles().hdfTabelaSuperior).val(tabelaSuperior);

        if (siglaSuperior)
            $(controles().hdfSiglaSuperior).val(siglaSuperior);
    }

    var getDtoCadastro = function () {

        $ItemTabelaGeral.Descricao = $(controles().txtDescricao).val();
        $ItemTabelaGeral.SiglaSuperior = $(controles().hdfSiglaSuperior).val() ? $(controles().hdfSiglaSuperior).val() : "";
        $ItemTabelaGeral.TabelaSuperior = $(controles().hdfTabelaSuperior).val() ? $(controles().hdfTabelaSuperior).val() : "";

        return $ItemTabelaGeral;
    }

    var salvar = function () {

        if (isFormValidoPopup(controles().form_dados_item_tabela_geral.replace("#", ""), 'mensagem-validacao-obg-modal', false)) {

            $.ajax({
                type: "POST",
                url: base_path + "TabelaGeral/SalvarItemTabelaGeralDescricao",
                data: {
                    'dto': getDtoCadastro()
                },
                cache: false,
                complete: function (XMLHttpRequest, textStatus) {

                    //$(controles().form_dados_item_tabela_geral).dialog('close');
                    $(controles().form_dados_item_tabela_geral).remove();
                    removerLoading();
                }
            }).done(function (data) {

                if (data.dto) {
                    $ItemTabelaGeral = data.dto;
                    callback($ItemTabelaGeral);
                }
                else {
                    mostrarAvisoPopup(data.Mensagem);
                }

            }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
                mostrarErroPopup('Problemas ao salvar novo item na tabela geral. ' + errorThrown);

                removerLoading();
            });
        }
    }

    var cancelar = function () {
        $ItemTabelaGeral = null;
        $(controles().form_dados_item_tabela_geral).remove();
        removerLoading();
    }

    return {
        getModal: getModal,
        cancelar: cancelar,
        salvar: salvar
    }
}();

//Se for concomitante retorna true
var HorarioConcomitanteHelper = function () {

    /// <summary>
    /// Verifica se a hora de inicio que esta sendo cadastrada é igual a hora de termino de algum outro horario ja cadastrado
    /// </summary>
    /// <param name="horIni2"></param>
    /// <param name="HoraTermino1"></param>
    /// <returns></returns>
    var ValidaHorarioTerminoIgualHorarioInicio = function (horIni2, HoraTermino1) {
        if (horIni2.getTime() == HoraTermino1.getTime())
            return true;
        else
            return false;
    }

    /// <summary>
    /// Verifica se a hora de término que esta sendo cadastrada é igual a hora de inicio de algum outro horario ja cadastrado
    /// </summary>
    /// <param name="horIni2"></param>
    /// <param name="HoraTermino1"></param>
    /// <returns></returns>
    var ValidaHorarioInicioIgualHorarioTermino = function (horIni1, HoraTermino2) {
        if (horIni1.getTime() == HoraTermino2.getTime())
            return true;
        else
            return false;
    }

    var ValidaHorarioExatamenteIgual = function (horIni1, horIni2, HoraTermino1, HoraTermino2) {
        if (horIni1.getTime() == horIni2.getTime() && HoraTermino1.getTime() == HoraTermino2.getTime())
            return true;
        else
            return false;
    }

    var addMinutes = function (date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    var substractMinutes = function (date, minutes) {
        return new Date(date.getTime() - minutes * 60000);
    }

    var ValidaHorarioConcomitante = function (horIni1, horIni2, HoraTermino1, HoraTermino2) {

        if (ValidaHorarioTerminoIgualHorarioInicio(horIni2, HoraTermino1) || ValidaHorarioInicioIgualHorarioTermino(horIni1, HoraTermino2)) {
            //Nunca os dois serão true, então o if e else
            if (ValidaHorarioTerminoIgualHorarioInicio(horIni2, HoraTermino1)) {
                return (
                            (horIni1 >= horIni2
                            &&
                             horIni1 <= HoraTermino2)
                          ||

                            (HoraTermino1 >= (addMinutes(horIni2, 1))
                             &&
                             HoraTermino1 <= HoraTermino2)

                         );
            }
            else {
                return (
                          (horIni1 >= horIni2
                          &&
                           horIni1 <= (substractMinutes(HoraTermino2, 1)))
                          ||

                          (HoraTermino1 >= horIni2
                           &&
                           HoraTermino1 <= HoraTermino2)

                       );
            }
        }
        else {
            ///Se for true ValidaHorarioExatamenteIgual
            return (
                      (horIni1 >= horIni2
                      &&
                       horIni1 <= HoraTermino2)
                    ||

                      (HoraTermino1 >= horIni2
                       &&
                       HoraTermino1 <= HoraTermino2)
                   );
        }
    }

    var ValidaHorarioConcomitanteInverso = function (horIni1, horIni2, HoraTermino1, HoraTermino2) {
        if (ValidaHorarioTerminoIgualHorarioInicio(horIni1, HoraTermino2) || ValidaHorarioInicioIgualHorarioTermino(horIni2, HoraTermino1)) {
            //Nunca os dois serão true, então o if e else
            if (ValidaHorarioTerminoIgualHorarioInicio(horIni1, HoraTermino2)) {
                return (
                            (horIni2 >= horIni1
                            &&
                             horIni2 <= HoraTermino1)
                          ||

                            (HoraTermino2 >= (addMinutes(horIni1, 1))
                             &&
                             HoraTermino2 <= HoraTermino1)

                         );
            }
            else {
                return (
                          (horIni2 >= horIni1
                          &&
                           horIni2 <= (substractMinutes(HoraTermino1, 1)))
                        ||

                          (HoraTermino2 >= horIni1
                           &&
                           HoraTermino2 <= HoraTermino1)
                       );
            }
        }
        else {
            ///Se for true ValidaHorarioExatamenteIgual
            return (
                      (horIni2 >= horIni1
                      &&
                       horIni2 <= HoraTermino1)
                    ||

                      (HoraTermino2 >= horIni1
                       &&
                       HoraTermino2 <= HoraTermino1)
                   );
        }
    }

    ///ao chamar esta função, validar antes se os horários são válidos FORMATO HH:MM
    var ValidarHorariosConcomitantes = function (horIni1, horIni2, HoraTermino1, HoraTermino2) {

        //data qualquer
        var year = '2016';
        var month = '01';
        var day = '01';

        var partsInicio1 = horIni1.split(':');
        var hourInicio1 = partsInicio1[0];
        var minInicio1 = partsInicio1[1];

        var partsInicio2 = horIni2.split(':');
        var hourInicio2 = partsInicio2[0];
        var minInicio2 = partsInicio2[1];

        var partsTermino1 = HoraTermino1.split(':');
        var hourTermino1 = partsTermino1[0];
        var minTermino1 = partsTermino1[1];

        var partsTermino2 = HoraTermino2.split(':');
        var hourTermino2 = partsTermino2[0];
        var minTermino2 = partsTermino2[1];

        var dataInicio1 = new Date(year, month, day, hourInicio1, minInicio1);
        var dataInicio2 = new Date(year, month, day, hourInicio2, minInicio2);

        var dataTermino1 = new Date(year, month, day, hourTermino1, minTermino1);
        var dataTermino2 = new Date(year, month, day, hourTermino2, minTermino2);

        if (ValidaHorarioExatamenteIgual(dataInicio1, dataInicio2, dataTermino1, dataTermino2))
            return true;
        else
            return ValidaHorarioConcomitante(dataInicio1, dataInicio2, dataTermino1, dataTermino2)
                   ||
                   ValidaHorarioConcomitanteInverso(dataInicio1, dataInicio2, dataTermino1, dataTermino2);
    }

    return {
        ValidarHorariosConcomitantes: ValidarHorariosConcomitantes
    }
}();

function abrirPesquisarGenerico(callback, parametros, url, idDivPopup, idForm, tituloModal, beforeDialogClose) {
    funcaoCallback = callback;
    mostrarLoading();
    var popup = adicionarHtmlPopup(idDivPopup, idForm, tituloModal);
    $.ajax({
        type: "GET",
        url: base_path + url,
        cache: false,
        dataType: 'html',
        data: parametros,
        error: function (XMLHttpRequest, textStatus, errorThrown) {

            $("#" + idForm).html(errorThrown);
        },
        success: function (data, textStatus, XMLHttpRequest) {

            if (data == "desconectado" || data == '"desconectado"') {
                $('#' + idForm).dialog("close");
                location.reload(true);
                return true;
            }

            $("#" + idForm).html(data);
        },
        complete: function (XMLHttpRequest, textStatus) {

            removerLoading();
            if (typeof beforeDialogClose !== "undefined" && beforeDialogClose !== null) {
                montarModalComEfeito('#' + idForm).on("dialogbeforeclose", function (event, ui) {
                    $('#' + idForm).remove();
                    beforeDialogClose(event, ui);
                });
            }
            else {
                montarModalComEfeito('#' + idForm).on("dialogbeforeclose", function (event, ui) {
                    $('#' + idForm).remove();
                });
            }
            return popup;
        }
    });
}

//Valida campo de horas, até 23:59
function validaCampo24Horas(inputField) {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($(inputField).val());

    return isValid;
}

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

//query string
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
	    negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};


//Função para ordenação simples de um Json
function sortJSON(data, key) {
    return data.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

Number.prototype.numberFormat = function (decimals, dec_point, thousands_sep) {
    dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
    thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

    var parts = this.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

    return parts.join(dec_point);
}

function clonarObjeto(objetoAntigo) {
    return $.extend(true, {}, objetoAntigo);
}


function getDataAtualInString() {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}

function abrirPesquisarFuncionario(callback, idform) {
    isBtnClick = true;
    abrirPesquisarFuncionarioGeral(callback, base_path + "Pessoa/GetModalSelecaoFuncionario", idform);
}

function abrirPesquisarFuncionarioGeral(callback, url, idform) {
    funcaoCallback = callback;
    mostrarLoadingModal();
    adicionarHtmlPopup('popup-pesquisar-funcionario-form', 'form_selecao_funcionario', 'Pesquisar Funcionários Ativos');

    $.ajax({
        type: "GET",
        url: url,
        cache: false,
        dataType: 'html',
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $("#form_selecao_funcionario").html(XMLHttpRequest.responseText);
        },
        success: function (data, textStatus, XMLHttpRequest) {
            if (data == "desconectado" || data == '"desconectado"') {
                $('#form_selecao_funcionario').dialog("close");
                location.reload(true);
                return true;
            }

            $("#form_selecao_funcionario").html(data);
        },
        complete: function (XMLHttpRequest, textStatus) {
            removerLoadingModal();
            montarModalComEfeito('#form_selecao_funcionario').on("dialogbeforeclose", function (event, ui) {
                $('#form_selecao_funcionario').remove();
                if (idform != undefined) {
                    // $(idform).dialog("createOverlay");
                    return false;
                }
            });
        }
    });
}

$.maxZIndex = $.fn.maxZIndex = function (opt) {
    var def = { inc: 10, group: "*" };
    $.extend(def, opt);
    var zmax = 0;
    $(def.group).each(function () {
        var cur = parseInt($(this).css('z-index'));
        zmax = cur > zmax ? cur : zmax;
    });
    if (!this.jquery)
        return zmax;

    return this.each(function () {
        zmax += def.inc;
        $(this).css("z-index", zmax);
    });
}

function temModalAberto() {
    return $('.ui-dialog-content').length > 0;
}

var auditoriaRegistroIndividual = function () {

    var controles = function () {
        return {
            divTabelaResultado: "#divTabelaResultado"
        };
    }

    var pesquisar = function (tabela, campo, valor) {
        isBtnClick = true;
        $.ajax({
            type: "POST",
            url: base_path + "AuditoriaPortal/GetModalAuditoria",
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            pesquisarHistoricoRegistro(data, tabela, campo, valor);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar a pesquisa de Tabela. ' + errorThrown);
        });
    }

    var pesquisarHistoricoRegistro = function (html, tabela, campo, valor) {

        var dtoPesquisa = {
            Tabela: tabela,
            Campo: campo,
            Valor: valor
        };

        $.ajax({
            type: "POST",
            url: base_path + "AuditoriaPortal/Pesquisar",
            data: {
                'dtoPesquisa': dtoPesquisa
            },
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            montarModal(html, data.dto.Tabela);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar a pesquisa de Tabela. ' + errorThrown);
        });
    }

    var pesquisarISO = function (tabela, campo, valor) {

        isBtnClick = true;
        $.ajax({
            type: "POST",
            url: base_path + "IsoAuditoriaPortal/GetModalAuditoria",
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            pesquisarHistoricoRegistroISO(data, tabela, campo, valor);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar a pesquisa de Tabela. ' + errorThrown);
        });
    }

    var pesquisarHistoricoRegistroISO = function (html, tabela, campo, valor) {

        var dtoPesquisa = {
            Tabela: tabela,
            Campo: campo,
            Valor: valor
        };

        $.ajax({
            type: "POST",
            url: base_path + "IsoAuditoriaPortal/Pesquisar",
            data: {
                'dtoPesquisa': dtoPesquisa
            },
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            montarModal(html, data.dto.Tabela);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar a pesquisa de Tabela. ' + errorThrown);
        });
    }

    var pesquisarSAC = function (tabela, campo, valor) {

        isBtnClick = true;
        $.ajax({
            type: "POST",
            url: base_path + "SacAuditoriaPortal/GetModalAuditoria",
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            pesquisarHistoricoRegistroSac(data, tabela, campo, valor);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar a pesquisa de Tabela. ' + errorThrown);
        });
    }


    var pesquisarHistoricoRegistroSac = function (html, tabela, campo, valor) {

        var dtoPesquisa = {
            Tabela: tabela,
            Campo: campo,
            Valor: valor
        };

        $.ajax({
            type: "POST",
            url: base_path + "SacAuditoriaPortal/Pesquisar",
            data: {
                'dtoPesquisa': dtoPesquisa
            },
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            montarModal(html, data.dto.Tabela);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar a pesquisa de Tabela. ' + errorThrown);
        });
    }

    var pesquisarWF = function (tabela, campo, valor) {

        isBtnClick = true;
        $.ajax({
            type: "POST",
            url: base_path + "WfAuditoriaPortal/GetModalAuditoria",
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            pesquisarHistoricoRegistroWF(data, tabela, campo, valor);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar a pesquisa de Tabela. ' + errorThrown);
        });
    }

    var pesquisarHistoricoRegistroWF = function (html, tabela, campo, valor) {

        var dtoPesquisa = {
            Tabela: tabela,
            Campo: campo,
            Valor: valor
        };
        $.ajax({
            type: "POST",
            url: base_path + "WfAuditoriaPortal/Pesquisar",
            data: {
                'dtoPesquisa': dtoPesquisa
            },
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            montarModal(html, data.dto.Tabela);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao carregar a pesquisa de Tabela. ' + errorThrown);
        });
    }

    var montarModal = function (html, resultadoTabela) {

        adicionarHtmlPopup('popup_cadastro_tabela_geral', 'form_cadastro_tabela_geral', 'Histórico do Registro');

        $("#form_cadastro_tabela_geral").html(html);

        montarModalComEfeito('#form_cadastro_tabela_geral', null, 1200).on("dialogbeforeclose", function (event, ui) {
            $('#form_cadastro_tabela_geral').remove();
            return false;
        });

        $(controles().divTabelaResultado).html(resultadoTabela);

        $("#tabela_auditoria_portal").DataTable({
            dom: 'Bfrtip', buttons: ['excelHtml5'],
            responsive: false,
            destroy: true,
            filter: true,
            info: false,
            paginate: true,
            paginationType: 'full_numbers',
            lengthChange: false,
            iDisplayLength: 20,
            language: {
                search: 'Pesquisar',
                processing: 'Processando...',
                zeroRecords: 'Nenhum registro encontrado.',
                paginate: {
                    first: '&laquo;',
                    previous: '<',
                    next: '>',
                    last: '&raquo;'
                }
            }
        });

        $('div.dataTables_filter input').addClass('form-control');
        $('div.dataTables_length select').addClass('form-control');
        $('.dataTables_filter').css('padding-right', '1%');
    }

    return {
        pesquisar: pesquisar,
        pesquisarISO: pesquisarISO,
        pesquisarSAC: pesquisarSAC,
        pesquisarWF: pesquisarWF,
    }
}();

var feedback = function () {

    var controles = function () {

        return {
            divFeedback: "#divFeedback",
            txtMotivo: "#txtMotivo",
            hdfFuncionalidade: "#hdfFuncionalidade",
            tabela_feedback_consulta: "#tabela_feedback_consulta",
            txtLoginUsuario: "#txtLoginUsuario",
            txtFuncionalidade: "#txtFuncionalidade",
            ddlGostou: "#ddlGostou",
            txtDataResposta: "#txtDataResposta"
        };
    }

    var verificarSeJaHouveFeedback = function () {

        $.ajax({
            type: "POST",
            url: base_path + "Feedback/JaRespondeuHojePraEssaFuncionalidade",
            data: { 'funcionalidade': $(controles().hdfFuncionalidade).val() },
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                //removerLoading();
            }
        }).done(function (data) {
            if (!data) {
                $(controles().divFeedback).show();
            }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao salvar sua opinião ' + errorThrown);
        });
    }

    var naoGostei = function () {

        $.ajax({
            type: "POST",
            url: base_path + "Feedback/GetModalNaoGostei",
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            montarModal(data);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao obter o modal de feedback. ' + errorThrown);
        });
    }

    var cancelar = function () {

        $('#form_feedback').dialog('close');
    }

    var montarModal = function (html) {

        adicionarHtmlPopup('popup_feedback', 'form_feedback', 'Feedback');

        $("#form_feedback").html(html);

        montarModalComEfeito('#form_feedback', null).on("dialogbeforeclose", function (event, ui) {
            $('#form_feedback').remove();
            return false;
        });
    }

    var salvarNaoGostei = function () {
        var dto = {
            Gostou: false,
            Comentario: $(controles().txtMotivo).val(),
            Funcionalidade: $(controles().hdfFuncionalidade).val()
        };

        return salvar(dto);
    }

    var salvarGostei = function () {
        var dto = {
            Gostou: true,
            Comentario: $(controles().txtMotivo).val(),
            Funcionalidade: $(controles().hdfFuncionalidade).val()
        };

        return salvar(dto);
    }

    var gostei = function () {

        $.ajax({
            type: "POST",
            url: base_path + "Feedback/GetModalGostei",
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            montarModal(data);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao obter o modal de feedback. ' + errorThrown);
        });
    }

    var hideDivFeedback = function () {
        $(controles().divFeedback).hide();
    }

    var salvar = function (dto) {

        $.ajax({
            type: "POST",
            url: base_path + "Feedback/Salvar",
            data: {
                'dto': dto
            },
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            hideDivFeedback();
            mostrarSucessoPopup(data.Mensagem, cancelar);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao salvar sua opinião ' + errorThrown);
        });
    }

    var pesquisar = function () {

        var dtoPesquisa = {
            LoginUsuario: $(controles().txtLoginUsuario).val(),
            Funcionalidade: $(controles().txtFuncionalidade).val(),
            Gostou: $(controles().ddlGostou + ' :selected').val(),
            DataResposta: $(controles().txtDataResposta).val(),
        };

        if (dtoPesquisa.DataResposta && !isValidDateInString(dtoPesquisa.DataResposta)) {
            mostrarAvisoPopup('Data de pesquisa inválida!');
            return false;
        }

        $.ajax({
            type: "POST",
            url: base_path + "Feedback/Pesquisar",
            data: {
                'dtoPesquisa': dtoPesquisa
            },
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {

            montarTabela(data.dto);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao salvar sua opinião ' + errorThrown);
        });
    }

    var montarTabela = function (lista) {

        $tabelaFeedback = $(controles().tabela_feedback_consulta).DataTable({
            dom: 'Bfrtip',
            buttons: ['excelHtml5'],
            responsive: false,
            data: lista,
            destroy: true,
            filter: false,
            info: false,
            paginate: true,
            paginationType: 'full_numbers',
            lengthChange: false,
            iDisplayLength: 5,
            language: {
                processing: 'Processando...',
                zeroRecords: 'Nenhum registro encontrado.',
                paginate: {
                    first: '&laquo;',
                    previous: '<',
                    next: '>',
                    last: '&raquo;'
                }
            },
            order: [[0, 'asc']],
            columns: [
                {
                    data: 'DataRespostaFull',
                    visible: false
                },
                 {
                     data: 'Gostou',
                     title: 'Gostou',
                     sortable: true,
                     render: function (data) {

                         if (data.toString().toUpperCase() == "TRUE")
                             return "SIM";
                         else
                             return "NÃO";
                     }
                 },
                {
                    data: 'Funcionalidade',
                    title: 'Funcionalidade',
                    sortable: true,
                    render: function (data) {
                        if (data == undefined) return "";
                        return data;
                    }
                },
                 {
                     data: 'NomeUsuario',
                     title: 'Usuário',
                     sortable: true,
                     render: function (data) {
                         if (data == undefined) return "";
                         return data;
                     }
                 },
                  {
                      data: 'Comentario',
                      title: 'Comentário',
                      sortable: true,
                      render: function (data) {
                          if (data == undefined) return "";
                          return data;
                      }
                  },
                   {
                       data: 'DataResposta',
                       title: 'Data da Resposta',
                       sortable: true,
                       iDataSort: 0,
                       render: function (data) {
                           if (data == undefined) return "";
                           return data;
                       }
                   }
            ]
        })
    }

    return {
        salvar: salvar,
        salvarNaoGostei: salvarNaoGostei,
        salvarGostei: salvarGostei,
        naoGostei: naoGostei,
        gostei: gostei,
        cancelar: cancelar,
        verificarSeJaHouveFeedback: verificarSeJaHouveFeedback,
        pesquisar: pesquisar
    }
}();


var login = function () {

    var controles = function () {
        return {
            txtUsuario: "#txtUsuario",
            txtSenha: "#txtSenha"
        };
    }

    var logout = function () {

        limparLocalStoragePerfil();
        limparLocalStorageFotoUsuario();
        $('#btnSairSimulacao').hide();
        localStorage.removeItem('SimulacaoAtiva');

        window.location = base_path + "Usuario/LogOut?novoUsuario=" + $(controles().txtUsuario).val();
    }

    var efetuarLogin = function () {

        $.ajax({
            type: "POST",
            url: base_path + "Usuario/ValidaUsuarioNoAD",
            data: {
                'strUsuario': $(controles().txtUsuario).val(), 'strSenha': $(controles().txtSenha).val()
            },
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {
            if (data.Resultado) {
                logout();
            }
            else {
                mostrarAvisoPopup(data.Mensagem);
            }
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao salvar sua opinião ' + errorThrown);
        });

    }

    var getModalLogin = function () {

        $.ajax({
            type: "POST",
            url: base_path + "Usuario/TrocarUsuario",
            cache: false,
            complete: function (XMLHttpRequest, textStatus) {
                removerLoading();
            }
        }).done(function (data) {

            montarModal(data);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            mostrarErroPopup('Problemas ao obter o modal de login ' + errorThrown);
        });
    }

    var montarModal = function (html) {

        adicionarHtmlPopup('popup_login', 'form_login', 'Login');

        $("#form_login").html(html);

        montarModalComEfeito('#form_login', null, 600).on("dialogbeforeclose", function (event, ui) {
            $('#form_login').remove();
            return false;
        });
    }

    return {
        efetuarLogin: efetuarLogin,
        getModalLogin: getModalLogin
    }
}();