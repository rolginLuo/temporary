// import { root } from "_postcss@7.0.14@postcss";
var root = window.player,
    nowIndex = 0,
    dataList,
    len,
    audio = root.audioManager,
    // control = root.controlIndex,
    control,
    timer;

function getData(url) {
    $.ajax({
        type: 'GET',
        url:url,
        success: function (data) {
            console.log(data);
            dataList = data;
            len = data.length;
            bindTouch();
            bindEvent(); // 请求成功，绑定事件
            control = new root.controlIndex(len);
            $('body').trigger('play:change', 0);
            // root.render(data[0]);
            // audio.getAudio(data[0].audio)
        },
        error: function () {
            console.log("error")
        }
    })
}

function bindTouch(){
    var left = $('.pro-bottom').offset().left;
    var width = $('.pro-bottom').offset().width;
    $('.slider-point').on('touchstart', function () {
        root.pros.stop();
    }).on('touchmove', function(e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per >= 0 && per <= 1) {
            root.pros.update(per)
        }
    }).on('touchend', function(e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per >= 0 && per <= 1) {
            var duration = dataList[control.index].duration;
            var curTime = per * duration;
            audio.playTo(curTime);
            // $('.play').trigger('click', 'play');
            $('.play').addClass('playing');
            audio.status = 'play';

            root.pros.start(per);
        }
        var deg = $('.img-box').attr('data-deg');
        rotated(deg);
    })
}

function bindEvent(){
    $('body').on('play:change', function (e, index) {
        audio.getAudio(dataList[index].audio);
        root.render(dataList[index]);
        root.pros.renderAllTime(dataList[index].duration)
        if(audio.status == 'play') {
            rotated(0);
            audio.play(); 
            root.pros.start();
        }
        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            'transform': 'rotateZ(0deg)',
            'transition': 'none'
        });
    })
    $('.prev').on('click', function () {
        // if(nowIndex == 0){ // 一版
        //     nowIndex = len -1;
        // }else{
        //     nowIndex --;
        // }
        // var i = root.controlIndex.prev(); // 二版
        if($('.geList').hasClass('showGeList')) {
            $('.geList').toggleClass('showGeList');
        }
        var i = control.prev(); // 三版
        $('body').trigger('play:change', i)
        if(audio.status == 'play') {
            root.pros.start(0);
        }else {
            root.pros.update(0);
        }
        // audio.getAudio(dataList[i].audio); // 抽离放置play:change中
        // root.render(dataList[i]);
        // if(audio.status == 'play') {
        //     audio.play();
        // }
    });
    $('.next').on('click', function () {
        // if(nowIndex == len -1){
        //     nowIndex = 0;
        // }else{
        //     nowIndex ++;
        // }
        // var i = root.controlIndex.next();
        if($('.geList').hasClass('showGeList')) {
            $('.geList').toggleClass('showGeList');
        }
        var i = control.next();
        $('body').trigger('play:change', i);
        if(audio.status == 'play') {
            root.pros.start(0);
        }else {
            root.pros.update(0);
        }
        // $('.pro-top').css({
        //     transform: 'translateX(-100%)'
        // })
        // audio.getAudio(dataList[i].audio);
        // root.render(dataList[i]);
        // if(audio.status == 'play') {
        //     audio.play();
        // }
    });
    $('.play').on('click', function(){
        // console.log(audio.getAudio(dataList[nowIndex].audio))
        if(audio.status == 'pause') { // 播放
            audio.play();
            root.pros.start();
            var deg = $('.img-box').attr('data-deg');
            // console.log(deg)
            rotated(deg);
        }else{  // 暂停
            audio.pause();
            root.pros.stop();
            clearInterval(timer);
        }
        $('.play').toggleClass('playing'); // 切换class 类名
    });
    $('.list').on('click', function(){
        
        // if(!$('.geList .list').html()){
            var strli = '<li class="list">播放列表</li>';
            dataList.forEach(function (ele, index) {
                var isPlaying = index == control.index ? 'list-playing' : '';
                strli += '<li key="'+ index +'" class="' + isPlaying + '">\
                            <span class="list-song-name">'+ ele.song +'</span> - <span class="list-singer-name">'+ ele.singer +'</span>\
                        </li>'
            })
            $('.geList').html($('<ul>'+ strli +'</ul>'))
        // }
        $('.geList').toggleClass('showGeList');
    });
    $('.geList').on('click', 'li:not(.list):not(.list-playing)',function () {
        var key = $(this).attr('key');
        key = +key;
        control.index = key;
        $('body').trigger('play:change', key);
        $('.geList').toggleClass('showGeList');
        if(audio.status == 'pause'){
            $('.play').click();
        }
    })
}

function rotated(deg){ 
    clearInterval(timer);
    // var deg = 0; // 初始角度
    deg = +deg; // 字符串转数字
    timer = setInterval(function(){
        deg += 2;
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            'transform': 'rotateZ(' + deg + 'deg)',
            'transition': 'all 0.2s linear'
        });
    }, 200);
}

getData("../mock/data.json"); 
// 信息+图片渲染到页面上
// 点击按钮
// 音频的播放与暂停     切歌
// 进度条运动与拖拽
// 图片旋转
// 列表切歌
