
# 简介

这是一款简洁美观的 `免费博客` 系统，聚合各种HTML5技术的 `在线工具` 以及 Github 项目管理功能，专为程序员设计，只需要你专注于内容的创作。

## 项目特色

* 在线添加文章功能，支持 `Markdown` 语法。
* 使用 GitHub 的 `免费主机`，只需要 `fork` [该项目](https://github.com/zanedeng/zanedeng.github.io.git) 到自己的项目仓库，开通 GitHub Pages 功能即可。[（进一步了解 GitHub Pages →）](http://pages.github.com/)
* 支持 `在线代码编辑`，这样你就可以随时随地的修改你寄托再 GitHub 上的代码了。


## 免费使用教程

-  `fork` [该项目](https://github.com/zanedeng/zanedeng.github.io.git) 到自己的项目仓库。
- 为该项目仓库开通 GitHub Pages 功能[（进一步了解 GitHub Pages →）](http://pages.github.com/)。
- 修改根目录下 CNAME 文件中的域名为自己的域名（设置之前先新增一条域名的cname指向 ***.github.io）。
- 接下来需要修改 `assets/config/site.json`文件中的站点配置。


## 站点配置说明

```json

{
    // 网站名称
    "title": "赞恩在线工具",
    // 如果你想通过github授权登录，就需要去申请 OAuth App，然后把 appid 填写在此处，具体对接API请查阅 github api 文档
    "clientID": "", 
    // 这里是你的站点仓库名
    "repo": "zanedeng.github.io", 
    // cnzz 站点统计的网站id
    "cnzzSiteId": "1278996152", 
    // 语言包，如果需要支持其它语言，可以在这里新增语言包配置
    "langPacks": [ 
        {"lang": "zh", "path": "assets/i18n/zh.json"},
        {"lang": "en", "path": "assets/i18n/en.json"}
    ],
    // 站点logo地址
    "logo": "assets/img/logo.png", 
    // 网站主题设置
    "theme": {
        "filter": 20,
        "opacity": 0.2,
        "backgroundImage": "assets/img/bg.jpg",
        "backgroundColor": "rgba(123, 123, 123, 0.35)",
        "backgroundBlendMode": "hue"
    }
}

```


# 未登录页面截图
![未登录页面截图](https://github.com/zanedeng/zanedeng.github.io/raw/master/assets/img/screenshot01.png)

# 登录页面截图
![登录页面截图](https://github.com/zanedeng/zanedeng.github.io/raw/master/assets/img/screenshot02.png)

# Markdown编辑页面截图
![Markdown编辑页面截图](https://github.com/zanedeng/zanedeng.github.io/raw/master/assets/img/screenshot03.png)

# githun项目编辑页面截图
![githun项目编辑页面截图](https://github.com/zanedeng/zanedeng.github.io/raw/master/assets/img/screenshot04.png)
