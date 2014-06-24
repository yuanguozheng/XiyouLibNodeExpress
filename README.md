XiyouLibNodeExpress
===================

西邮图书馆Web API-Node.js

使用Node.js Express框架开发的西邮图书馆Web API，通过模拟网站登陆的形式抓取西邮图书馆Web页面并返回JSON或JSONP给访问者，目前仅支持获取用户借阅历史。

默认监听18000端口，部署前请使用 npm install 命令补全依赖包！

百度云挂上去没有作用，所以就没按照百度云上的要求来做。

API调用方式介绍：

所有API使用POST方法提交，使用GET方法报错，JSON请求URL形式为：http://yourdomain/?api={具体的api名}，JSONP请求URL形式为：http://yourdomain/?api={具体的API名}&jsonp={回掉函数名}，格式错误则会提示NOT_FOUND错误。

1.用户登录，API名：login

必选参数：username,password

示例代码（C#）：

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

返回格式为JSON，形式如下：

{
    "Result":true,
    "Detail":[xxxxxxxxxxxxxxxxx]
}

登录成功则Result为true，Detail为登录，否则为false，Detaildf
