---
title: svg图片不显示在网站上
urlname: ybyfy5goc6dp2d87
date: '2024-06-26 23:15:42'
updated: '2024-06-26 23:19:18'
description: '为什么使用外部 URL 的 SVG 不显示？我在建设本站的时候发现一个问题，那就是png、jpg等图片都可以正常的渲染。但是只要是svg图片就无法展示。可能的原因1. 跨域问题如果 SVG 资源和当前页面不在同一个域名下,浏览器的同源策略可能会阻止加载。需要在服务端设置允许跨域访问的响应头。 ...'
---
# 为什么使用外部 URL 的 SVG 不显示？
我在建设本站的时候发现一个问题，那就是png、jpg等图片都可以正常的渲染。

但是只要是svg图片就无法展示。

# 可能的原因
1. 跨域问题
如果 SVG 资源和当前页面不在同一个域名下,浏览器的同源策略可能会阻止加载。需要在服务端设置允许跨域访问的响应头。 

2. SVG 响应的 Content-Type 不正确
服务端返回 SVG 资源时,Content-Type 应该是 image/svg+xml。如果是其他类型如 application/octet-stream,浏览器可能无法正确识别和渲染 SVG。 

3. SVG 资源本身有错误
要检查 SVG 文件本身是否有语法错误,是否能单独在浏览器中打开和显示。 

1、3我很确认不会存在··

综上,最可能的问题是 SVG 响应的 Content-Type 不正确导致的。

后面我发现我在上传图片资源的时候没有指定content-type，这就导致所有图片资源的默认资源都是application/octet-stream。

然而这个资源在jpg、png等情况下仍然可以正常显示。只有在svg的情况下无法正常显示···

后面我修改服务器配置,为 SVG 资源设置正确的 MIME 类型，网站文章的图片显示就正常了~


