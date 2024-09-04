// 任务卡，收集任务卡，分为南方任务女方任务，分为疼痛和取悦和高潮控制等等分类，分为难度（修改数字，惩罚/奖励），分为阶段任务。
// 开始之前的飞行棋调试，可以选定难度，玩家名字，任务类别（百分比），棋盘大小，飞行棋款式，终点内容，冲刺内容，任务黑名单,(全随机模式)。
// todo
// 确定棋盘大小，格子的位置和属性配置（开始格，终点，冲刺格）
// 确定任务内容，任务配置格式语法，任务配图。生成任务界面（测试）
// 确定棋子动画

const mission_raw = raw_data

// let player_name = ['世', '盼']
const player_name = mission_raw['meta']['player_name']

let size_65_map_rule = {

    'title_posotion': [220, 415], //标题高度，副标题高度
    'boxsize': [97, 97],
    'start_b': 1,
    'start_g': 27, //开始
    'close_to_end_b': [50, 53, 54, 55, 56, 58],
    'close_to_end_g': [24, 65, 63, 62, 61, 60], //冲刺
    'end': 59, //终点
    'back_b': 57, //后退6格
    'back_g': 64,
    'hover_show_left': [22, 23, 24, 25, 26],
    'hover_show_right': [48, 49, 50, 51, 52],
    'hover_show_up': [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
    'hover_show_down': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65],
    'hover_show_cornor': [1, 21, 47, 27] //左上右上左下右下

}
const ABOUT =
    '<br>关于飞行棋：<br>本飞行棋模拟器由马卡龙制作且开源。<br> github: <a href="www.baidu.com">www.baidu.com</a>'


let randomSortArray = (arr)=>{
    let slack = []
    while(arr.length){
        let index = parseInt(Math.random()*arr.length);
        slack.push(arr[index])
        arr.splice(index,1)
    }
    return slack
}

let fromRawToData = (raw)=>{
    let mission_meta = {'meta':{},'mission':{}}
    mission_meta['meta'] = raw['meta']
    let mission_level1 = randomSortArray(raw['mission']['mission_level1'])
    let mission_level2_b = randomSortArray(raw['mission']['mission_level2_b'])
    let mission_level2_g = randomSortArray(raw['mission']['mission_level2_g'])
    let mission_win = raw['mission']['mission_win']
    let missionlist = [...mission_level1,...mission_level2_b,...mission_win,...mission_level2_g]
    missionlist.splice(23,0,['红方向左前进一格', '蓝方顺时针前进一格'])
    missionlist.splice(49,0,['蓝方向右前进一格', '红方顺时针前进一格'])
    missionlist.splice(56,0,['后退六格', '与胜利失之交臂'],)
    missionlist.splice(63,0,['后退六格', '与胜利失之交臂'])
    mission_meta['mission'] = missionlist
    return mission_meta
}

const mission_meta = fromRawToData(mission_raw)


let size_65_map = [ //top,left
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 3],
    [2, 4],
    [2, 5],
    [1, 5],
    [1, 6],
    [1, 7],
    [2, 7],
    [2, 8],
    [2, 9],
    [1, 9],
    [1, 10],
    [1, 11],
    [2, 11],
    [2, 12],
    [2, 13],
    [1, 13],
    [1, 14],
    [1, 15],
    [2, 15],
    [3, 15],
    [4, 15],
    [5, 15],
    [6, 15],
    [7, 15],
    [7, 14],
    [7, 13],
    [6, 13],
    [6, 12],
    [6, 11],
    [7, 11],
    [7, 10],
    [7, 9],
    [6, 9],
    [6, 8],
    [6, 7],
    [7, 7],
    [7, 6],
    [7, 5],
    [6, 5],
    [6, 4],
    [6, 3],
    [7, 3],
    [7, 2],
    [7, 1],
    [6, 1],
    [5, 1],
    [4, 1],
    [3, 1],
    [2, 1],
    [4, 2],
    [4, 3],
    [4, 4],
    [4, 5],
    [4, 6],
    [4, 7],
    [4, 8],
    [4, 14],
    [4, 13],
    [4, 12],
    [4, 11],
    [4, 10],
    [4, 9]
]

const map_rule = size_65_map_rule

const map = size_65_map

let getPositionFromId = (id) => {
    let top = (map[id - 1][0] - 1) * (map_rule['boxsize'][0])
    let left = (map[id - 1][1] - 1) * (map_rule['boxsize'][1])
    return [top, left, `top:${top}px;left:${left}px;`]
}

let getMissionFromId = (id) => {
    return mission_meta['mission'][id - 1]
}
let mission_html = (content, id, position) => {
    // if content.length
    return `<div style="top:
    ${(position[0]-1)*(map_rule['boxsize'][0])}px;left:
    ${(position[1]-1)*(map_rule['boxsize'][1])}px;width:
    ${(map_rule['boxsize'][0]).toString()}px;height:
    ${(map_rule['boxsize'][1]).toString()}px
    " class=" mission" id="${id}"><span>${content}</span></div>`
}

//记录点数

let roll_steps = 0

//棋子状态记录
let chess_state_b = {
    'position': map_rule['start_b'], //记录起始位置
    'direction': 1, //记录方向（随时清1）
}
let chess_state_g = {
    'position': map_rule['start_g'],
    'direction': 1,

    // 'position':60
}

let generate_g_chess = () => { //生成女生棋子
    $(`#mission_${chess_state_g['position']} span`).attr('id', 'detail_hover')
    $(`#mission_${chess_state_g['position']}`).addClass('chess_g none_trans_effect').append(`<span id='span_name_g'>${player_name[1]}</span>`)
    $(`#detail_${chess_state_g['position']}`).addClass('detailbox_g')
    $(`#mission_${chess_state_g['position']}`).hover(
        () => {
            $(`#mission_${chess_state_g['position']} #detail_hover`).fadeIn(300)
            $(`#mission_${chess_state_g['position']} #span_name_g`).fadeOut(150)
        }, () => {
            $(`#mission_${chess_state_g['position']} #detail_hover`).fadeOut(150)
            $(`#mission_${chess_state_g['position']} #span_name_g`).fadeIn(150)
        }
    )
    // 
}

let generate_g_chess_move = () => { //生成女生运动棋子//并且删除原棋子
    let chess_p_now = chess_state_g['position']
    //生成运动棋子
    $('#game').append(`
    <div class="chess_g none_trans_effect" id="moving_g_chess" style="${getPositionFromId(chess_state_g['position'])[2]}width:
    ${(map_rule['boxsize'][0]).toString()}px;height:
    ${(map_rule['boxsize'][1]).toString()}px">
    <span id='span_name_g'>${player_name[1]}</span>
    </div>`)
    //删除原棋子
    $(`#mission_${chess_state_g['position']}`).unbind('mouseenter').unbind('mouseleave');
    $(`#mission_${chess_state_g['position']}`).hover(function () {
        $(`#detail_${chess_p_now}`).fadeIn(0);
    }, function () {
        $(`#detail_${chess_p_now}`).fadeOut(0);
    }); //重置hover特效
    $(`#detail_${chess_state_g['position']}`).removeClass('detailbox_g')
    $(`#mission_${chess_state_g['position']}`).removeClass('chess_g')
    $(`#mission_${chess_state_g['position']} #span_name_g`).remove()
    $(`#mission_${chess_state_g['position']} #detail_hover`).fadeIn()
    $(`#mission_${chess_state_g['position']} span`).removeAttr('id', 'detail_hover')
}

let generate_b_chess_move = () => { //生成nan生运动棋子//并且删除原棋子
    let chess_p_now = chess_state_b['position']
    //生成运动棋子
    $('#game').append(`
    <div class="chess_b none_trans_effect" id="moving_b_chess" style="${getPositionFromId(chess_state_b['position'])[2]}width:
    ${(map_rule['boxsize'][0]).toString()}px;height:
    ${(map_rule['boxsize'][1]).toString()}px">
    <span id='span_name_b'>${player_name[0]}</span>
    </div>`)
    //删除原棋子
    $(`#mission_${chess_state_b['position']}`).unbind('mouseenter').unbind('mouseleave');
    // console.log(chess_state_b['position'])
    $(`#mission_${chess_state_b['position']}`).hover(function () {
        $(`#detail_${chess_p_now}`).fadeIn(0);
    }, function () {
        $(`#detail_${chess_p_now}`).fadeOut(0);
    }); //重置hover特效
    $(`#detail_${chess_state_b['position']}`).removeClass('detailbox_b')
    $(`#mission_${chess_state_b['position']}`).removeClass('chess_b')
    $(`#mission_${chess_state_b['position']} #detail_hover`).fadeIn()
    $(`#mission_${chess_state_b['position']} #span_name_b`).remove()
    $(`#mission_${chess_state_b['position']} span`).removeAttr('id', 'detail_hover')
}

let delete_g_chess_move = () => {
    $('#moving_g_chess').fadeOut(0, () => {
        $('#moving_g_chess').remove();
        $(`#mission_${chess_state_g['position']}`).removeClass('none_trans_effect')
    });
}

let delete_b_chess_move = () => {
    $('#moving_b_chess').fadeOut(0, () => {
        $('#moving_b_chess').remove();
        $(`#mission_${chess_state_b['position']}`).removeClass('none_trans_effect')
    });
}

let generate_b_chess = () => { //生成男生棋子
    $(`#mission_${chess_state_b['position']} span`).attr('id', 'detail_hover')
    $(`#mission_${chess_state_b['position']}`).addClass('chess_b none_trans_effect').append(`<span id='span_name_b'>${player_name[0]}</span>`)
    $(`#detail_${chess_state_b['position']}`).addClass('detailbox_b')
    $(`#mission_${chess_state_b['position']}`).hover(
        () => {
            $(`#mission_${chess_state_b['position']} #detail_hover`).fadeIn(300)
            $(`#mission_${chess_state_b['position']} #span_name_b`).fadeOut(150)
        }, () => {
            $(`#mission_${chess_state_b['position']} #detail_hover`).fadeOut(150)
            $(`#mission_${chess_state_b['position']} #span_name_b`).fadeIn(150)
        }
    )
}

let map_generate = async () => {
    for (let index = 0; index < map.length; index++) { //根据配置文件生成地图形状
        const element = map[index];
        $('#game').append(mission_html(getMissionFromId(index + 1)[0], `mission_${(index+1).toString()}`, element));
        // $('#game').append(mission_html('aaaaaaaaaaaassssssssssssssssssaaaaaa',`mission_${(index+1).toString()}`,element));
        // console.log($(`#mission_${(index+1).toString()} span`).height())
        if ($(`#mission_${(index+1).toString()} span`).height() >= 65) { //设置省略
            $(`#mission_${(index+1).toString()}`).addClass('after_radiant')
        }
    }
    // 生成hover_show_left=>.detailbox_left
    for (let index2 = 0; index2 < map_rule['hover_show_left'].length; index2++) {
        const element = map_rule['hover_show_left'][index2];
        $('#game').append(`
        <div id="detail_${element.toString()}" class="detailbox detailbox_left">
        <span>${getMissionFromId(element)[0]}</span>
        <span class='sub_detail'>${getMissionFromId(element)[1]}</span>
        </div>`);
        var top = (map[element - 1][0] - 1) *
            map_rule['boxsize'][0] -
            ($(`#detail_${element.toString()}`).outerHeight() - map_rule['boxsize'][0]) / 2
        var left = (map[element - 1][1] - 1) * map_rule['boxsize'][1] - $(`#detail_${element.toString()}`).outerWidth() - 30
        // console.log(offset.left)
        $(`#detail_${element.toString()}`).attr('style', "left:" + left + "px;top:" + top + "px");
        $(`#mission_${element.toString()}`).hover(function () {
            $(`#detail_${element.toString()}`).fadeIn(0);
        }, function () {
            $(`#detail_${element.toString()}`).fadeOut(0);
        });
    }
    // 生成hover_show_right=>.detailbox_right

    for (let index2 = 0; index2 < map_rule['hover_show_right'].length; index2++) {
        const element = map_rule['hover_show_right'][index2];
        $('#game').append(`
        <div id="detail_${element.toString()}" class="detailbox detailbox_right">
        <span>${getMissionFromId(element)[0]}</span>
        <span class='sub_detail'>${getMissionFromId(element)[1]}</span>
        </div>`);
        var top = (map[element - 1][0] - 1) *
            map_rule['boxsize'][0] -
            ($(`#detail_${element.toString()}`).outerHeight() - map_rule['boxsize'][0]) / 2
        var left = (map[element - 1][1] - 1) * map_rule['boxsize'][1] + map_rule['boxsize'][1] + 30
        // console.log(offset.left)
        $(`#detail_${element.toString()}`).attr('style', "left:" + left + "px;top:" + top + "px");
        $(`#mission_${element.toString()}`).hover(function () {
            $(`#detail_${element.toString()}`).fadeIn(0);
        }, function () {
            $(`#detail_${element.toString()}`).fadeOut(0);
        });
    }

    // 生成hover_show_up=>.detailbox_top

    for (let index2 = 0; index2 < map_rule['hover_show_up'].length; index2++) {
        const element = map_rule['hover_show_up'][index2];
        $('#game').append(`
            <div id="detail_${element.toString()}" class="detailbox detailbox_up">
            <span>${getMissionFromId(element)[0]}</span>
            <span class='sub_detail'>${getMissionFromId(element)[1]}</span>
            </div>`);
        var top = (map[element - 1][0] - 1) *
            map_rule['boxsize'][0] -
            $(`#detail_${element.toString()}`).outerHeight() - 30
        var left = (map[element - 1][1] - 1) * map_rule['boxsize'][1] - ($(`#detail_${element.toString()}`).outerWidth() - map_rule['boxsize'][1]) / 2
        // console.log(offset.left)
        $(`#detail_${element.toString()}`).attr('style', "left:" + left + "px;top:" + top + "px");
        $(`#mission_${element.toString()}`).hover(function () {
            $(`#detail_${element.toString()}`).fadeIn(0);
        }, function () {
            $(`#detail_${element.toString()}`).fadeOut(0);
        });
    }
    // 生成hover_show_down=>.detailbox_down

    for (let index2 = 0; index2 < map_rule['hover_show_down'].length; index2++) {
        const element = map_rule['hover_show_down'][index2];
        $('#game').append(`
            <div id="detail_${element.toString()}" class="detailbox detailbox_down">
            <span>${getMissionFromId(element)[0]}</span>
            <span class='sub_detail'>${getMissionFromId(element)[1]}</span>
            </div>`);
        var top = (map[element - 1][0] - 1) *
            map_rule['boxsize'][0] + map_rule['boxsize'][0] + 30
        var left = (map[element - 1][1] - 1) * map_rule['boxsize'][1] - ($(`#detail_${element.toString()}`).outerWidth() - map_rule['boxsize'][1]) / 2
        // console.log(offset.left)
        $(`#detail_${element.toString()}`).attr('style', "left:" + left + "px;top:" + top + "px");
        $(`#mission_${element.toString()}`).hover(function () {
            $(`#detail_${element.toString()}`).fadeIn(0);
        }, function () {
            $(`#detail_${element.toString()}`).fadeOut(0);
        });
    }
    //'hover_show_cornor':[1,21,47,27]//左上右上左下右下
    for (let index2 = 0; index2 < map_rule['hover_show_cornor'].length; index2++) {
        const element = map_rule['hover_show_cornor'][index2];
        $('#game').append(`
            <div id="detail_${element.toString()}" class="detailbox detailbox_cornor${index2+1}">
            <span>${getMissionFromId(element)[0]}</span>
            <span class='sub_detail'>${getMissionFromId(element)[1]}</span>
            </div>`);
        $(`#detail_${element.toString()}`).attr('style', "left:" + left + "px;top:" + top + "px");
        $(`#mission_${element.toString()}`).hover(function () {
            $(`#detail_${element.toString()}`).fadeIn(0);
        }, function () {
            $(`#detail_${element.toString()}`).fadeOut(0);
        });
    }
    var top1 = (map[map_rule['hover_show_cornor'][0] - 1][0] - 1) * map_rule['boxsize'][0] + map_rule['boxsize'][0] + 30
    var left1 = (map[map_rule['hover_show_cornor'][0] - 1][1] - 1) * map_rule['boxsize'][1] + 15
    var top2 = (map[map_rule['hover_show_cornor'][1] - 1][0] - 1) * map_rule['boxsize'][0] + map_rule['boxsize'][0] + 30
    var left2 = (map[map_rule['hover_show_cornor'][1] - 1][1] - 1) * map_rule['boxsize'][1] + map_rule['boxsize'][1] - $(`.detailbox_cornor2`).outerWidth() - 15
    var top3 = (map[map_rule['hover_show_cornor'][2] - 1][0] - 1) * map_rule['boxsize'][0] - $(`.detailbox_cornor3`).outerHeight() - 30
    var left3 = (map[map_rule['hover_show_cornor'][2] - 1][1] - 1) * map_rule['boxsize'][1] + 15
    var top4 = (map[map_rule['hover_show_cornor'][3] - 1][0] - 1) * map_rule['boxsize'][0] - $(`.detailbox_cornor4`).outerHeight() - 30
    var left4 = (map[map_rule['hover_show_cornor'][1] - 1][1] - 1) * map_rule['boxsize'][1] + map_rule['boxsize'][1] - $(`.detailbox_cornor4`).outerWidth() - 15

    $(`.detailbox_cornor1`).attr('style', "left:" + left1 + "px;top:" + top1 + "px");
    $(`.detailbox_cornor2`).attr('style', "left:" + left2 + "px;top:" + top2 + "px");
    $(`.detailbox_cornor3`).attr('style', "left:" + left3 + "px;top:" + top3 + "px");
    $(`.detailbox_cornor4`).attr('style', "left:" + left4 + "px;top:" + top4 + "px");
    //生成女生棋子
    $('#titleinfo').text('飞行棋模拟器 | ' + mission_meta['meta']['title']);
    $('#titleinfo').append('<span id="more_detail">#查看详情</span>');
    $('#more_detail').click(() => generate_infobox([
        mission_meta['meta']['title'],
        '棋盘作者：' + mission_meta['meta']['mission_author'] +
        '<br>需要道具：' + mission_meta['meta']['tools'] +
        '<br>简介：<br>' + mission_meta['meta']['syno'] +
        ABOUT
    ]))
    $('#row_b').click(async function (e) {
        e.preventDefault();
        await generate_row_box('b', 6)
    });
    $('#row_g').click(async function (e) {
        e.preventDefault();
        await generate_row_box('g', 6)
    });
    //替换冲刺格子样式
    // let last_end = map_rule['close_to_end_b'].concat(map_rule['close_to_end_g'])
    // last_end.forEach(element => {
    //     $(`#mission_${element}`).addClass('mission_last_end')
    // });
    //替换终点格子
    $(`#mission_${map_rule['end']}`).addClass('mission_win')
    $(`#detail_${map_rule['end']}`).addClass('detailbox_win')

    generate_g_chess()
    //生成男生棋子
    generate_b_chess()
    // await move_g(6)
    // await move_g(6)
    // await move_b(1,6)

    //生成标题和副标题




}

let generate_title = (position, titletxt) => {
    let position_title = position[0]
    let position_subtitle = position[1]
    $('#game').append(`
    `)
}

let move_g_once = async (start_position) => { //direction=-1/1
    let this_position = chess_state_g['position']
    let direction = chess_state_g['direction']
    let next_position = this_position + direction
    // console.log(this_position)

    if (direction == 1) { //顺时针情况
        if (start_position == 24) {
            next_position = 60
            // direction = -1 //进入65并且倒叙
        }

        if (this_position == 52) {
            next_position = 1
        }
        if (this_position == 65) {
            next_position = 59
            direction = -1 //进入终点并且正序
        }
    }
    if (direction == -1) {
        if (this_position == 60) {
            next_position = 24
            direction = 1
        } //进入24并且正序}
        if (this_position == 59) {
            next_position = 65
            // direction = 1 //进入终点并且正序
        }
        if (this_position == 1) {
            next_position = 52
        }
    }
    chess_state_g['position'] = next_position
    chess_state_g['direction'] = direction
    return await $('#moving_g_chess').animate({
        top: getPositionFromId(next_position)[0],
        left: getPositionFromId(next_position)[1]
    }, 500).promise()
}

let move_b_once = async (start_position) => { //direction=-1/1
    let this_position = chess_state_b['position']
    let direction = chess_state_b['direction']
    let next_position = this_position + direction
    // console.log(this_position)

    if (direction == 1) { //顺时针情况
        if (start_position == 50) {
            next_position = 53
            direction = 1 //进入65并且倒叙
        }

        if (this_position == 58) {
            next_position = 59
            direction = -1 //进入终点并且正序
        }
        if (this_position == 52) {
            next_position = 1
        }
    }
    if (direction == -1) {
        if (this_position == 53) {
            next_position = 50
            direction = 1 //进入24并且正序
        }

        if (this_position == 1) {
            next_position = 52
        }
    }
    chess_state_b['position'] = next_position
    chess_state_b['direction'] = direction
    return await $('#moving_b_chess').animate({
        top: getPositionFromId(next_position)[0],
        left: getPositionFromId(next_position)[1]
    }, 500).promise()
    //更新棋子状态
}

let move_g = async (steps) => {
    //生成运动棋子
    //删除原本棋子
    generate_g_chess_move()
    //运动棋子开始动画

    let start_position = chess_state_g['position'] //标记24和50
    for (let index = 0; index < steps; index++) {
        await move_g_once(start_position)
    }
    if (chess_state_g['position'] == chess_state_b['position'] && chess_state_b['position'] !== 59) { //没有赢
        start_position = chess_state_g['position']
        await move_g_once(start_position)
    }
    if (chess_state_g['position'] == 24 || chess_state_g['position'] == 50) {
        start_position = chess_state_g['position']
        await move_g_once(start_position)
    }
    if (chess_state_g['position'] == 64) {
        start_position = chess_state_g['position']
        for (let i = 0; i < 6; i++) {
            chess_state_g['direction'] = -1
            await move_g_once(start_position)
        }
    }
    if (chess_state_g['position'] == 59) {
        win('g')
    }
    generate_g_chess()
    delete_g_chess_move()
    chess_state_g['direction'] = 1
    //更新棋子状态
    generate_infobox(getMissionFromId(chess_state_g['position']))

}
//如果正好在50或者24则进入冲刺阶段
//如果正好在59则赢得游戏

//动画结束生成新的棋子

//删除运动棋子


let move_b = async (steps) => {
    //生成运动棋子
    //删除原本棋子
    generate_b_chess_move()
    //运动棋子开始动画

    let start_position = chess_state_b['position'] //标记24和50
    for (let index = 0; index < steps; index++) {
        await move_b_once(start_position)
    }
    if (chess_state_b['position'] == chess_state_g['position'] && chess_state_g['position'] !== 59) {
        start_position = chess_state_b['position']
        //如果重合就额外前进1格子
        await move_b_once(start_position)
    }
    if (chess_state_b['position'] == 24 || chess_state_b['position'] == 50) {
        start_position = chess_state_b['position']
        // console.log('gogoog')
        await move_b_once(start_position) //进入冲刺
    }
    if (chess_state_b['position'] == 57) {
        start_position = chess_state_b['position']
        for (let i = 0; i < 6; i++) {
            chess_state_b['direction'] = -1
            await move_b_once(start_position)
        }
    }
    if (chess_state_b['position'] == 59) {
        win('b')
    }
    // await sleep(1)
    generate_b_chess()
    delete_b_chess_move()
    chess_state_b['direction'] = 1
    generate_infobox(getMissionFromId(chess_state_b['position']))
    //更新棋子状态
}


let roll_num_roll = async (num) => {
    let time = 1000
    let randomnum = Array(30).fill(1).map(v => Math.ceil(Math.random() * num))
    // let randomnum = [1,2,3,4,5,6,7,8,9,10]
    let timelast = 0
    for (let index = 0; index < randomnum.length; index++) {
        const element = randomnum[index]
        timelast += time / randomnum.length
        if (index + 1 == randomnum.length) {
            roll_steps = element
            $('#roll_num').text(element)
            $('#darkbg').addClass('bg_shine')
            $('#roll_num').addClass('animate_roll_last')
        } else {
            $('#roll_num').text(element)
            await sleep(time / randomnum.length)
        }
    }
}


function sleep(millsecond) {
    return new Promise(function (resolve) {
        setTimeout(resolve, millsecond)
    })
}


let generate_row_box = async (bg, num) => {
    $('#roll_ok').click(async function (e) {
        e.preventDefault();
        remove_row_box()
        await sleep(300)
        if (bg == 'g') {
            move_g(roll_steps, num)
        } else if (bg == 'b') {
            move_b(roll_steps, num)
        }
    });
    $('#roll_reroll').click(async function (e) {
        e.preventDefault();
        $('#darkbg').removeClass('bg_shine')
        $('#roll_num').removeClass('animate_roll_last')
        $('#roll_checkbox').fadeOut(150)
        await roll_num_roll(6)
        $('#roll_checkbox').fadeIn()
    });
    $('#roll_num').fadeIn()
    $('#darkbg').fadeIn();
    await roll_num_roll(6)
    $('#roll_checkbox').fadeIn()
    //好的/重来
    //如果已经row了，就不生成rowbox了
}
let remove_row_box = () => {
    $('#roll_ok').unbind('click')
    $('#roll_reroll').unbind('click')
    $('#darkbg').fadeOut();
    $('#roll_checkbox').fadeOut()
    $('#darkbg').removeClass('bg_shine')
    $('#roll_num').removeClass('animate_roll_last')
    $('#roll_num').fadeOut()
    // $('#darkng').append(`<span id="roll_num">6</span>`)
}

let generate_infobox = (info) => {
    //info['title','content_/n/n/n/']
    //关闭
    $('#darkbg').fadeIn();
    $('#infobox').fadeIn();
    $('#infobox_title').text(info[0]);
    // console.log[info[1]]
    $('#infobox_content').html(info[1]);
    $('#info_checkbox').click(() => remove_infobox())
    // $('#darkbg').
}

let remove_infobox = () => {
    $('#darkbg').fadeOut();
    $('#infobox').fadeOut();
    $('#info_checkbox').unbind('click')
}


let win = (bg) => {
    if (bg == 'b') {
        // generate_infobox(['蓝色方胜利！'],['红色方可继续游玩'])
        $('#row_b').unbind('click');
        $('#row_b').addClass('roll_unselectable')
    }
    if (bg == 'g') {
        // generate_infobox(['红色方胜利！'],['蓝色方可继续游玩'])
        $('#row_g').unbind('click');
        $('#row_g').addClass('roll_unselectable')
    }
}

map_generate()

// $('#game').append(mission_html('喝一杯酒','mission_1',[1,1]));
// $('#game').append(mission_html('喝一杯酒','mission_2',[1,2]));
// $('#game').append(mission_html('喝一杯酒','mission_3',[2,2]));
// $('#game').append(mission_html('喝一杯酒','mission_4',[3,3]));