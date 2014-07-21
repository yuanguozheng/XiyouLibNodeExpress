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
http://{hostname}:{port}/{api类别}/{api名}?{参数（可选）}&callback={回掉函数名}，格式错误则会提示NOT_FOUND错误。

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
    "Detail":["JSESSIONID=9795BE0A70AFD7F99435CD129CFD5FDB; Path=/opac_two"]
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
		    "Date":"2014/07/22",  //应还日期
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

session（登陆成功后回传的Session）
barcode（查询续借的图书时所获取的图书馆内部条形码）
department_id（查询续借的图书时所获取的书库ID号）
library_id（查询续借的图书时所获取的分馆ID号）

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

## 新闻公告

__&#8226; 二级路径：__ /news

__&#8226; 注：__ 新闻公告接口全部可使用GET或POST方法，且不限制参数形式。

### 1.公告列表，API名：getAnnounceList
   
__&#8226; 完整路径：__ http://{hostname}:{port}/news/getAnnounceList
   
__&#8226; 可选参数：__ page（所查询的公告页数，不填或超出范围自动跳至第一页）
   
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
   
### 2.新闻列表，API名：getNewsList
   
__&#8226; 完整路径：__ http://{hostname}:{port}/news/getNewsList
   
__&#8226; 可选参数：__ page（所查询的新闻页数，不填或超出范围自动跳至第一页）
   
__&#8226; 返回格式为JSON，形式如下：__
   
``` js
{
    "Result":true,  //标识请求是否成功
    "Detail":
    {
        "Type":"新闻",  //当前请求的文章列表类别
        "CurrentPage":1,  //当前请求的页数
        "Pages":6,  //总共的页数
        "Amount":101,  //总数
        "Data":  //公告详情
        [
            {
      	        "ID":102,  //文章ID，用于获取文章详情
      	        "Title":"图书馆召开2014年度电子文献资源议标（询价）会",  //标题
      	        "Date":"2014-06-25"  //发布日期
      	    },...
        ]
    }
}
```

失败则在返回内容中，Result字段值为false，Detail字段为错误信息。

更多API正在开发中！

如有疑问可发邮件至：yuanguozheng@msn.cn
