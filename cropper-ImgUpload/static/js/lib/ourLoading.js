;(function ($) {
	var loadingconf = {
		top:'0',
        ismask:'1'
	}    
    $.extend($.fn, {
        treeLoading:function(options) {
            loadingconf = $.extend(loadingconf, options);
            var _self = $(this);
            _self.find('.treeLoading').remove();
            _self.append('<span class="treeLoading" style="overflow:hidden;inline-block;width:20px;height:26px;line-height:26px;vertical-align:top;"><img style="margin-top:4px" width="18px" height="18px" src="/static/css/base/i/loading.gif"/></span>');
        },
        ourLoading:function(options) {
            loadingconf = $.extend(loadingconf, options);
            var _self = $(this);
            _self.css('position','relative');
            if(loadingconf.top!='0'){
                _self.css('min-height',(loadingconf.top*1+30*1)+'px');
            }
            _self.find('.ourLoading').remove();
            var mask=loadingconf.ismask==1?'background-color:rgba(255,255,255,0.4)':'';
            var position=loadingconf.top==0?'top:50%;left:50%;margin:-15px 0px 0px -15px;':'top:'+loadingconf.top+'px;left:50%;margin:0px 0px 0px -15px;';
            _self.append('<span class="ourLoading" style="width:100%;height:100%;position:absolute;top:0px;left:0px;z-index:99999;text-align:center;'+mask+'"><span style="overflow:hidden;display:block;width:35px;height:35px;line-height:38px;color:#ff6600;font-size:18px;font-family:Matryoshka;position:absolute;'+position+'">91</span><img style="overflow:hidden;display:block;width:35px;height:35px;line-height:35px;position:absolute;'+position+'" src="/static/css/base/i/loading.gif"/></span>');
        },
    	ourUnLoading:function() {
            var _self = $(this);
            _self.find('.treeLoading').remove();
            setTimeout(function(){
                _self.find('.ourLoading').fadeOut(function(){
                    _self.find('.ourLoading').remove();
                })
            },200);
        }
    });
})($);