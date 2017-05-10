// 预加载的文件列表
var preloadFile = [
    "jsx/saber.min.jsx",
    "jsx/saber.loader.min.jsx",
    "jsx/zane.utils.jsx",
    "jsx/zane.mvc.jsx",
    "jsx/zane.superMother.jsx"
];

var loader = document.getElementById("loader");
var progress = document.getElementById("progress");

// 预加载文件开始加载
var onPreloadFileStart = function ()
{
    loader.style.display = "block";
};

var onPreloadFileProgress = function (progress)
{
    progress.innerText = progress + "%";
};

// 预加载文件加载完成后的处理函数
var onPreloadFileComplete = function()
{
    loader.style.display = "none";
    new zane.superMother.Main();
};