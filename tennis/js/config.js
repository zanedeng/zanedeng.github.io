// 预加载的文件列表
var preloadFile = [
    "jsx/zane.utils.jsx",
    "jsx/zane.mvc.jsx",
    "jsx/zane.tennis.jsx"
];

var loader = document.getElementById("loader");

// 预加载文件开始加载
var onPreloadFileStart = function ()
{
    loader.style.display = "block";
};

var onPreloadFileProgress = function (progress)
{
    loader.innerText = progress + "%";
};

// 预加载文件加载完成后的处理函数
var onPreloadFileComplete = function()
{
    loader.style.display = "none";
    new zane.tennis.Main();
};