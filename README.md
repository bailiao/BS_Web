# BS_Web

## BS体系软件设计大作业——图像标注网站



### 1. 环境配置

#### 1.1 技术栈

本项目使用 **Webpack + fabricJs + Django** 框架进行开发。

数据库使用 **mysql**，已部署在远程服务器上。

图片存储使用的是 **IPFS**，可提供分布式云存储服务，一般用于区块链项目，也可以作为普通的云数据库。访问`ipfs.io`需要科学上网，但用于获取文件时还是很容易出现访问不了的情况。因此在本作业中，若要验证功能，推荐先自己上传一个任务，图片会以 `127.0.0.1:8080/img_hash` 的形式访问



#### 1.2 运行步骤

运行该项目前请确保你已经安装 node.js , npm , webpack，IPFS以及 Django (还需pip install 配置与Mysql的连接)

##### 1 克隆或下载本项目

##### 2 进入项目根目录文件夹，前端和后端的启动需要两个终端

##### 3 运行前端

- 进入前端根目录 `cd code/front-end`
- `npm run build`
- `npm run start`
- 打开网页 `http://localhost:8080/`

##### 4 运行后端

- 进入后端根目录 `cd code/Bs_Web`
- `python manage.py runserver`



若执行上述步骤的过程中出现依赖或插件未安装的错误，请依据提示进行 `npm install xxx`或

 `pip install xxx`

<img src="screenshot\1.png" style="zoom:50%;" />



<img src="screenshot\2.png" style="zoom:50%;" />

### 2. 功能说明

**（由于是在本地运行前后端，而没有部署到服务器上，故部分页面的渲染会比较慢，请耐心等待）**

<img src="screenshot\3.png" style="zoom:50%;" />

#### 2.1 登录、注册与找回密码

本网站的所有操作基本都需要在登录后才能实现，用户应先进行注册和登录，其中邮箱用于后续的验证码发送

<img src="screenshot\4.png" style="zoom:50%;" />

<img src="screenshot\5.png" style="zoom:50%;" />

#### 2.2 上传任务

登录后，用户可以选择多张图片或是视频进行上传，若是上传视频，则会以一定的帧率进行上传，Video和Image文件夹里用于暂时存放用户上传的视频及划分出来的图片（实际已上传到云），也可以作为本网站功能验证的参考

<img src="screenshot\6.png" style="zoom:50%;" />

#### 2.3 查看发布任务与领取

查看发布任务界面以**瀑布流**的格式进行设计（此处仅做参考），用户点击领取后可在Your Task页面查看。领取后该任务消失

<img src="screenshot\7.png" style="zoom:50%;" />

#### 2.4 个人任务界面

该页面展示了所有你发布的任务和领取的任务，可以导出发布任务中其他用户完成任务的coco格式数据（json文件），也可进入到领取任务的标注界面。此外为撤销发布任务和丢弃领取任务

<img src="screenshot\8.png" style="zoom:50%;" />

<img src="screenshot\9.png" style="zoom:50%;" />

#### 2.5 标注功能

标注页面概览如下

<img src="screenshot\10.png" style="zoom:50%;" />

<img src="screenshot\11.png" style="zoom:50%;" />



该部分主要用 **FabricJS** 来开发，侧边栏列出了该任务的一些基本信息和任务所属图片列表，中间为标注画布，右侧为标注功能选项。开始标注时，用户需要在图片列表选择图片，点击开始标注进行类的标注。选中方框点击修改标注进行文字修改，或点击删除来删除标注。标注页面也可以进行导出，导出前则需要先行保存，否则会阻止该操作。以下为部分操作截图



<img src="screenshot\12.png" style="zoom:50%;" />

<img src="screenshot\13.png" style="zoom:50%;" />

<img src="screenshot\14.png" style="zoom:50%;" />

<img src="screenshot\15.png" style="zoom:50%;" />



json文件如下，可自行采用排版工具进行格式化

<img src="screenshot\16.png" />

<img src="screenshot\17.png" style="zoom:50%;" />



### 3. 开发体会

由于本人在过往几门课程网站大作业中主要负责后端的工作（数据库数据存取、处理），基本没有接触前端的开发。此次BS大作业全栈开发让我深切体会到了前端开发的痛处，例如数据在前后端的传输格式如何保持，各种事件的相互联系，页面的整体设计等等，也深切体会了一个成熟的开发框架对前后端开发的巨大帮助，包括但不限于各种包的调用，html,css,js的交互，前后端传输数据前的预处理和返回解析等等（本作业开发基本用jquery语法实现）。如果可以的话建议仅把该项目作为参考而用vue, react等来实现

