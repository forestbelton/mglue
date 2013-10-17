;(function() {
    var $form     = $('#form-new'),
        $paste    = $('#no-form'),
        $res      = $('#result');

    function send_nl2br(contents, to) {
        contents.split(/[\r\n]+/).map(function(l) { to.append($('<p>').text(l)); });
    }

    var $lightbox = function(contents, width, height) {       
        width     = width  || 600;
        height    = height || 500;

        var $html = $('<div id="lightbox"><span class="close">x</span></div>');
        
        send_nl2br(contents, $html);

        $html.css({
                left:  ($(window).width() - width)  / 2,
                top:   (($(window).scrollTop() + ($(window).height)) - height) /2,
                width:  width,
                height: height
            })
            .insertBefore($form)
            .fadeIn('fast');

        $('.close').on('click', function() {
                $html.fadeOut('fast', function(){
                    $html.remove();
                });
            });
    };

    $form.on('submit', function(e) {
        e.preventDefault();
        var contents = $(this).find('[name="contents"]').val();

        if(contents == '') {
            $(this).addClass('error');
            $(this).find('.error-msg').html('Please enter input text');
            $("html, body").animate({ scrollTop: 0 }, 'fast');
            return false;
        } else {
            $(this).removeClass('error');
        }

        $.ajax({
            type:     'POST',
            cache:    false,
            url:      $(this).attr('action'),
            data:     { contents: contents },
            dataType: 'json'
        })
        .then(function(data) {
            history.pushState(null, 'MGlue', '/' + data.hash);
            $form.hide();
            $res.html('');
            send_nl2br(contents, $res);
            $paste.show();
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'result']);
        });

        return false;
    });

    $('#header').on('click', function() {
        if($paste.is(':visible')) {
            $paste.hide();
            $form.show();
        }
        return false;
    });

    $('.preview').on('click', function() {
        if ($('#lightbox').length) {
            return false;
        }
        var contents = $form.find('[name="contents"]').val();
        if (contents != '') {
            $lightbox(contents);

            MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'lightbox']);
        }
        return false;
    });

})();
