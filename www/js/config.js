// 预加载的文件列表
var preloadFile = ["jsx/zane.mvc.jsx", "jsx/zane.web.component.jsx", "jsx/zane.web.gt.jsx"];

// 预加载文件开始加载
var onPreloadFileStart = function ()
{
    
};

var onPreloadFileProgress = function (progress)
{
    document.getElementById("bar").style.width = (window.innerWidth * 0.8 - 4) * progress/100 + "px";
    document.getElementById("perc").innerHTML = progress + "%";
};

// 预加载文件加载完成后的处理函数
var onPreloadFileComplete = function()
{
    var progressbar = document.getElementById("progressbar");
    progressbar.parentNode.removeChild(progressbar);
    new zane.web.gt.Main();
};