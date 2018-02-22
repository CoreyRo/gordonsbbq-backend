$(document)
    .ready(function ($) {

        $('#summernote').summernote({
            tabsize: 2,
            height: 800,
            callbacks:{
                onImageUpload: function(files) {
                    console.log("files", files)
                    sendFile(files[0]);
                }
            }
        })
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
                success: function(url) {
                    console.log('url', url)
                    let imgNode = $('<img>').attr('src',url.url).attr('name', url.name)
                    console.log(imgNode)
                    $('#summernote').summernote('insertNode', imgNode[0]);
                }
            });
            
        }
        

        $('#checkrte').on('click', function(e){
            e.preventDefault()
            console.log($('#summernote').summernote('code'))
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
                        $('.main')
                            .removeClass('dumped')
                            .addClass('col-lg-10 float-right col px-5 pl-md-2 pt-2 main')
                    })
            } else {
                $('#sidebar')
                    .on('hide.bs.collapse', function () {
                        $('.main')
                            .removeClass()
                            .addClass('main dumped px-5')
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
                            }
                        );

                    return this;
                }
            });

    })