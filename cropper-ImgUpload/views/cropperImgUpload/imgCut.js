var imgUpload = function(op) {
    var imgUploadPars = {
        uploadUrl: '',
        aspectRatio: 16 / 9, //类型:number；默认：NAN
        viewMode: 0, // 0：没有限制，3可以移动到2外。1 : 3只能在2内移动。2：2图片 不全部铺满1 （即缩小时可以有一边出现空隙）3：2图片填充整个1
        dragMode: 'move', //‘crop’: 可以产生一个新的裁剪框3 ‘move’: 只可以移动3 ‘none’: 什么也不处理
        preview: '.imgCut_view', //添加额外的元素(容器)以供预览
        autoCropArea: 0.5, //剪切框默认大小 默认 .8
        minCropBoxWidth: 30,
        minCropBoxHeight: 30, //剪切框最小大小
        maxSize: 800, //K为单位
        crop: function() {},
        ready: function() {},
        width: '679',
        height: '380',
        callBack: function() {}
    }
    $.extend(imgUploadPars, op);
    var imgUploadStr = '<div class="imgCut_bg">' +
        '<div id="imgCut" class="imgCut" style="width:' + (imgUploadPars.width * 1 + 4) + 'px;margin:' + (-((imgUploadPars.height / 2) + 50)) + 'px 0px 0px ' + (-(imgUploadPars.width * 1 + 4) / 2) + 'px">' +
        '<div class="imgCut_main" style="width:' + imgUploadPars.width + 'px;height:' + imgUploadPars.height + 'px">' +
        '<img id="imgCut_img" src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==">' +
        '</div>' +
        '<div class="imgCut_sub">' +
        '<div id="imgCut_view" style="width:' + (imgUploadPars.width / 5) + 'px;height:' + (imgUploadPars.height / 5) + 'px" title="预览图-点击关闭" class="imgCut_view"></div><span class="imgCut_view_text">预览</span>' +
        '<input type="file" class="none">' +
        '<span class="imgCut_selBtn">选图片</span><span class="imgCut_upBtn">上传</span><span class="imgCut_closeBtn f_r">关闭</span>' +
        '</div>' +
        '</div>' +
        '</div>'
    $('body').append(imgUploadStr);

    var cropper = new Cropper(imgCut_img, imgUploadPars);
    $('#imgCut .imgCut_sub input[type="file"]').unbind('change').change(function(e) {

        var curFile = $(this)[0].files[0];
        if (curFile.type != 'image/jpeg' && curFile.type != 'image/png') {
            console.log('请选择正确的图片格式');
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(curFile);
            reader.onload = function() {
                cropper.replace(reader.result, false);
            };

        }
    });
    $('#imgCut .imgCut_upBtn').unbind('click').click(function(e) {
        if ($(cropper.image).attr('src').indexOf('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==') == -1) {
            var canvasData = cropper.getCroppedCanvas();
            //var base64url = canvasData.toDataURL('image/jpeg');
            canvasData.toBlob(function(blob) {
                if ((blob.size / 1000) < imgUploadPars.maxSize) {
                    var formData = new FormData();
                    //userTodo
                    formData.append('image-file', blob);
                    $.ajax(imgUploadPars.uploadUrl, {
                        method: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(e) {
                            if (e.code == 1) {
                                if (imgUploadPars.callBack) {
                                    imgUploadPars.callBack(e.data);
                                    console.log('上传成功');
                                    $('.imgCut_bg').fadeOut('slow', function() {
                                        $('.imgCut_bg').remove();
                                    });
                                }
                            } else {
                                console.log(e.msg);
                            }

                        },
                        error: function() {
                            console.log('网络异常，稍后重试');
                        }
                    });
                } else {
                    console.log('图片过大，可换图 或 剪切更小面积');
                }
            }, 'image/png');
        } else {
            console.log('请选择图片');
        }
    });
    $('#imgCut .imgCut_selBtn').unbind('click').click(function() {
        $('#imgCut .imgCut_sub input[type="file"]').click();
    });
    $('#imgCut .imgCut_closeBtn').unbind('click').click(function() {
        $('.imgCut_bg').remove();
    });
    $('#imgCut .imgCut_view').unbind('click').click(function() {
        $(this).addClass('noneim');
    });
    $('#imgCut .imgCut_view_text').unbind('click').click(function() {
        $('#imgCut .imgCut_view').removeClass('noneim');
    });

}