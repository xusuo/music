(function ($, root) {
    var $scope = $(document.body)
    var duration
    var frameId
    var lastTime = 0
    var startTime
    function renderAllTime(time) {
        duration = time
        time = formatTime(time)
        $scope.find(".all-time").html(time)
    }

    function start(pre) {
        cancelAnimationFrame(frameId)
        startTime = new Date().getTime();
        lastTime = pre == undefined ? lastTime : pre
        function frame() {
            var curTime = new Date().getTime();
            var percent = lastTime + (curTime - startTime) / (duration * 1000)
            updata(percent)
            frameId = requestAnimationFrame(frame)
        }
        frame()
    }

    function stop() {
        cancelAnimationFrame(frameId)
        var stopTime = new Date().getTime();
        lastTime = lastTime + (stopTime - startTime) / (duration * 1000)
    }

    function updata(per) {
        var time = Math.round(per * duration);
        time = formatTime(time)
        $scope.find(".cur-time").html(time)
        $scope.find(".pro-top").css({
            transform: 'translateX(' + (per * 100 - 100) + '%)'
        })
    }

    function formatTime(time) {
        var m = Math.floor(time / 60);
        var s = time % 60;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        return m + ":" + s
    }
    root.processor = {
        renderAllTime: renderAllTime,
        updata: updata,
        start: start,
        stop: stop
    }

})(window.Zepto, window.player || (window.player = {}))