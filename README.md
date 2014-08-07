XiyouLibNodeExpress
===================

## 基于Node.js Express框架的西邮图书馆REST API

__&#8226; 公开URL：__ http://api.xiyoumobile.com/xiyoulibv2/

请根据下面的介绍获取数据或自行搭建服务器！

## 简单介绍

使用Node.js Express框架开发的西邮图书馆REST API，通过模拟网站登陆的形式抓取西邮图书馆Web页面并返回JSON或JSONP给访问者，目前仅支持获取用户借阅历史。

默认监听18000端口，部署前请使用 npm install 命令补全依赖包！

百度云挂上去没有作用，所以就没按照百度云上的要求来做。

## API调用方式介绍

__&#8226; JSON请求URL形式为：__
http://{hostname}:{port}/{api类别}/{api名}?{参数（可选）}

__&#8226; JSONP请求URL形式为：__
http://{hostname}:{port}/{api类别}/{api名}?{参数（可选）}&callback={回调函数名}，格式错误则会提示NOT_FOUND错误。

## 用户相关

__&#8226; 二级路径：__ /user

__&#8226; 支持方法：__ GET、POST

__&#8226; 注：__ 
用户相关API除login接口外，其他接口的访问需要附带login接口回传的session，否则返回错误信息。

### 1.登陆，API名：login

__&#8226; 完整路径：__
http://{hostname}:{port}/user/login

__&#8226; 必选参数：__
username（用户名）,password（密码）

__&#8226; 示例代码（C#）：__

```csharp
HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create("http://127.0.0.1/user/login");

using (Stream stream = req.GetRequestStream())
{
    string paramstr = "username=S04111021&password=123";
    byte[] bin = Encoding.UTF8.GetBytes(paramstr);
    stream.write(bin, 0, bin.Length);
}

HttpWebResponse res = (HttpWebResponse)req.GetResponse();

string ResStr = "";

using (Stream stream = res.GetResponseStream())
{
    StreamReader reader = new StreamReader(stream);
    ResStr = reader.ReadToEnd();
}
```
__&#8226; 返回格式为JSON，形式如下：__

``` js
{
    "Result":true,
    "Detail":"JSESSIONID=9795BE0A70AFD7F99435CD129CFD5FDB; Path=/opac_two"
}
```

登陆成功则Result为true，Detail为登陆成功后的Session，再次请求时可能会用到，请注意保持，登陆失败Result则为false，Detail为失败信息。

### 2.用户信息，API名：info

__&#8226; 完整路径：__ 
http://{hostname}:{port}/user/info

__&#8226; 支持方法：__ GET、POST

__&#8226; 必选参数：__ session（登陆成功后回传的Session）

__&#8226; 返回格式为JSON，形式如下：__

``` js
{
	"Result":true,  //标识请求是否成功
	"Detail":
	{
	    "ID":"xxxxxxxxx",  //学号
	    "Name":"xxxxxx",  //姓名
	    "From":"2011-09-02",  //有效期开始日期
	    "To":"2015-07-01",  //有效期结束日期
	    "ReaderType":"本科生",  //用户类别
	    "Department":"计科1101",  //行政单位
	    "Debt":0  //欠费金额
	}
}
```

### 3.用户借阅历史，API名：history

__&#8226; 完整路径：__ http://{hostname}:{port}/user/history

__&#8226; 支持方法：__ GET、POST

__&#8226; 必选参数：__ session（登陆成功后回传的Session）

__&#8226; 返回格式为JSON，形式如下：__

``` js
{
	"Result":true,  //标识请求是否成功
	"Detail":
	[
		{
			"Title":"深入浅出Ext JS",  //书名
			"Barcode":"03455293",  //内部条形码
			"Type":"续借",  //操作类型，分为：借书、续借、还书
			"Date":"2014-06-23"  //操作日期
		},
		...
	]
}
```

### 4.用户当前借阅情况，API名：rent

__&#8226; 完整路径：__ http://{hostname}:{port}/user/rent

__&#8226; 支持方法：__ GET、POST

__&#8226; 必选参数：__ session（登陆成功后回传的Session）

__&#8226; 返回格式为JSON，形式如下：__

``` js
{
	"Result":true,  //标识请求是否成功
	"Detail":
	[
		{
		    "Title":"编译原理解题与分析",  //书名
		    "Barcode":"01386243",  //图书馆内部条形码
		    "Department":"通信计算机库（长安校区）",  //所在分馆
		    "State":"本馆续借",  //当前状态
		    "Date":"2014-07-22",  //应还日期
		    "CanRenew":false  //是否可续借
		    "Department_id":"05"  //书库ID号，用于续借
		    "Library_id":"A"  //分馆ID号，用于续借
		},
		...
	]
}
```

### 5.图书续借，API名：renew

__&#8226; 完整路径：__ http://{hostname}:{port}/user/renew

__&#8226; 支持方法：__ GET、POST

__&#8226; 必选参数：__

1. session（登陆成功后回传的Session）
2. barcode（查询续借的图书时所获取的图书馆内部条形码）
3. department_id（查询续借的图书时所获取的书库ID号）
4. library_id（查询续借的图书时所获取的分馆ID号）

__&#8226; 返回格式为JSON，形式如下：__

``` js
{
	"Result":true,  //标识请求是否成功
	"Detail":
	{
		"2014-08-20"  //新的还书日期
    }
}
```

### 6.图书收藏，API名：favorite

__&#8226; 完整路径：__ http://{hostname}:{port}/user/favorite

__&#8226; 支持方法：__ GET、POST

__&#8226; 必选参数：__ session（登陆成功后回传的Session）

__&#8226; 返回格式为JSON，形式如下：__

``` js
{
	"Result":true,  //标识请求是否成功
	"Detail":
	[
		{
		    "Title":"21天学通Java",//书名
		    "Pub":"电子工业出版社",//出版社
		    "Sort":"TP312JA",//索书号
		    "Author":"庞永庆,庞丽娟,"//作者
		    "ISBN":"9787121078972",//条形码
		    "ID":"01h0019548"//图书馆内控制号
		},
	    ...
    ]
}
```
### 7.添加图书收藏，API名：addFav

__&#8226; 完整路径：__ http://{hostname}:{port}/user/addFav

__&#8226; 支持方法：__ GET、POST

__&#8226; 必选参数：__

1. session（登陆成功后回传的Session）
2. id(图书馆内控制号)

__&#8226; 返回格式为字符串，说明如下:__

* ADDED_SUCCEED：收藏成功
* ALREADY_IN_FAVORITE：已经收藏过了
* ADDED_FAILED：收藏失败
* USER_NOT_LOGIN：用户未登录（session过期）
* PARAM_ERROR：参数错误，缺少参数

### 8.删除图书收藏，API名: delFav

__&#8226; 完整路径：__ http://{hostname}:{port}/user/delFav

__&#8226; 支持方法：__ GET、POST

__&#8226; 必选参数：__

1. session（登陆成功后回传的Session）
2. id(图书馆内控制号)
3. username(用户名eg：S04111176)

__&#8226; 返回格式为字符串，说明如下：__

* DELETED_SUCCEED：删除成功
* DELETED_FAILED：删除失败
* USER_NOT_LOGIN：用户未登录（session过期）
* PARAM_ERROR：参数错误，缺少参数

## 新闻公告

__&#8226; 二级路径：__ /news

__&#8226; 注：__ 新闻公告接口全部可使用GET或POST方法，且不限制参数形式。

### 1.公告、新闻列表，API名：getList
   
__&#8226; 完整路径：__ 
http://{hostname}:{port}/news/getList/{type}/{page} 
   
__&#8226; 必选参数：__ 
type（“news”（新闻）、“announce”（公告）供选，其他值则报错）
page（所查询的公告页数，超出范围自动跳至第一页，最新为1，不填报错）
   
__&#8226; 返回格式为JSON，形式如下：__
   
``` js
{
    "Result":true,  //标识请求是否成功
    "Detail":
   	{
   	    "Type":"公告",  //当前请求的文章列表类别
   	    "CurrentPage":1,  //当前请求的页数
   	    "Pages":7,  //总共的页数
   	    "Amount":130,  //总数
   	    "Data":  //公告详情
   	    [
   	        {
   	            "ID":163,  //文章ID，用于获取文章详情
   	            "Title":"关于暑假期间我校图书馆电子资源访问方式的通知",  //标题
   	            "Date":"2014-07-07"  //发布日期
   	        },...
   	    ]
   	}
}
```
   
### 2.公告、新闻详情，API名：getDetail
   
__&#8226; 完整路径：__ 
http://{hostname}:{port}/news/getDetail/{type}/{format}/{id}
   
__&#8226; 必选参数：__ 
type（“news”（新闻）、“announce”（公告）供选，其他值则报错）
format（“html”（正文使用HTML格式）、“text”（正文使用纯文本格式）供选，其他值则报错）
id（从列表中获取到的新闻或公告的id）
   
__&#8226; 返回格式为JSON，形式如下：__
   
``` js
{
    "Result":true,  //标识请求是否成功
    "Detail":
    {
        "Title":"图书馆召开2014年度电子文献资源议标（询价）会",  //标题
        "Publisher":"图书馆",  //发布者
        "Date":"2014-6-25",  //发布日期
        "Passage":"<p><font>&#x3000;&#x3000;&#x4E3A;&#x4E86;&#x4E……"  //正文
    }
}
```

## 图书检索

__&#8226; 二级路径：__ /book

__&#8226; 注：__ 图书检索接口全部可使用GET或POST方法，但检索关键词中的特殊符号需要进行URL转义！

### 1.图书检索，API名：search
   
__&#8226; 完整路径：__ 
http://{hostname}:{port}/book/search
   
__&#8226; 必选参数：__ keyword（关键词，必须对特殊符号，如“#、%、$”等，进行URL转义处理，否则不被识别）

__&#8226; 可选参数：__ 

wordType（检索词类型，默认为1，即：所有题名，1-9供选，分别对应图书馆的9种检索词类型，即：所有题名、出版社、索书号、作者、标准号、主题词、图书条码、分类号、题名缩拼）

matchMethod（匹配方式，默认为qx，即：前向匹配，qx、mh、jq供选，即：前向匹配、模糊匹配、精确匹配）

recordType（资料类型，默认为all，即：全部，注：图书馆中“所有类型”不可用，供选值为："all"、"01"、"02"、"03"、"04"、"11"、"12"、"13"、"14"、"c1"、"e1"、"s1"、"z1"，对应：全部、中文图书、西文图书、日文图书、俄文图书、中文期刊、西文期刊、日文期刊、俄文期刊、中文报纸、西文报纸、数据库、年鉴）

size（每页返回的最大图书信息条数，默认为20）

page（设置请求的页数，默认为1，超出范围报错）

ordersc（排序顺序，默认为desc，供选：asc为顺序，desc为逆序）

orderby（排序依据，默认为pubdate_date，即：出版年，供选值：pubdate_date（出版年）,title（题目）,authors（责任者/作者）,publisher（出版社）,isn（标准号））
   
__&#8226; 返回格式为JSON，形式如下：__
   
``` js
{
    "Result":true,  //标识请求是否成功
    "Detail":
    {
        "Ammount":258,  //所查询到的图书信息总数
        "CurrentPage":1,  //当前页码
        "Pages":13,   //总页数
        "Size":20,   //本页图书信息数量
        "Keyword":"c#",  //检索关键词
        "RecordType":"全部",  //资料类型
        "KeywordType":"所有题名",   //检索词类别
        "MatchType":"前向匹配",   //匹配方式
        "OrderBy":"出版年",   //排序依据
        "OrderSc":"逆序",   //排序顺序
        "BookData":   //图书信息数组
        [
            {
                "ID":"01h0079766",   //图书馆内部控制号
                "Title":"C#5.0入门经典 = Sams teach yourself C# 5.0 in 24 hours ",   //书名，题目
                "Author":"多曼,刘琦,袁国忠,",   //责任者，作者
                "Pub":"人民邮电出版社",   //出版社
                "ISBN":"9787115344236",   //标准号
                "Year":2014,   //出版年
                "Sort":"TP312C/1431",  //图书馆索书号
                "Total":4,   //图书馆藏书数量
                "Avaliable":2   //可借阅数量
            },……
        ]
    }
}
```

### 2.图书详情，API名：detail
   
__&#8226; 完整路径：__ 
http://{hostname}:{port}/book/detail/id/{id} 或 http://{hostname}:{port}/book/detail/barcode/{barcode}
   
__&#8226; 必选参数：__ id或barcode（控制号或条形码）

__&#8226; 返回格式为JSON，形式如下：__
   
``` js
{
    "Result":true,  //标识请求是否成功
    "Detail":
    {
        "ISBN":"9787115341440",  //所查图书的ISBN
        "SecondTitle":"Object oriented programming of C++",  //副标题
        "Pub":"北京  :人民邮电出版社 ,2014.2",  //出版信息
        "Tilte":"C + + 面向对象程序设计 Object oriented programming of C++",  //书名、主标题
        "Form":"245页  :图  ;26cm",  //载体形态
        "Author":"宋春花 4主编 吕进来 4主编 马建芬 4编著 程鹏 4编著 王幸民 4编著",   //作者
        "Sort":"TP312C++",  //中图分类号
        "Subject":"C语言  --程序设计",  //主题
        "RentTimes":2,  //借阅次数
        "FavTimes":0,   //收藏次数
        "BrowseTimes":1,   //浏览次数
        "Total":4,   //藏书数量
        "Avaliable":2,   //可借数量
        "CirculationInfo":   //流通信息数组
        [
            {
                "Barcode":"03451696",   //条形码
                "Sort":"TP312C++/521",   //索书号
                "Department":"通信计算机库（长安校区）",   //所在部门
                "Status":"本馆借出",   //状态
                "Date":"2014/07/21"   //应还日期，可借则为null
            },……
        ],
        "ReferBooks":   //相关图书信息数组
        [
            {
                "ID":"01h0077946",  //控制号
                "Title":"C++程序设计基础教程",   //书名
                "Author":"孙涛,"   //作者
            },
        ],
       "DoubanInfo":   //来自豆瓣的图书信息，若豆瓣数据库无该书信息则为null
        {
            "Rating":  //评分
            {
                "max":10,  //满分
                "numRaters":2,  //评分次数
                "average":"0.0",   //平均分
                "min":0   //最低分
            },
            "Author":  //作者
            [
                "Pedro Teixeria"
            ],
            "PubDate":"2013-12-1",  //出版日期
            "Binding":"平装",   //装订类型
            "Pages":"368",   //页数
            "Images":  //封面图片
            {
                "small":"http://img5.douban.com/spic/s27188987.jpg",  //小图
                "large":"http://img5.douban.com/lpic/s27188987.jpg",  //大图
                "medium":"http://img5.douban.com/mpic/s27188987.jpg"  //中图
            },
            "Publisher":"清华大学出版社",  //出版社
            "ISBN10":"7302344418",   //10位标准号
            "ISBN13":"9787302344414",   //13位标准号
            "Title":"Node.js高级编程",  //书名
            "Alt_Title":"Professional Node.js: Building JavaScript-Based Scalable Software",  //副标题
            "Author_Info":"Pedro Teixeria是一位高产的开源项目程序员………………",  //作者简介
            "Summary":"Node.js是一种主流框架……………………",   //图书简介
            "Price":"58.00"   //价格
        }
    }
}
```
### 3.排行榜，API名：rank
   
__&#8226; 完整路径：__ http://{hostname}:{port}/book/rank

__&#8226; 支持方法：__ GET、POST
  
__&#8226; 可选参数：__ type(默认请求'1')  size(默认最少为10，最大为100，超出或少于这个范围默认为10)

type字段说明：

 '1':借阅排行榜
 
 '2':检索排行榜
 
 '3':收藏排行榜
 
 '4':书评排行榜
 
 '5':查看排行榜

__&#8226; 返回格式为JSON，形式如下：__
   
``` js
{
    "Result":true,
    "Detail":[
    {
    "Rank":"1",//排行
    "Title":" 复变函数全程学习指导与解题能力训练",//书名
    "Sort":"O174.5",//分类号
    "BorNum":"3576",//（借阅、检索、收藏、书评、查看）次数
    "ID":"0100044878"//图书馆内控制号
    }
    ……
    ]
}
```

注：

1.图书信息字段不固定，有可能会产生Summary（简介），或其他信息不完整情况！

2.建议使用id（控制号）查询图书，以barcode（条形码）查询速度较慢！


失败则在返回内容中，Result字段值为false，Detail字段为错误信息。

## 错误或无效信息

账号错误，密码错误或账户不存在：ACCOUNT_ERROR

用户未登陆：USER_NOT_LOGIN

记录为空：NO_RECORD

远程服务器错误：REMOTE_SERVER_ERROR

参数错误：PARAM_ERROR

续借失败：RENEW_FAILED

超出范围：OUT_OF_RANGE


更多API正在开发中！

如有疑问可发邮件至：yuanguozheng@msn.cn
