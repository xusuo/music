

var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var index = 0;
var songList;
var audio = new root.audioControl();
function bindEvent() {

    $scope.on("play:change", function (e, index) {
        audio.getAudio(songList[index].audio);
        root.processor.renderAllTime(songList[index].duration)
        if (audio.status == "play") {
            audio.play();
            root.processor.start()
        }
    })
    $scope.on("click", ".prev-btn", function () {
        index = controlManger.prev()
        root.render(songList[index])
        $scope.trigger("play:change", index);
        root.processor.start()
        if(audio.status == 'play'){
            root.processor.start(0)
        }else{
            root.processor.updata(0)
        }
        // audio.status == "play"
        // audio.play()
    })
    $scope.on("click", ".next-btn", function () {
        index = controlManger.next();
        root.render(songList[index])
        $scope.trigger("play:change", index);
        root.processor.start()
        if(audio.status == 'play'){
            root.processor.start(0)
        }else{
            root.processor.updata(0)
        }
        // audio.status == "play"
        // audio.play()
    })
    $scope.on("click", ".play-btn", function () {
        if (audio.status == "play") {
            audio.pause();
            root.processor.stop()
        } else {
            audio.play();
            root.processor.start()
        }
        $(this).toggleClass("playing")
    })
}
function touchEvent() {                                   //绑定拖拽事件
    var offset = $('.pro-bottom').offset();               //通过进度条下面那层的位置跟当前小圆点位置计算百分比；
    var left = offset.left;
    var width = offset.width;
    var pre;
    $('.slider-point').on('touchstart', function (e) {    //点击时候暂停；
        audio.pause();
        audio.status = "pause";
        root.processor.stop()
        $('.play-btn').toggleClass("playing");
    }).on('touchmove', function (e) {                     //移动时候将鼠标x值相对百分比赋值给duration渲染进度条及时间；
        var x = e.changedTouches[0].clientX;
        pre = (x - left) / width;
        if (0 <= pre && pre <= 1) {
            root.processor.updata(pre)
        }
    }).on('touchend', function (e) {                      //抬起时候赋值当前播放时间，同时开始播放，记得更新afterdate这个保留时间。在此基础上更新进度
        var x = e.changedTouches[0].clientX;
        pre = (x - left) / width;
        if (0 <= pre && pre <= 1) {
            var curTime = pre*songList[index].duration
            audio.playTo(curTime)
            $scope.find('.play-btn').addClass('playing')
            audio.status = "play"
            root.processor.start(pre)
        }
    })
}
function getDate(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            songList = data;
            root.render(data[0])
            bindEvent();
            touchEvent()
            controlManger = new root.controlManger(data.length)
            $scope.trigger("play:change", 0);
        },
        error: function () {
            console.log("error");
        }
    })
}

getDate("../mock/data.json")