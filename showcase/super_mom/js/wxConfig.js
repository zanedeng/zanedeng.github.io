/**
 *
 * Created by apple on 15/4/18.
 */
var artID  = 0;
function initWeiXinAPI(aID, callback)
{
    artID = aID;
    $.ajax({
        type:'GET',
        url:'getshare.aspx?url='+window.location.href,
        async: false,
        success:function(data)
        {
            var wxInfo = $.parseJSON(data);
            //alert(data);
            wxConfig(wxInfo.timestamp, wxInfo.nonceStr, wxInfo.signature, wxInfo.appid, callback);
        }
    });
}

var wxShareData = {
    title: "期待中！", // 分享标题
    desc:"期待中！",
    link: 'http://shengdan.5egoo.com.cn/index.html',
    imgUrl: "http://shengdan.5egoo.com.cn/images/logo.png"
};

var wxConfig = function (timestamp, nonceStr, signature, wxappid, callback)
{
    wx.config({
        debug: false,
        appId: wxappid,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideOptionMenu',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
		    'getLocation'
        ]
    });

    wx.ready(function(){
        // alert('test');
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.onMenuShareTimeline({
            title: wxShareData.title, // 分享标题
            link: wxShareData.link,
            imgUrl: wxShareData.imgUrl,
            trigger: function(res)
            {

            },
            success: function(res)
            {
                shareSuccess();
            },
            cancel: function(res)
            {

            },
            fail: function(res)
            {
                console.log(JSON.stringify(res));
            }
        });

        wx.onMenuShareAppMessage({
            title: wxShareData.title, // 分享标题
            desc: wxShareData.desc, // 分享描述
            link: wxShareData.link,
            imgUrl: wxShareData.imgUrl,
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function ()
            {
                shareSuccess();
            },
            cancel: function ()
            {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.getLocation({
            success: function (res)
            {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                cityname(latitude,longitude, callback);
            },
            cancel: function ()
            {
                //这个地方是用户拒绝获取地理位置
                if (typeof error == "function")
                {
                    error();
                }
            }
        });
    });

    wx.error(function(res)
    {
        console.log(res);
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    });
};

function cityname(latitude, longitude, callback)
{
    $.ajax({
        url: 'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&callback=renderReverse&location=' + latitude + ',' + longitude + '&output=json&pois=1',
        type: "get",
        dataType: "jsonp",
        jsonp: "callback",
        success: function (data) {
            console.log(data);
            var province = data.result.addressComponent.province;
            var cityname = (data.result.addressComponent.city);
            var district = data.result.addressComponent.district;
            var street = data.result.addressComponent.street;
            var street_number = data.result.addressComponent.street_number;
            var formatted_address = data.result.formatted_address;
            localStorage.setItem("province", province);
            localStorage.setItem("cityname", cityname);
            localStorage.setItem("district", district);
            localStorage.setItem("street", street);
            localStorage.setItem("street_number", street_number);
            localStorage.setItem("formatted_address", formatted_address);
            //domTempe(cityname,latitude,longitude);
            var data = {
                latitude: latitude,
                longitude: longitude,
                cityname: cityname
            };
            if (typeof callback == "function")
            {
                callback(data);
            }

        }
    });
}

function shareSuccess() {
//    $.ajax({
//        type: 'GET',
//        url: 'writedata.aspx?action=writedata',
//        async: false,
//        success: function (data) {
//            alert("分享成功！");
////            console.log(data);
//        }
//    });
}
