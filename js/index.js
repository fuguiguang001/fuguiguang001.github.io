var groupId = 1; // 分组id
var dropGroup = false; // 拖拽分组开关


var cy = cytoscape({
    // 容器
    container: $('#topologyBody'),
    // 节点数组
    elements: [],
    // 设置节点、线、组样式
    style: [{
            /**
             * 节点基本样式（未选择）
             */
            selector: 'node',
            style: {
                'label': 'data(name)',
                'width': 50,
                'height': 50,
                'text-halign': "center",
                'text-valign': "bottom",
                'background-opacity': 0,
                'background-width': 40,
                'background-height': 40,
                'background-repeat': 'no-repeat',
                'background-clip': 'none',
                'font-size': '12'
            },
        },
        {
            selector: 'node.1-1',
            style: {
                'background-image': 'url(../image/icon_access_switch.png)'
            }
        },
        {
            selector: 'node.1-2',
            style: {
                'background-image': 'url(../image/icon_convergence_switch.png)'
            }
        },
        {
            selector: 'node.1-3',
            style: {
                'background-image': 'url(../image/icon_core_switch.png)'
            }
        },
        {
            selector: 'node.1-4',
            style: {
                'background-image': 'url(../image/icon_router.png)'
            }
        },
        {
            /**
             * 节点基本样式（已选择）
             */
            selector: 'node:selected',
            style: {
                'color': '#ff7800',
            },
        },
        {
            /**
             * 节点搜索高亮样式
             */
            selector: 'node.searchHighlight',
            style: {
                // 'color': '#ff7800',
                // 'background-width': 50,
                // 'background-height': 50,
                // 'transition-property': 'color, background-width, background-height',
                // 'transition-duration': '0.5s'
                'opacity': 0
            },
        },
        {
            /**
             * 连线基本样式（未选择）
             * curve-style 线的样式
             * line-style （实线、虚线）
             * target-arrow-shape 箭头展示样式
             * 以下配合 'line-style': 'dashed' 生效
             * line-dash-pattern: dashed 指定线条和间隙交替长度的线条图案
             * line-dash-offset 线偏移
             */
            selector: 'edge',
            style: {
                'curve-style': 'haystack',
                // 'target-arrow-shape': 'triangle'
            }
        },
        {
            /**
             * 连线动画
             */
            selector: 'edge.AnimEdge',
            style: {
                'curve-style': 'haystack',
                'line-style': 'dashed',
                'line-dash-pattern': [10, 2],
                'line-dash-offset': 0,
                'line-color': '#f00',
                // 'target-arrow-shape': 'triangle'
            }
        },
        {
            /**
             * 连线样式（目标节点）
             */
            selector: '.eh-target',
            style: {
                'border-width': 2,
                'border-color': '#409eff'
            }
        },
        {
            /**
             * 分组基本样式
             */
            selector: ':parent',
            style: {
                'text-valign': 'top',
                'text-halign': 'center',
                'background-opacity': 0.2,
            }
        },
        {
            /**
             * 拖拽进分组样式
             */
            selector: '.cdnd-drop-target',
            style: {
                'border-color': 'red',
                'border-style': 'dashed'
            }
        },
        {
            /**
             * 分组折叠后样式
             * shape - 展示形状
             */
            selector: 'node.cy-expand-collapse-collapsed-node',
            style: {
                'width': 70,
                'height': 70,
                'background-opacity': 1,
                'background-color': 'red',
                "shape": "rectangle"
            }
        }

    ],
    // 交互时隐藏连线
    hideEdgesOnViewport: false,
    /**
     * 布局相关
     * preset
     * cytoscape-ngraph.forcelayout
     */
    layout: {
        name: 'preset',
        rows: 1,
        roots: '#a',
        directed: true
    }
});


// 测试性能
// let classArr = ['1-1', '1-1', '1-2', '1-3', '1-4']
// for (let i = 1; i < 1000; i++) {
//     cy.add([{
//             group: 'nodes',
//             data: {
//                 id: 'one'+ i,
//                 name: 'one'+ i
//             },
//             position: {
//                 x: Math.floor(Math.random() * (3000 - -3000 + 1)) + -3000,
//                 y: Math.floor(Math.random() * (3000 - -3000 + 1)) + -3000
//             },
//             classes: classArr[Math.floor(Math.random() * 4) + 1]
//         },
//         {
//             group: 'nodes',
//             data: {
//                 id: 'two'+ i,
//                 name: 'two'+ i
//             },
//             position: {
//                 x: Math.floor(Math.random() * (3000 - -3000 + 1)) + -3000,
//                 y: Math.floor(Math.random() * (3000 - -3000 + 1)) + -3000
//             },
//             classes: classArr[Math.floor(Math.random() * 4) + 1]
//         },
//         {
//             group: 'edges',
//             data: {
//                 id: 'line'+ i,
//                 source: 'one'+ i,
//                 target: 'two'+ i
//             }
//         }
//     ]);
// }



/** ================================ 基础功能开始 =============================== */

// 点击添加高亮
$('.function i.clickI').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
})

// 拖动添加节点
let nodeInfo = {};
let nodeAll = document.querySelectorAll('.listNode');
nodeAll.forEach(ele => {
    ele.ondragstart = function (e) {
        nodeInfo['image'] = e.target.querySelector('img').getAttribute('src')
        nodeInfo['label'] = e.target.querySelector('span').innerHTML
        nodeInfo['class'] = e.target.getAttribute('data-class')
    };
})

cy.on('drop', function (e) {
    addNode(e.position.x, e.position.y);
})

// 设置分组
$('#groupInput').on('keypress', function (e) {
    if (e.which === 13 && $.trim($(this).val()) != '') {
        groupId++;
        cy.add([{
            group: 'nodes',
            data: {
                id: 'group' + groupId,
                name: $('#groupInput').val()
            }
        }])
        cy.$(':selected').forEach(ele => {
            // 如果节点不是分组节点
            if (!ele.isParent()) {
                ele.move({
                    parent: 'group' + groupId
                });
            }
        })
    }
})

// 右键菜单
cy.on('cxttap', function (event) {
    // 解除修改文案监听事件
    $('#changeTextInput').off('keypress');
    // 判断如果是分组
    if (event.target.isParent && event.target.isParent()) {
        contextMenu.showMenuItem('moveGroup');
    } else {
        contextMenu.hideMenuItem('moveGroup');
    }
});

// 当节点从分组中被拖拽离开时触发
cy.on('cdndout', function (event, dropTarget) {
    // 删除空分组
    if (dropTarget.isChildless()) {
        dropTarget.remove();
    }
})

/**
 * 搜索节点功能
 */

document.querySelector('#nodeInput').addEventListener('keypress', function (event) {
    if (event.which == 13) {
        var nodeVal = event.target.value;
        if (nodeVal != '') {
            var numTimes = 1;
            var setInt= null;
            var searchNode = cy.nodes().filter(function(ele) {
                return ele.data('name') == nodeVal;
            });
            setInt = setInterval(() => {
                numTimes ++;
                if(numTimes >= 5){
                    clearInterval(setInt);
                }
                searchNode.toggleClass('searchHighlight');
            }, 500);
            
        }
    }
})

/** ================================ 基础功能结束 =============================== */


/** ================================ 扩展插件开始 =============================== */

/**
 * 连线功能
 * snap:true，启用时，只需靠近目标节点即可绘制边（在复合图上可能会混淆）
 * canConnect 是否可以连线
 * edgeParams 用于指定源和目标之间的边 
 */
var eh = cy.edgehandles({
    snap: false,
    canConnect: function (sourceNode, targetNode) {
        return true;
    },
    edgeParams: function (sourceNode, targetNode) {
        return {};
    }
});

/**
 * 鹰眼功能
 * 如果节点数量超过1500，将隐藏鹰眼功能
 */
if (cy.elements().length < 1500) {
    cy.navigator({
        container: false, // 容器ID，设置false将自动生成容器
        viewLiveFramerate: false, // 是否同步执行更新图形
    });
} else {
    cy.navigator().destroy();
}

// 复制粘贴
var cb = cy.clipboard();
document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.target.nodeName === 'BODY') {
        if (e.which == 67) {
            cy.clipboard().copy(cy.$(":selected"));
        } else if (e.which == 86) {
            cy.clipboard().paste()
        }
    } else if (e.which == 65) {
        cy.elements().select();
        e.preventDefault();
    }
});

/**
 * 分组折叠展开 
 * fisheye: true 是否在展开/折叠后执行鱼眼视图您也可以指定一个函数
 * animate: true，//是否在图形更改时设置动画也可以指定函数
 * animationDuration:1000，//当animation为true时，动画的持续时间（以毫秒为单位）
 */

var cyExpandCollapse = cy.expandCollapse({
    layoutBy: {
        name: "preset",
        randomize: false,
        fit: true
    },
    fisheye: true,
    animate: true,
    undoable: false,
    expandCueImage: "icon-plus.png",
    collapseCueImage: "icon-minus.png"
});

// document.getElementById("collapseRecursively").addEventListener("click", function () {
//     cyExpandCollapse.collapseRecursively(cy.$(":selected"));
// });

// document.getElementById("expandRecursively").addEventListener("click", function () {
//     cyExpandCollapse.expandRecursively(cy.$(":selected"));
// });

// document.getElementById("collapseAll").addEventListener("click", function () {
//     cyExpandCollapse.collapseAll();
// });

// document.getElementById("expandAll").addEventListener("click", function () {
//     cyExpandCollapse.expandAll();
// });


// 拖拽添加分组
var dragNodeGroup = cy.compoundDragAndDrop();
dragNodeGroup.disable();

/**
 * 右键菜单
 * id 菜单项ID
 * content 菜单项显示名称
 * selector 应用于哪种元素（可选node, edge）
 * onClickFunction 点击后执行函数
 * disabled 是否禁止使用
 * show 是否显示
 * submenu 子菜单
 */
var contextMenu = cy.contextMenus({
    menuItems: [{
            id: 'remove',
            content: '删除节点',
            tooltipText: '删除节点',
            selector: 'node, edge',
            onClickFunction: function (event) {
                var target = event.target || event.cyTarget;
                removed = target.remove();
            },
            hasTrailingDivider: true
        },
        {
            id: 'line-color',
            content: '颜色',
            tooltipText: '颜色',
            selector: 'edge',
            hasTrailingDivider: true,
            submenu: [{
                    id: 'color-blue',
                    content: '蓝色',
                    tooltipText: '蓝色',
                    onClickFunction: function (event) {
                        let target = event.target || event.cyTarget;
                        target.style('line-color', 'blue');
                    },
                    submenu: [{
                            id: 'color-light-blue',
                            content: '浅蓝',
                            tooltipText: '浅蓝',
                            onClickFunction: function (event) {
                                let target = event.target || event.cyTarget;
                                target.style('line-color', 'lightblue');
                            },
                        },
                        {
                            id: 'color-dark-blue',
                            content: '深蓝',
                            tooltipText: '深蓝',
                            onClickFunction: function (event) {
                                let target = event.target || event.cyTarget;
                                target.style('line-color', 'darkblue');
                            },
                        },
                    ],
                },
                {
                    id: 'color-green',
                    content: '绿色',
                    tooltipText: '绿色',
                    onClickFunction: function (event) {
                        let target = event.target || event.cyTarget;
                        target.style('line-color', 'green');
                    },
                }
            ]
        },
        {
            id: 'line-style',
            content: '线',
            tooltipText: '线',
            selector: 'edge',
            hasTrailingDivider: true,
            submenu: [{
                    id: 'line-solid',
                    content: '实线',
                    tooltipText: '实线',
                    onClickFunction: function (event) {
                        let target = event.target || event.cyTarget;
                        target.style('line-style', 'solid');
                    }
                },
                {
                    id: 'line-dashed',
                    content: '虚线',
                    tooltipText: '虚线',
                    onClickFunction: function (event) {
                        let target = event.target || event.cyTarget;
                        target.style('line-style', 'dashed');
                    },
                }
            ]
        },
        {
            id: 'textPosition',
            content: '文字位置',
            tooltipText: '文字位置',
            selector: 'node',
            hasTrailingDivider: true,
            submenu: [{
                    id: 'textTopCenter',
                    content: '顶部居中',
                    tooltipText: '顶部居中',
                    onClickFunction: function (event) {
                        let target = event.target || event.cyTarget;
                        target.style({
                            'text-halign': 'center',
                            'text-valign': 'top'
                        });
                    }
                },
                {
                    id: 'textCenter',
                    content: '居中',
                    tooltipText: '居中',
                    onClickFunction: function (event) {
                        let target = event.target || event.cyTarget;
                        target.style({
                            'text-halign': 'center',
                            'text-valign': 'center'
                        });
                    }
                },
                {
                    id: 'textBottomCenter',
                    content: '底部居中',
                    tooltipText: '底部居中',
                    onClickFunction: function (event) {
                        let target = event.target || event.cyTarget;
                        target.style({
                            'text-halign': 'center',
                            'text-valign': 'bottom'
                        });
                    }
                }
            ]
        },
        {
            id: 'changeText',
            content: '修改节点文字',
            tooltipText: '修改节点文字',
            selector: 'node, edge',
            hasTrailingDivider: true,
            onClickFunction: function (event) {
                var target = event.target || event.cyTarget;
                let posi = event.position || event.cyPosition;
                $('#changeTextInput').css({
                    'left': posi.x,
                    'top': posi.y
                })
                $('#changeTextInput').show();
                $('#changeTextInput').on('keypress', function (e) {
                    if (e.which === 13) {
                        if ($.trim($(this).val()) == '') {
                            $('#changeTextInput').hide();
                            return;
                        } else {
                            target.style({
                                'label': $.trim($(this).val())
                            });
                            $('#changeTextInput').val('');
                            $('#changeTextInput').hide();
                        }
                    }
                })

            },
        },
        {
            id: 'moveGroup',
            content: '分组拆解',
            tooltipText: '分组拆解',
            selector: 'node',
            hasTrailingDivider: true,
            onClickFunction: function (event) {
                event.target.children().forEach(ele => {
                    ele.move({
                        parent: null
                    });
                })
                // 删除空分组
                event.target.remove();
            },
        }
    ],
    menuItemClasses: ['custom-menu-item'], // 菜单每一项目 class
    contextMenuClasses: ['custom-context-menu'] // 菜单盒子 class
});


/** ================================ 扩展插件结束 =============================== */


/** ================================ 功能函数开始 =============================== */

// 添加元素
function addNode(x, y) {
    cy.add([{
        group: 'nodes',
        data: {
            name: nodeInfo['label'],
            customData: {
                'time': '2023年11月01日17:13:28',
                'company': '北京永信至诚科技股份有限公司'
            }
        },
        position: {
            x,
            y
        },
        classes: [nodeInfo['class']]
    }])
}

/**
 * 操作模式
 * 1、正常模式
 * 2、框选模式
 * panningEnabled - 移动模式
 * boxSelectionEnabled - 框选模式
 */
function changeModeType(type) {
    if (type === 1) {
        cy.panningEnabled(true);
        cy.boxSelectionEnabled(false);
        eh.disableDrawMode();
    } else if (type === 2) {
        cy.panningEnabled(false);
        cy.boxSelectionEnabled(true);
        eh.disableDrawMode();
    } else if (type === 3) {
        eh.enableDrawMode()
    }

}

// 放大
function scalingBig() {
    cy.zoom(cy.zoom() + 0.05);
}

// 缩小
function scalingSmall() {
    cy.zoom(cy.zoom() - 0.05);
}

// 删除 or 清空
function deleteSelectedNodes() {
    if (cy.$(':selected').length) {
        cy.$(':selected').remove();
    } else {
        cy.remove(cy.$())
    }
}

// 导出数据
function exportData() {
    if (!cy.$().length) {
        return;
    }
    let png64 = cy.png();
    let link = document.createElement('a');
    link.href = png64;
    link.download = "download.png";
    link.click();

    /**
     * 原导出json数据
     */
    // let json = JSON.stringify(cy.json());
    // let filename = 'topoJson.json';
    // let blob = new Blob([json], {
    //     type: 'text/json'
    // });
    // let link2 = document.createElement('a');
    // let e = new MouseEvent('click');
    // link2.download = filename;
    // link2.href = window.URL.createObjectURL(blob);
    // link2.dispatchEvent(e);

    /**
     * 分组折叠展开导出json数据
     */
    cyExpandCollapse.saveJson()
}

// 上传json
function uploadjsonfile(e) {
    var json = e.target.files[0];
    if (json) {
        var reader = new FileReader();
        reader.onload = function () {
            // cy.json(JSON.parse(this.result));
            cyExpandCollapse.loadJson(this.result)
        }
        reader.readAsText(json);
    }
}

// 开启&关闭拖拽分组
function startDropGroup() {
    if (dropGroup) {
        dropGroup = false;
        dragNodeGroup.disable();
        $('#startDropGroup').html('开启拖拽分组');
    } else {
        dropGroup = true;
        dragNodeGroup.enable();
        $('#startDropGroup').html('关闭拖拽分组');
    }
}

/** ================================ 功能函数结束 =============================== */





/**
 * 动画函数
 */

const loopAnimation = (ele, i, time) => {
    console.log(i);
    const offset = {
        style: {
            'line-dash-offset': -20 * i
        }
    };
    const OldOffset = {
        style: {
            'line-dash-offset': 0
        }
    };
    const duration = {
        duration: 1000
    };
    ele.animation(offset, duration).play()
        .promise('completed')
        .then(() => {
            time = time - 1000;
            if (time == 0) {
                ele.animation(OldOffset, duration).stop();
                ele.style({
                    "line-dash-offset": "0"
                })
                return;
            } else {
                loopAnimation(ele, i + 1, time)
            }
        });
};

function startAnimations() {
    // var reds = cy.edges().filter(function (ele) {
    //     return ele.data('color') == 'red';
    // });

    cy.edges().forEach((edge, i) => {
        edge.flashClass('AnimEdge', (i + 1) * 5000);
        loopAnimation(edge, 1, (i + 1) * 5000);
    });
}