define(function(require, exports, module) {
    var tree = function(op) {
        var _self = this;
        this.opd = {
            treeId: 'body', //树容器元素Id或Class
            nettype: 'net',
            //1:选中编辑，
            //2:选中不编辑，
            //3:不选中不编辑，
            //4:带复选框树(授权树)--多选，
            //5:下拉框树--单选,
            //6:仿制下拉框
            treeType: '1',
            treeMode: '1',
            treeUrl: '', //数据加载Url
            treeMap: {
                nodeId: '',
                nodeName: '',
                nodeIcon: '', //映射图标字段
                sort: '', //映射排序字段
                parentId: ''
            }, //字段映射
            treeDfids: '',
            treeABC: '0', //是否显示abc导航
            maxHeight: 'auto', //最大高度
            isManage: '1', //是否可操作
            nodeStart: '0', //初始节点
            firstNodeSet: { 'add': '1', 'edit': '1', 'del': '0', 'up': '0', 'down': '0', 'icon': '1' }, //初始节点编辑项
            isSet: '0', //是否编辑
            isCkBox: '0', //是否有复选框
            isCkBoxClick: '1', //复选框
            isFirstClick: '0', //是否初始化选中
            isLastClick: '0', //最后一个选中
            isSelTree: '0', //是否为下拉框树
            isNodeOpen: '0', //节点是否默认展开
            beforeData: null, //提供对外Data修改函数
            customData: null, //只加载自定义数据，不支持2级，如果不null不读接口，隐藏展开样式
            addPlaceholder: '请输入', //编辑时输入框内容
            draggable: { isdr: '0', isconfirm: '0', firstNodeMove: '1', callback: function(oldid, newid, func) {} }, //isdr是否拖拽  isconfirm是否提示
            add: null,
            edit: null,
            del: null,
            up: null,
            down: null,
            icon: null,
            addbefore: null,
            editbefore: null,
            click: function() {},
            finished: function() {}
        };
        if (op) {
            $.extend(this.opd, op);
        }
        this.getTreeType = function() {
            if (_self.opd.treeType == '1') {
                _self.opd.isSet = '1';
                _self.opd.isFirstClick = '1';
            }
            if (_self.opd.treeType == '2') {
                _self.opd.isFirstClick = '1';
            }
            if (_self.opd.treeType == '3') {
                _self.opd.isSelTree = '1'
            }
            if (_self.opd.treeType == '4') {
                _self.opd.isCkBox = '1';
            }
            if (_self.opd.treeType == '5') {
                _self.opd.isSelTree = '1';
            }
            if (_self.opd.isSet == '1') {
                //_self.opd.treeABC = '0';
            }
        };
        //树展现
        this.loadtree = function(pid, pcon, cFunc) {
            //映射id
            var args = {};
            if (_self.opd.treeMap.parentId) {
                args[_self.opd.treeMap.parentId] = pid;
            } else {
                args['pid'] = pid;
            }
            if (_self.opd.treeABC == '1') {
                args[_self.opd.treeMap.sort] = '1';
            }
            this.getTreeType();
            //加载树
            if (_self.opd.customData != null) { //自定义数据
                $('body').ourUnLoading();
                _self.loadtreefordata(pcon, _self.opd.customData);
                $(_self.opd.treeId).find('.curtree_name').css({
                    'margin': '1px 0px 1px 0px',
                    'display': 'block'
                });
                $(_self.opd.treeId).find('.kh_pic_no,.kh_pic').remove();
                $(_self.opd.treeId).find('.treelist_con').css('background', 'url()');
                if (cFunc) {
                    cFunc();
                }
            } else {
                require(this.opd.nettype).req(bjs._mainuri, bjs._pathuri, _self.opd.treeUrl, args, function(data, textStatus, xhr) {
                    var treeList = _self.opd.beforeData ? _self.opd.beforeData(data, _self) : data;
                    _self.loadtreefordata(pcon, treeList);
                    /*默认树节点全部展开*/
                    if (_self.opd.isNodeOpen == '1') {
                        pcon.find('.treelist_con').each(function() {
                            var _selfnodeopen = $(this);
                            setTimeout(function() {
                                _selfnodeopen.find('.kh_pic').click();
                                if (_selfnodeopen.find('.kh_pic').parent().hasClass('treelist_con_h')) {
                                    _selfnodeopen.find('.kh_pic').click();
                                }
                            }, 300);
                        });
                    }
                    if (cFunc) {
                        cFunc();
                    }
                    if (_self.opd.finished) {
                        _self.opd.finished();
                    }

                });
            }
        };
        this.loadtreefordata = function(pcon, treeList) {
            $.each(treeList, function() {
                if (this.isParent == undefined) {
                    this.isParent = '0';
                }
                if (this.isInner == undefined) {
                    this.isInner = '1';
                }
                //是否为叶子节点
                var haskh = (this.children_count != '0' ? '<span class="kh_pic"></span>' : '<span class="kh_pic_no"></span>');
                //是否有编辑
                var hasset = '',
                    isedit = '',
                    treeabc = '';
                if (_self.opd.isSet == '1') {

                    var c_add = '<span class="c_add" title="添加"></span>';
                    var c_edit = '<span class="c_edit" title="修改"></span>';
                    var c_del = '<span class="c_del" title="删除"></span>';
                    var c_up = '<span class="c_up" title="上移"></span>';
                    var c_down = '<span class="c_down" title="下移"></span>';
                    var c_icon = '<span class="c_icon" title="图标"></span>';
                    if (_self.opd.treeMap.parentId && this[_self.opd.treeMap.parentId] == 0) {
                        if (_self.opd.firstNodeSet.add == '0') { c_add = ''; }
                        if (_self.opd.firstNodeSet.edit == '0') { c_edit = ''; }
                        if (_self.opd.firstNodeSet.del == '0') { c_del = ''; }
                        if (_self.opd.firstNodeSet.up == '0') { c_up = ''; }
                        if (_self.opd.firstNodeSet.down == '0') { c_down = ''; }
                        if (_self.opd.firstNodeSet.icon == '0') { c_icon = ''; }
                    }
                    if (_self.opd.add == null) { c_add = ''; }
                    if (_self.opd.edit == null) { c_edit = ''; }
                    if (_self.opd.del == null) { c_del = ''; }
                    if (_self.opd.up == null) { c_up = ''; }
                    if (_self.opd.down == null) { c_down = ''; }
                    if (_self.opd.icon == null) { c_icon = ''; }
                    hasset = (this.isInner == '0' ? '' : c_add + c_edit + c_del + c_up + c_down + c_icon);
                    isedit = 'isedit';
                }
                //是否为下拉框的树,选中态区别
                var hassel = '';
                if (_self.opd.isSelTree == '1') {
                    hassel = ' treelist_con_fromsel'; //如果是下拉框，改变hover和选中态样式
                }
                //是否存在复选框
                var hasckbox = '',
                    curtree_ckbox_ck = '';
                if (_self.opd.isCkBox == '1') {
                    hasckbox = '<span class="c_name_ckbox"></span>';
                    //如果上级选中，下级所有选中
                    if (pcon.children('.curtree_name').eq(0).hasClass('curtree_ckbox_ck') && _self.opd.isCkBoxClick == '1') {
                        curtree_ckbox_ck = ' curtree_ckbox_ck';
                    }
                    if (_self.opd.treeDfids != '' && _self.opd.treeDfids != '-1') {
                        if (_self.opd.treeDfids.indexOf(this[_self.opd.treeMap.nodeId]) > -1) {
                            curtree_ckbox_ck = ' curtree_ckbox_ck';
                        }
                    }
                }
                if (this.isInner == '1' || this.isParent == '1') {
                    var can_t = '';
                    if (this.isInner == '0' || this.isCanModify == '0') {
                        can_t = 'can_t';
                    }
                    var nodeicons = '';
                    if (this[_self.opd.treeMap.nodeIcon] && this[_self.opd.treeMap.nodeIcon] != '') {
                        nodeicons = 'padding-left: 25px; background: url(' + this[_self.opd.treeMap.nodeIcon] + ') no-repeat left center;background-size:19px 19px';
                    }
                    if (_self.opd.treeABC == '1' && this.firstChar && this.firstChar != '') {
                        treeabc = '<span class="treeabc">' + this.firstChar + '</span>';
                    }
                    pcon.append('<div id="tree_' + this[_self.opd.treeMap.nodeId] + '" class="treelist_con treelist_con_h ' + hassel + '">' + haskh + '<div class="curtree_name ' + can_t + ' ' + curtree_ckbox_ck + ' ' + isedit + '" nodeId="' + this[_self.opd.treeMap.nodeId] + '">' + hasckbox + '<span class="c_name_span" title="' + this[_self.opd.treeMap.nodeName] + '" style="' + nodeicons + '">' + treeabc + this[_self.opd.treeMap.nodeName] + '</span>' + hasset + '<input class="c_name_text" type="text" value="' + this[_self.opd.treeMap.nodeName] + '"/>' + '</div>' + '</div>');
                    $(_self.opd.treeId).find('.curtree_name[nodeId="' + this[_self.opd.treeMap.nodeId] + '"]').data('ddl', this);
                    if (_self.opd.draggable.isdr == '1') {
                        _self.n_draggableAction.addDraggable($(_self.opd.treeId).find('.curtree_name[nodeId="' + this[_self.opd.treeMap.nodeId] + '"]'));
                    }

                }
            });
        };
        this.forTreeCk = function(d) {
            if (!d.parent().parent().hasClass('ourCurtree')) {
                var curname_all = d.parent().parent().find('.treelist_con .curtree_name').length;
                var curname_ck = d.parent().parent().find('.treelist_con .curtree_ckbox_ck').length;
                if (!d.parent().parent().find('.curtree_name').eq(0).hasClass('can_t')) {
                    if (curname_ck == curname_all) {
                        d.parent().parent().find('.curtree_name').eq(0).removeClass('curtree_ckbox_ck').removeClass('curtree_ckbox_ckpart').addClass('curtree_ckbox_ck');
                    } else if (curname_ck == 0) {
                        d.parent().parent().find('.curtree_name').eq(0).removeClass('curtree_ckbox_ck').removeClass('curtree_ckbox_ckpart');
                    } else {
                        d.parent().parent().find('.curtree_name').eq(0).removeClass('curtree_ckbox_ck').removeClass('curtree_ckbox_ckpart').addClass('curtree_ckbox_ckpart');
                    }
                }
                _self.forTreeCk(d.parent().parent().find('.curtree_name').eq(0));
            }
        }
        this.treeAction = {
            add: function(_selfre, id, data) {
                _selfre.parent().find('.c_name_span').html(_selfre.parent().find('.c_name_text').val());
                _selfre.parent().removeClass('editing').attr('nodeId', id).data('ddl', data);
                _selfre.parent().parent().attr('id', 'tree_' + id);
                _selfre.parent().parent().removeClass('treelist_con_add');
                if (_selfre.parent().parent().parent().find('.kh_pic').length == 0) {
                    _selfre.parent().parent().parent().children('.kh_pic_no').remove();
                    _selfre.parent().parent().parent().prepend('<span class="kh_pic"></span>');
                }
                _selfre.parent().parent().appendTo(_selfre.parent().parent().parent());
                _selfre.parent().click();
            },
            edit: function(_selfre) {
                _selfre.parent().find('.c_name_span').html(_selfre.parent().find('.c_name_text').val());
                _selfre.parent().removeClass('editing');
            },
            del: function(_selfre) {
                var parent_con = _selfre.parent().parent().parent();
                _selfre.parent().parent().remove();
                if (parent_con.find('.treelist_con').length == 0) {
                    parent_con.find('.kh_pic').remove();
                    parent_con.prepend('<span class="kh_pic_no"></span>');
                }
            },
            up: function(curtreeid) {
                var curtreenode = $(_self.opd.treeId + ' #tree_' + curtreeid);
                curtreenode.insertBefore(curtreenode.prev());
            },
            down: function(curtreeid) {
                var curtreenode = $(_self.opd.treeId + ' #tree_' + curtreeid);
                curtreenode.insertAfter(curtreenode.next());
            },
            icon: function(_selfre, iconuri) {
                if (iconuri == '') {
                    _selfre.children('.c_name_span').attr('style', '');
                } else {
                    _selfre.children('.c_name_span').css({ 'padding-left': '25px', 'background': 'url(' + iconuri + ') no-repeat left center', 'background-size': '19px 19px' });
                }
            }
        };
        this.n_draggable = function() {
            window.bjs.action = this.n_draggableAction;
        };
        this.n_draggableAction = {
            eleStartDrag: '',
            eleEndDrag: '',
            addDraggable: function(el) {
                _drself = this;
                el.attr('draggable', true);
                //阻止编辑时输入框拖拽
                el.find('.c_name_text').attr('draggable', true).bind('dragstart', function(e) {
                    return false;
                })
                //拖拽开始，作用于被拖拽元素
                el.bind('dragstart', function(e) {
                    eleStartDrag = $(this).attr('nodeid');
                    if (_self.opd.draggable.firstNodeMove && _self.opd.draggable.firstNodeMove == '0' && $(this).data('ddl').parentId == '0') {
                        bjs.msg('根节点不能更换');
                        return false;
                    }
                    if (!$(this).parent().hasClass('treelist_con_h')) {
                        $(this).parent().children('.kh_pic').click();
                    };
                });

                //进入目标元素 作用于目标元素
                el.bind('dragenter', function() {
                    $('.dragClass').removeClass('dragClass');
                    $(this).addClass('dragClass');
                    if ($(this).parent().hasClass('treelist_con_h') && $(this).attr('nodeid') != eleStartDrag) {
                        $(this).parent().children('.kh_pic').click();
                    };
                });

                //在目标容器中移动 作用于目标元素
                el.bind('dragover', function(e) {
                    event.preventDefault();
                });
                //离开目标元素 作用于目标元素
                el.bind('dragleave', function(e) {});
                //在目标容器中放下 作用于目标元素
                el.bind('drop', function(e) {
                    if (_self.opd.draggable.firstNodeMove && _self.opd.draggable.firstNodeMove == '0' && $(this).data('ddl').parentId == '0' && $(this).parent().find('#tree_' + eleStartDrag).length == 0) {
                        bjs.msg('根节点不能更换');
                        return false;
                    }
                    eleStartDrop = $(this).attr('nodeid');
                    if (eleStartDrag != eleStartDrop && $(this).parent().children('#tree_' + eleStartDrag).length == 0) {
                        if (_self.opd.draggable.isconfirm == '1') {
                            bjs.confirm('提示', '<div align="left">【' + $(_self.opd.treeId + ' .curtree_name[nodeid="' + eleStartDrag + '"]>.c_name_span').attr('title') + '】<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓将移至↓<br/>【' + $(this).children('.c_name_span').attr('title') + '】</div>', function() {
                                if (_self.opd.draggable.callback) {
                                    _self.opd.draggable.callback(eleStartDrag, eleStartDrop, function() {
                                        var _curparent = $(_self.opd.treeId + ' #tree_' + eleStartDrag).parent();
                                        $(_self.opd.treeId + ' #tree_' + eleStartDrag).appendTo(_self.opd.treeId + ' #tree_' + eleStartDrop);
                                        $(_self.opd.treeId + ' #tree_' + eleStartDrop).children('.kh_pic_no').addClass('kh_pic').removeClass('kh_pic_no');
                                        if (_curparent.find('.treelist_con').length == 0) {
                                            _curparent.children('.kh_pic').addClass('kh_pic_no').removeClass('kh_pic');
                                        }
                                    });
                                } else {
                                    _drself.callbacks($(this), eleStartDrop);
                                }
                            }, function() {});
                        } else {
                            if (_self.opd.draggable.callback) {
                                _self.opd.draggable.callback(eleStartDrag, eleStartDrop, function() {
                                    $(_self.opd.treeId + ' #tree_' + eleStartDrag).appendTo(_self.opd.treeId + ' #tree_' + eleStartDrop);
                                    $(_self.opd.treeId + ' #tree_' + eleStartDrop).children('.kh_pic_no').addClass('kh_pic').removeClass('kh_pic_no');
                                    if (_curparent.find('.treelist_con').length == 0) {
                                        _curparent.children('.kh_pic').addClass('kh_pic_no').removeClass('kh_pic');
                                    }
                                });
                            } else {
                                _drself.callbacks($(this), eleStartDrop);
                            }
                        }
                    }
                });
                //拖拽结束，作用于被拖拽元素
                el.bind('dragend', function(e) {
                    $('.dragClass', 'body').removeClass('dragClass');
                });
            },
            callbacks: function(obj, eleStartDrop) {
                if (_self.opd.draggable.isconfirm == '1') {
                    bjs.confirm('提示', '<div align="left">【' + $(_self.opd.treeId + ' .curtree_name[nodeid="' + eleStartDrag + '"]>.c_name_span').attr('title') + '】<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓将移至↓<br/>【' + obj.children('.c_name_span').attr('title') + '】</div>', function() {
                        $(_self.opd.treeId + ' #tree_' + eleStartDrag).appendTo(_self.opd.treeId + ' #tree_' + eleStartDrop);
                    }, function() {});
                } else {
                    $(_self.opd.treeId + ' #tree_' + eleStartDrag).appendTo(_self.opd.treeId + ' #tree_' + eleStartDrop);
                }
            }
        };
        //事件绑定
        this.n_clickBind = function() {
            //节点点击事件绑定
            $(_self.opd.treeId).off('click', '.curtree_name').on('click', '.curtree_name', function() {
                if (_self.opd.isManage == '0') {
                    return false;
                }
                if (!$(this).hasClass('can_t')) {
                    if (_self.opd.isCkBox == '1') { //带复选框的树
                        if ($(this).hasClass('curtree_ckbox_ck') || $(this).hasClass('curtree_ckbox_ckpart')) {
                            if (_self.opd.isCkBoxClick == '1') {
                                $(this).parent().find('.curtree_name').removeClass('curtree_ckbox_ck').removeClass('curtree_ckbox_ckpart');
                                //递归选中态
                                _self.forTreeCk($(this));
                            } else {
                                $(this).removeClass('curtree_ckbox_ck').removeClass('curtree_ckbox_ckpart');
                            }
                            if (_self.opd.click) {
                                _self.opd.click($(this).data('ddl'), '0');
                            }

                        } else {
                            if (_self.opd.isCkBoxClick == '1') {
                                $(this).parent().find('.curtree_name').addClass('curtree_ckbox_ck');
                                //递归选中态
                                _self.forTreeCk($(this));
                            } else {
                                $(this).addClass('curtree_ckbox_ck');
                            }
                            if (_self.opd.click) {
                                _self.opd.click($(this).data('ddl'), '1');
                            }

                        }
                    } else {
                        $(_self.opd.treeId + ' .curtree_name').removeClass('curtree_ck');
                        $(this).addClass('curtree_ck');
                        if (_self.opd.click) {
                            _self.opd.click($(this).data('ddl'));
                        }
                    }
                }
                return false;
            });
            //树结构展开
            $(_self.opd.treeId).off('click', '.kh_pic').on('click', '.kh_pic', function() {
                if ($(this).parent().hasClass('treelist_con_h')) {
                    $(this).parent().removeClass('treelist_con_h');
                    if ($(this).parent().find('.treelist_con').length == 0) {
                        var _selfre = $(this);
                        //loading
                        _selfre.parent().find('.c_t_load').remove();
                        _selfre.after('<span class="c_t_load"></span>');
                        _selfre.parent().find('.c_t_load').treeLoading({});
                        //加载树
                        _self.loadtree(_selfre.parent().find('.curtree_name').attr('nodeId'), $(this).parent(), function() {
                            if (_selfre.attr('ispd')) {
                                _selfre.removeAttr('ispd');
                                var canTreeName = $(_selfre.next().next().find('.curtree_name')[0]);
                                var canTreeNamelast = _selfre.next().next().find('.curtree_name').last();
                                if (canTreeName.hasClass('can_t')) {
                                    canTreeName.prev().attr('ispd', '1');
                                    canTreeName.prev().click();
                                } else {
                                    if (_self.opd.isFirstClick == '1') {
                                        canTreeName.click();
                                    }
                                    if (_self.opd.isLastClick == '1') {
                                        canTreeNamelast.click();
                                    }
                                }
                            }
                        });
                    }
                } else {
                    $(this).parent().addClass('treelist_con_h');
                }
            });
            //增
            $(_self.opd.treeId).off('click', '.c_name_text').on('click', '.c_name_text', function() {
                return false;
            });
        };
        this.w_clickBind = function() {
            //增
            $(_self.opd.treeId).off('click', '.c_add').on('click', '.c_add', function() {
                var _selfre = $(this);
                if (_self.opd.treeMode == "1") {
                    _selfre.parent().parent().find('.kh_pic').first().click();
                    $('.treelist_con_add').remove();

                    var c_add = '',
                        c_edit = '',
                        c_del = '',
                        c_up = '',
                        c_down = '',
                        c_icon = '';
                    if (_self.opd.isSet == '1') {
                        var c_add = '<span class="c_add" title="添加"></span>';
                        var c_edit = '<span class="c_edit" title="修改"></span>';
                        var c_del = '<span class="c_del" title="删除"></span>';
                        var c_up = '<span class="c_up" title="上移"></span>';
                        var c_down = '<span class="c_down" title="下移"></span>';
                        var c_icon = '<span class="c_icon" title="图标"></span>';

                        if (_self.opd.add == null) { c_add = ''; }
                        if (_self.opd.edit == null) { c_edit = ''; }
                        if (_self.opd.del == null) { c_del = ''; }
                        if (_self.opd.up == null) { c_up = ''; }
                        if (_self.opd.down == null) { c_down = ''; }
                        if (_self.opd.icon == null) { c_icon = ''; }
                    }

                    var newNode_add = $('<div class="treelist_con treelist_con_h treelist_con_add">' + '<span class="kh_pic_no"></span>' + '<div class="curtree_name editing" nodeId="add"><span class="c_name_span">new node</span>' + c_add + c_edit + c_del + c_up + c_down + c_icon + '<input class="c_name_text" placeholder="' + _self.opd.addPlaceholder + '" type="text"/>' + '</div>' + '</div>');
                    $(_selfre.parent().parent().removeClass('treelist_con_h').find('.curtree_name')[0]).after(newNode_add);
                    if (_self.opd.draggable.isdr == '1') {
                        _self.n_draggableAction.addDraggable(newNode_add.find('.curtree_name'));
                    }
                    _selfre.parent().next().find('.c_name_text').select();
                } else {
                    _selfre.parent().parent().find('.kh_pic').first().click();
                    _selfre.parent().parent().removeClass('treelist_con_h');
                    _self.opd.addbefore(_selfre.parent().attr('nodeId'));
                }
                return false;
            });
            //改
            $(_self.opd.treeId).off('click', '.c_edit').on('click', '.c_edit', function() {
                if (_self.opd.treeMode == "1") {
                    $(this).parent().addClass('editing');
                    $(this).parent().find('.c_name_text').select();
                } else {
                    _self.opd.editbefore($(this).parent().attr('nodeId'));
                }
                return false;
            });
            //图标
            $(_self.opd.treeId).off('click', '.c_icon').on('click', '.c_icon', function(e) {
                var config = _self,
                    parentEl = $(this).parent(),
                    nodeId = $(this).parent().attr('nodeid'),
                    parentData = parentEl.data('ddl');
                config.opd.icon(config, parentEl, nodeId, parentData, e);
                return false;
            });
            //上移
            $(_self.opd.treeId).off('click', '.c_up').on('click', '.c_up', function(e) {
                var config = _self,
                    parentEl = $(this).parent(),
                    nodeId = $(this).parent().attr('nodeid'),
                    parentData = parentEl.data('ddl');
                if ($(this).parent().parent().prev().hasClass('treelist_con')) {
                    var newNodeId = $(this).parent().parent().prev().children('.curtree_name').attr('nodeid');
                    config.opd.up(config, nodeId, newNodeId);
                } else {
                    bjs.msg('已在顶部位置')
                }
                return false;
            });
            //下移
            $(_self.opd.treeId).off('click', '.c_down').on('click', '.c_down', function(e) {
                var config = _self,
                    parentEl = $(this).parent(),
                    nodeId = $(this).parent().attr('nodeid'),
                    parentData = parentEl.data('ddl');
                if ($(this).parent().parent().next().hasClass('treelist_con')) {
                    var newNodeId = $(this).parent().parent().next().children('.curtree_name').attr('nodeid');
                    config.opd.down(config, nodeId, newNodeId);
                } else {
                    bjs.msg('已在底部位置')
                }
                return false;
            });
            //改和增--确定
            $(_self.opd.treeId).off('blur', '.c_name_text').on('blur', '.c_name_text', function() {
                var _selfre = $(this);
                if (_selfre.parent().attr('nodeId') == "add") {
                    //加
                    if ($.trim(_selfre.val()) == '') {
                        _selfre.parent().parent().remove();
                    } else {
                        if (!_self.opd.add) return;
                        var config = _self,
                            parentEl = _selfre.parent().parent().parent().find('.curtree_name'),
                            parentData = parentEl.data('ddl'),
                            text = _selfre.val(),
                            parentId = parentEl.attr('nodeId');
                        config.opd.add(config, text, _selfre, parentId, parentEl, parentData);
                    }
                } else {
                    //改
                    if ($.trim(_selfre.val()) == '') {
                        _selfre.parent().removeClass('editing');
                    } else {
                        if (!_self.opd.edit) return;
                        var config = _self,
                            text = _selfre.val(),
                            nodeId = _selfre.parent().attr('nodeId');
                        config.opd.edit(config, text, _selfre, nodeId);
                    }
                }
                return false;
            });
            $(_self.opd.treeId).off('keydown', '.c_name_text').on('keydown', '.c_name_text', function(e) {
                if (e.keyCode == 13) {
                    $(this).blur();
                }
            });
            //删
            $(_self.opd.treeId).off('click', '.c_del').on('click', '.c_del', function() {
                var _selfre = $(this);
                bjs.confirm('提示', '确定要删除吗', function() {
                    if (!_self.opd.del) return;
                    var config = _self,
                        nodeId = _selfre.parent().attr('nodeId');
                    config.opd.del(config, _selfre, nodeId);
                }, function() {});
                return false;
            });
        }
    };
    module.exports = {
        load: function(op) {
            var newtree = new tree(op);
            $(newtree.opd.treeId).html('').removeClass('ourCurtree');
            $(newtree.opd.treeId).addClass('ourCurtree').css({
                'max-height': newtree.opd.maxHeight + 'px',
                'overflow': 'auto'
            });
            $(newtree.opd.treeId).treeLoading({});
            newtree.n_clickBind();
            newtree.w_clickBind();
            newtree.loadtree(newtree.opd.nodeStart, $(newtree.opd.treeId), function() {
                var canTreeName = $($(newtree.opd.treeId).find('.curtree_name')[0]);
                var canTreeNamelast = $(newtree.opd.treeId).find('.curtree_name').last();
                if (canTreeName.hasClass('can_t')) {
                    canTreeName.prev().attr('ispd', '1');
                    canTreeName.prev().click();
                } else {
                    if (newtree.opd.isFirstClick == '1') {
                        canTreeName.click();
                    }
                    if (newtree.opd.isLastClick == '1') {
                        canTreeNamelast.click();
                    }
                }
            });
            if (newtree.opd.draggable.isdr == '1') {
                newtree.n_draggable();
            }
        }
    };
});