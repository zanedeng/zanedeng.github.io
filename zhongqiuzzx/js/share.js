appid = "";
gSound = '';

function shareFriend() {
  WeixinJSBridge.invoke("sendAppMessage", {
    appid: appid,
    img_url: shareDetail.imgUrl,
    img_width: "200",
    img_height: "200",
    link: shareDetail.link,
    desc: shareDetail.content,
    title: shareDetail.title
  }, function(b) {})
}

function shareTimeline() {
  WeixinJSBridge.invoke("shareTimeline", {
    appid: appid,
    img_url: shareDetail.imgUrl,
    img_width: "200",
    img_height: "200",
    link: shareDetail.link,
    desc: shareDetail.content,
    title: shareDetail.title
  }, function(b) {})
}

function shareWeibo() {
  WeixinJSBridge.invoke("shareWeibo", {
    content: shareDetail.content,
    url: shareDetail.link
  }, function(b) {})
}
document.addEventListener("WeixinJSBridgeReady", function onBridgeReady() {
  WeixinJSBridge.on("menu:share:appmessage", function(b) {
    shareFriend();
  });
  WeixinJSBridge.on("menu:share:timeline", function(b) {
    shareTimeline();
  });
  WeixinJSBridge.on("menu:share:weibo", function(b) {
    shareWeibo();
  })
}, false);
