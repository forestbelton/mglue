;(function() {
    var $form  = $('#form-new'),
        $paste = $('#no-form'),
        $res   = $('#result');

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
            contents.split(/[\r\n]+/).map(function(l) { $res.append($('<p>').text(l)); });
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
})();
