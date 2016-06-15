// 预加载的文件列表
var preloadFile = [
  "jsx/hand-1.3.7.jsx", 
  "jsx/cannon.jsx", 
  "jsx/babylon.jsx", 
  "jsx/zane.utils.jsx", 
  "jsx/zane.mvc.jsx",
   "jsx/zane.vr.jsx"
];

var loader = document.getElementById("loader");
var loaderText = document.getElementsByClassName("loader_progress")[0];

// 预加载文件开始加载
var onPreloadFileStart = function ()
{
    loader.style.display = "block";
};

var onPreloadFileProgress = function (progress)
{
    loaderText.style.display = "block";
    loaderText.innerText = progress + "%";
};

// 预加载文件加载完成后的处理函数
var onPreloadFileComplete = function()
{
    loader.style.display = "none";
    loaderText.style.display = "none";
    new zane.vr.Main();
};