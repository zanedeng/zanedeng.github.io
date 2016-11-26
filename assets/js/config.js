var preloadFile = [
    {id:"zane-mvc-libs", url:"assets/jsx/zane.mvc.jsx", loadingType:"xhr"},
    {id:"zane-utils-libs", url:"assets/jsx/zane.utils.jsx", loadingType:"xhr"},
    {id:"zane-web-libs", url:"assets/jsx/zane.web.jsx", loadingType:"xhr"},
    {id:"zane-editor-libs", url:"assets/jsx/zane.editor.jsx", loadingType:"xhr"}
];

function run()
{
    new zane.editor.Main();
}