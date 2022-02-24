/**
 * Author: Franklin Javier Gonzalez
 * Date: 04/01/2010
 * Version: 1.0a
 * 
 * If you use this script, please link back to the source
 *
 * Please report any bug at contato@franklinjavier.com.br
 * Copyright (c) 2010 Franklin Javier http://www.franklinjavier.com.br
 *
 * Released under the Creative Commons Attribution 3.0 Unported License,
 * as defined here: http://creativecommons.org/licenses/by/3.0/
 *  
 */

(function ($) {
    jQuery.fn.textarea_maxlength = function () {
        $(this).live('keyup keypress keydown change drop', function (event) {
            $this = $(this);

            if (event.valueOf().type == "drop") {
                event.preventDefault();
                return true;
            }

            var totalDeEnters = $this.val().match(new RegExp("\n", 'g'));

            if (totalDeEnters == null) {
                totalDeEnters = 0;
            }
            else {
                totalDeEnters = totalDeEnters.length;
            }

            var limit = $this.attr("maxlength") || 140,
				length = $this.val().length + totalDeEnters,
				key,
				ie = (typeof window.ActiveXObject != 'undefined'); // IE

            (ie) ? key = event.keyCode : key = event.which; // IE (keyCode), else, (wich)

            if ((key >= 48 && key <= 112) || key == 13 || key == 32)
                if (length >= limit)
                    event.preventDefault();

            var textoOriginal = $this.val();

            var totalCaracter = 0;

            var textoLimite = "";

            $.each(textoOriginal, function (index, caracter) {
                totalCaracter++;

                if (caracter == "\n") {
                    totalCaracter++;
                }

                if (totalCaracter > limit) {
                    return false;
                }

                textoLimite += caracter;
            });

            var remain = limit - totalCaracter;
            if (remain < 0) {
                remain = 1;
            }

            if ($this.val().length + totalDeEnters > limit) {
                $this.val(textoLimite);
            }

            $this.parent().find(".remaining").html(remain);
        });
    }
})(jQuery);
