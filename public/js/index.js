$(document)
    .ready(function ($) {

        $(window)
            .width(function () {
                if ($(window).width() < 1025) {
                    $('.main')
                        .removeClass('col-10 ml-auto')
                        .addClass('col-11 mx-auto')
                } else {
                    $('.main').removeClass('col-11 mx-auto')
                    if (!$('.main').hasClass('col-10')) {
                        $('.main').addClass('col-10 ml-auto');
                    }
                }
            })

        $(window).resize(function () {
            if ($(window).width() < 1025) {
                $('.main')
                    .removeClass('col-10 ml-auto')
                    .addClass('col-11 mx-auto')
            } else {
                $('.main').removeClass('col-11 mx-auto')
                if (!$('.main').hasClass('col-10')) {
                    $('.main').addClass('col-10 ml-auto');
                }
            }
        });

        $('#summernote').summernote({
            tabsize: 2,
            height: 400,
            callbacks: {
                onImageUpload: function (files) {
                    sendFile(files[0]);
                },
                onMediaDelete: function (target) {
                    deleteFile(target[0].src);
                },
                onPaste: function(e) {
                },
                onChange: function (contents, $editable) {
                    $('#summernote').val(contents)
                }
            },
            toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['picture']
            ],

        })

        $('#summernote').each(function () {
            if ($(this).data('validator'))
                $(this).data('validator').settings.ignore = ".note-editor *";
        });

        function sendFile(file) {
            data = new FormData();
            data.append("file", file);
            $.ajax({
                data: data,
                type: "POST",
                url: '/imageupload',
                cache: false,
                contentType: false,
                processData: false,
                success: function (url) {
                    let imgNode = $('<img>')
                        .attr('src', url.url)
                        .attr('name', url.name)
                    return $('#summernote').summernote('insertNode', imgNode[0]);
                }
            });
        }

        function deleteFile(file) {
            data = new FormData();
            data.append("file", file);
            $.ajax({
                data: data,
                type: "POST",
                url: '/imageDelete',
                cache: false,
                contentType: false,
                processData: false,
                success: function (resp) {
                   return console.log('deleted')
                }
            });

        }

        $('#checkrte')
            .on('click', function (e) {
                e.preventDefault()
            })

        let text = $('#current_text').val()
        $('#text').html(text)
        $('.delete-btn').on('click', function (e) {
            e.preventDefault()
        })

        $('[data-toggle="collapse"]').on('click', function () {
            if ($('.main').hasClass('dumped')) {
                $('#sidebar')
                    .on('shown.bs.collapse', function () {
                        $('.container-fluid').attr('style', '')

                        $('.main')
                            .removeClass('main col-12 dumped')
                            .addClass('ml-auto col-10 main')

                    })
            } else {
                $('#sidebar')
                    .on('hidden.bs.collapse', function () {
                        $('.main')
                            .removeClass('col-10 ml-auto')
                            .addClass('main col-12 dumped')
                        $('.container-fluid').attr('style', 'padding: 1% 1% 0 4% !important;')

                    })
            }

        });

        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
            $(".side-nav .collapse").on("hide.bs.collapse", function () {
                $(this)
                    .prev()
                    .find(".fa")
                    .eq(1)
                    .removeClass("fa-angle-right")
                    .addClass("fa-angle-down");
            });
            $('.side-nav .collapse').on("show.bs.collapse", function () {
                $(this)
                    .prev()
                    .find(".fa")
                    .eq(1)
                    .removeClass("fa-angle-down")
                    .addClass("fa-angle-right");
            });
        })

        $("#imageURL").change(function () {
            imgView(this);
        });

        function imgView(input) {
            if (input.files && input.files[0]) {
                $('.preview-image').html(input.files[0].name)
                let reader = new FileReader();
                reader.onload = function (e) {
                    $('.previewimg').attr('src', e.target.result);
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        $
            .fn
            .extend({
                animateCss: function (animationName, callback) {
                    var animationEnd = (function (el) {
                        var animations = {
                            animation: 'animationend',
                            OAnimation: 'oAnimationEnd',
                            MozAnimation: 'mozAnimationEnd',
                            WebkitAnimation: 'webkitAnimationEnd'
                        };

                        for (var t in animations) {
                            if (el.style[t] !== undefined) {
                                return animations[t];
                            }
                        }
                    })(document.createElement('div'));

                    this
                        .addClass('animated ' + animationName)
                        .one(animationEnd, function () {
                            $(this).removeClass('animated ' + animationName);

                            if (typeof callback === 'function')
                                callback();
                        });

                    return this;
                }
            });

    })