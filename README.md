XiyouLibNodeExpress
===================

西邮图书馆Web API-Node.js

### 简单介绍
使用Node.js Express框架开发的西邮图书馆Web API，通过模拟网站登陆的形式抓取西邮图书馆Web页面并返回JSON或JSONP给访问者，目前仅支持获取用户借阅历史。

默认监听18000端口，部署前请使用 npm install 命令补全依赖包！

百度云挂上去没有作用，所以就没按照百度云上的要求来做。

### API调用方式介绍

所有API使用POST方法提交，使用GET方法报错，JSON请求URL形式为：http://yourdomain/?api={具体的api名}，JSONP请求URL形式为：http://yourdomain/?api={具体的API名}&jsonp={回掉函数名}，格式错误则会提示NOT_FOUND错误。

### 用户登陆，API名：login

必选参数：username（用户名）,password（密码）

示例代码（C#）：

```csharp
HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create("http://127.0.0.1/?api=login");

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
返回格式为JSON，形式如下：

``` js
{
    "Result":true,
    "Detail":[xxxxxxxxxxxxxxxxx]
}
```

登陆成功则Result为true，Detail为登陆成功后的Session，再次请求时可能会用到，请注意保持，登陆失败Result则为false，Detail为失败信息。

### 用户借阅历史，API名：history

必选参数：session（登陆成功后回传的Session）

返回格式为JSON，形式如下：

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

失败则返回false和相关错误信息

如有疑问可发邮件至：yuanguozheng@msn.cn
