define(function(require, exports, module) {
    var treeLoad = require('treeLoad');
    var selectTree = function(op) {
        var _self = this;
        this.opd = {
            selectTreeId: 'body', //下拉树容器元素Id或Class
            selectTreeType: '5', //类型
            selectTreeOneLine: '0', //多选是选中的数据是否一行显示
            selectTreeABC: '0', //是否显示abc导航
            selectTreeUrl: '', //数据加载Url
            selectNodeStart: '0', //数据加载Url
            selectDfdata: { selid: '', selname: '' }, //初始值
            selectTreeMap: { nodeId: '', nodeName: '' }, //字段映射
            maxHeight: '230', //最大高度
            isManage: '1', //是否可操作
            isSet: '0', //是否编辑
            isCkBox: '0', //是否有复选框
            isFirstClick: '0', //是否初始化选中
            isLastClick: '0',/*最后一个选中*/
            isNodeOpen: '0',/*树结构是否默认展开*/
            isSelTree: '0', //是否为下拉框树
            selectTreeCss: '', //自定义样式
            beforeData: null, //提供对外Data修改函数
            isLoadData: '0', //是否默认加载数据
            customData: null,
            isCheck: false,
            keyCheck: '',
            add: null,
            edit: null,
            del: null,
            zIndex: 0,
            selectTreeCallBack: function() {},
            selectFinished: function() {},
            renderCallBack:null,//主容器渲染成功后的回调事件
        };
        if (op) { $.extend(this.opd, op); }
        this.csses = {
            _s_width: $(_self.opd.selectTreeId).outerWidth(),
            _s_height: $(_self.opd.selectTreeId).outerHeight(),
            _s_rheight: $(_self.opd.selectTreeId).height(),
            mathId: parseInt(Math.random() * 100000)
        }
        //树展现
        this.loadSelectTree = function() {
            var thistext = $(_self.opd.selectTreeId);

            var iscomSel = _self.opd.customData == null ? '' : 'padding:0px 0px 0px 0px!important;min-width:' + (_self.csses._s_width - 2) + 'px!important;'

            var isnoneim = ''
            if (_self.opd.isFirstClick == '1' || _self.opd.isLoadData == '1') {
                isnoneim = 'noneim';
            }
            $(_self.opd.selectTreeId).append('<div id="selectTreeOption' + _self.csses.mathId + '" class="selectTreeOption ' + isnoneim + '" style="padding:10px 10px 10px 10px;line-height:26px;background-color:#ffffff;border-radius:3px;position:absolute;top:100%;left:-1px;margin-top:2px;border:solid 1px #d8d8d8; display:inline-block;min-width:' + (_self.csses._s_width - 22) + 'px;' + iscomSel + _self.opd.selectTreeCss + '"></div>');
            $(_self.opd.selectTreeId).find('.selectTreeOption').click(function() {
                return false;
            })
            treeLoad.load({
                treeId: '#selectTreeOption' + _self.csses.mathId,
                treeType: _self.opd.selectTreeType,
                treeABC: _self.opd.selectTreeABC,
                treeUrl: _self.opd.selectTreeUrl,
                treeMap: _self.opd.selectTreeMap,
                treeDfids: _self.opd.selectDfdata.selid,
                nodeStart: _self.opd.selectNodeStart,
                maxHeight: _self.opd.maxHeight,
                isManage: _self.opd.isManage,
                isSet: _self.opd.isSet,
                isCkBox: _self.opd.isCkBox,
                isFirstClick: _self.opd.isFirstClick,
                isLastClick: _self.opd.isLastClick,
                isNodeOpen: _self.opd.isNodeOpen,
                isSelTree: _self.opd.isSelTree,
                beforeData: _self.opd.beforeData,
                customData: _self.opd.customData,
                add: _self.opd.add,
                edit: _self.opd.edit,
                del: _self.opd.del,
                zIndex: _self.opd.zIndex,
                nettype: _self.opd.nettype,
                click: function(e) {
                    var nodeId = e[_self.opd.selectTreeMap.nodeId];
                    var nodeName = e[_self.opd.selectTreeMap.nodeName];
                    if (_self.opd.selectTreeType == '5') { //无复选框
                        thistext.find('.s_sels').remove();
                        thistext.append('<span class="escp s_sels ss_one" style="vertical-align:top;display:inline-block;width:' + (_self.csses._s_width - 30) + 'px" title="' + nodeName + '">' + nodeName + '</span>');
                        thistext.attr('selid', nodeId);
                        thistext.attr('selname', nodeName);
                        $(_self.opd.selectTreeId).find('.selectTreeOption').addClass('noneim');
                        _self.opd.selectTreeCallBack(e, $(_self.opd.selectTreeId));
                    }
                    if (_self.opd.selectTreeType == '4') { //有复选框
                        //如果有全部选项
                        if ($(_self.opd.selectTreeId).find('.curtree_name[nodeid="-1"]').length > 0) {
                            if (e[_self.opd.selectTreeMap.nodeId] == '-1' || e[_self.opd.selectTreeMap.nodeId] == '') {
                                $(_self.opd.selectTreeId + '>.selectTreeOption').find('.curtree_ckbox_ck[nodeid!="-1"]').removeClass('curtree_ckbox_ck');
                            } else {
                                $(_self.opd.selectTreeId + '>.selectTreeOption').find('.curtree_ckbox_ck[nodeid="-1"]').removeClass('curtree_ckbox_ck');
                            }
                            if ($(_self.opd.selectTreeId + '>.selectTreeOption').find('.curtree_ckbox_ck').length == 0) {
                                $(_self.opd.selectTreeId).find('.curtree_name[nodeid="-1"]').click();
                                return false;
                            }
                        }
                        var ck_lsit = $(_self.opd.selectTreeId + '>.selectTreeOption').find('.curtree_ckbox_ck');
                        var selId_list = '',
                            selName_list = '',
                            selNameSee_list = '';
                        ck_lsit.each(function() {
                            var curname_all = $(this).parent().parent().children('.treelist_con').children('.curtree_name').length;
                            var curname_ck = $(this).parent().parent().children('.treelist_con').children('.curtree_ckbox_ck').length;
                            var curname_parent = $(this).parent().parent().find('.curtree_name').eq(0);
                            if (curname_all != curname_ck || curname_parent.hasClass('can_t') || (curname_all = curname_ck && $(this).parent().parent().hasClass('ourCurtree'))) {
                                selId_list = selId_list + ',' + $(this).attr('nodeId');
                                selName_list = selName_list + ',' + $(this).find('.c_name_span').attr('title');
                                if (_self.opd.selectTreeOneLine == '0') {
                                    selNameSee_list = selNameSee_list + '<span class="escp s_sels ss_more" nodename="' + $(this).find('.c_name_span').attr('title') + '" nodeid="' + $(this).attr('nodeid') + '" style="vertical-align:top;display:inline-block;float:left;">' + $(this).find('.c_name_span').attr('title') + '<span style="padding-left:5px;" class="ss_more_del">X</span></span>';
                                }
                                if (_self.opd.selectTreeOneLine == '1') {
                                    selNameSee_list = selNameSee_list + '<span class="escp s_sels ss_more" style="background-color: transparent!important;margin:0px!important;padding:0px!important;" nodename="' + $(this).find('.c_name_span').attr('title') + '" nodeid="' + $(this).attr('nodeid') + '">' + $(this).find('.c_name_span').attr('title') + ',</span>';
                                }
                            }
                        });

                        thistext.find('.s_sels').each(function() {
                            var nid = $(this).attr('nodeid');
                            if ($(_self.opd.selectTreeId + '>.selectTreeOption').find('.curtree_name[nodeid="' + nid + '"]').length > 0) {
                                $(this).remove();
                            }
                        });
                        thistext.find('.s_sels[nodeid="-1"]').remove();
                        thistext.find('.s_sels[nodeid="0"]').remove();
                        thistext.find('.ss_more_content').append(selNameSee_list);
                        if (_self.opd.selectTreeOneLine == '1') {
                            thistext.find('.ss_more_content .ss_more').last().html(thistext.find('.ss_more_content .ss_more').last().attr('nodename'));
                        }
                        var ids = '',
                            names = '';
                        thistext.find('.ss_more').each(function() {
                            ids = ids + ',' + $(this).attr('nodeid');
                            names = names + ',' + $(this).attr('nodename');
                        });
                        thistext.attr('selid', ids.replace(',', ''));
                        thistext.attr('selname', names.replace(',', ''));
                        thistext.find('.ss_more_content').attr('title', names.replace(',', ''));

                        _self.opd.selectTreeCallBack(e, $(_self.opd.selectTreeId));
                    }
                },
                finished: function() {
                    $(_self.opd.selectTreeId + '>.selectTreeOption').find('.curtree_name[nodeid="-1"]').find('.c_name_ckbox').addClass('noneim');
                    _self.opd.selectFinished();
                }
            });
        };
        //删除事件绑定
        this.bindclick = function() {
            var thistext = $(_self.opd.selectTreeId);
            thistext.on('click', '.ss_more_del', function() {
                //不可操作
                if (_self.opd.isManage == '0') {
                    return false;
                }
                var nodeId = $(this).parent().attr('nodeId');

                $(this).parent().remove();
                var ids = '',
                    names = '';
                thistext.find('.ss_more').each(function() {
                    ids = ids + ',' + $(this).attr('nodeid');
                    names = names + ',' + $(this).attr('nodename');
                });
                thistext.attr('selid', ids.replace(',', ''));
                thistext.attr('selname', names.replace(',', ''));

                _self.opd.selectDfdata = { selid: ids.replace(',', ''), selname: names.replace(',', '') };

                thistext.find('.curtree_ckbox_ck[nodeId="' + nodeId + '"]').click();
                thistext.find('.curtree_ckbox_ck[nodeId="' + nodeId + '"]').removeClass('curtree_ckbox_ck');

            })
        };
        //初始化数据显示
        this.dfdataBind = function() {
            $(_self.opd.selectTreeId).html('<span title="" class="ss_more_content escp"><span class="escp s_sels" nodeid="-1" style="vertical-align:top;display:inline-block;width:' + (_self.csses._s_width - 20) + 'px">' + $(_self.opd.selectTreeId).html() + '</span></span><div class="sel_tree_jt"></div>');
            if (_self.opd.selectDfdata.selid) {
                $(_self.opd.selectTreeId).attr('selid', _self.opd.selectDfdata.selid);
                $(_self.opd.selectTreeId).attr('selname', _self.opd.selectDfdata.selname);
                if (_self.opd.selectTreeType == '4') {
                    var selNameSee_lists = '';
                    try {
                        var idlist = _self.opd.selectDfdata.selid.split(',');
                        var namelist = _self.opd.selectDfdata.selname.split(',');
                        if (_self.opd.selectTreeOneLine == '0') {
                            for (var i = 0; i < idlist.length; i++) {
                                selNameSee_lists = selNameSee_lists + '<span class="escp s_sels ss_more" nodename="' + namelist[i] + '" nodeid="' + idlist[i] + '" style="vertical-align:top;display:inline-block;float:left;">' + namelist[i] + '<span style="padding-left:5px;" class="ss_more_del">X</span></span>';
                            }
                        }
                        if (_self.opd.selectTreeOneLine == '1') {
                            for (var i = 0; i < idlist.length; i++) {
                                selNameSee_lists = selNameSee_lists + '<span class="escp s_sels ss_more" style="background-color: transparent!important;margin:0px!important;padding:0px!important;" nodename="' + namelist[i] + '" nodeid="' + idlist[i] + '">' + namelist[i] + ',</span>';
                            }
                        }
                    } catch (e) {
                        selNameSee_lists = selNameSee_lists + '<span class="escp s_sels ss_more" style="vertical-align:top;display:inline-block;float:left;" nodename="数据错误">数据错误' + e.message + '<span style="padding-left:5px;" class="ss_more_del">X</span></span>';
                    }
                    $(_self.opd.selectTreeId).html('<span title="' + _self.opd.selectDfdata.selname + '" class="ss_more_content escp">' + selNameSee_lists + '</span><div class="sel_tree_jt"></div>');
                    if (_self.opd.selectTreeOneLine == '1') {
                        $(_self.opd.selectTreeId).find('.ss_more').last().html($(_self.opd.selectTreeId).find('.ss_more').last().attr('nodename'));
                    }
                }
                if (_self.opd.selectTreeType == '5') {
                    $(_self.opd.selectTreeId).html('<span class="escp s_sels" style="vertical-align:top;display:inline-block;width:' + (_self.csses._s_width - 20) + 'px">' + _self.opd.selectDfdata.selname + '</span><div class="sel_tree_jt"></div>');
                }
            }
        };
    };

    module.exports = {
        load: function(op) {
            $('body').unbind('click').click(function(){
                $('.selectTreeOption').addClass('noneim');
            });
            var newSelectTree = new selectTree(op);
            var thistreesel = $(newSelectTree.opd.selectTreeId);
            thistreesel.find('.selectTreeOption,.ss_more,.ss_more_content,.sel_tree_jt').remove();

            if (newSelectTree.opd.zIndex > 0) {
                thistreesel.css({ 'z-index': newSelectTree.opd.zIndex })
            }
            thistreesel.css({ 'position': 'relative', 'cursor': 'pointer', 'background-color': '#ffffff', 'display': 'inline-block' }).append('<div class="sel_tree_jt"></div>');

            try {
                if (newSelectTree.opd.selectDfdata.selid != '') {
                    thistreesel.attr('selid', newSelectTree.opd.selectDfdata.selid).attr('selname', newSelectTree.opd.selectDfdata.selname);
                }
                if (newSelectTree.opd.selectDfdata.selid == '' && $.trim(thistreesel.attr('selid')) != '') {
                    newSelectTree.opd.selectDfdata = { selid: thistreesel.attr('selid'), selname: thistreesel.attr('selname') };
                }
            } catch (e) {
                console.log(e.message);
            }
            thistreesel.unbind('click').click(function() {
                if ($(newSelectTree.opd.selectTreeId).hasClass('unable')) {
                    return false;
                }
                $('.selectTreeOption').addClass('noneim');
                var curtextbox = $(newSelectTree.opd.selectTreeId).find('.selectTreeOption');
                if (curtextbox.length == 0) {
                    newSelectTree.loadSelectTree();
                } else {
                    curtextbox.removeClass('noneim');
                }
                return false;
            });
            $('.aui_content').unbind('click').click(function() {
                $('.selectTreeOption').addClass('noneim');
            });
            newSelectTree.dfdataBind();
            newSelectTree.bindclick();
            if (newSelectTree.opd.isFirstClick == '1' || newSelectTree.opd.isLastClick == '1') {
                thistreesel.click();
            }
            if (newSelectTree.opd.isLoadData == '1') {
                newSelectTree.loadSelectTree();
            }
            if (newSelectTree.opd.renderCallBack) {
                newSelectTree.opd.renderCallBack(newSelectTree.opd);
            }
        }
    };
});