var express = require('express');
var router = express.Router();
var database=require('../service/data.js');
var pageDd=database.ConnetcDb("page");
var contentDb=database.ConnetcDb("content");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/index.html', { title: 'Express' });

});
router.get('/main', function(req, res, next) {
    res.render('../views/mainIndex.html', { title: 'togethePage' });

});
router.get('/main/*', function(req, res, next) {
    var tmplHtml = req.originalUrl+'';
    tmplHtml = tmplHtml.split("main/")[1];
    console.log(tmplHtml);
    tmpId = tmplHtml.split(".")[0]
    var str=pageDd.get('name')
        .find({ id: parseInt(tmpId) })
        .get("name")
       .value()
    console.log(str)
    //取数据库id
    res.render('../views/mainIndex.html',{ title: str });
});
router.get('/editor', function(req, res, next) {
    res.render('../views/editor.html', { title: 'editor' });

});
router.get('/editor/*', function(req, res, next) {
    var tmplHtml = req.originalUrl+'';
    tmplHtml = tmplHtml.split("editor/")[1];
    console.log(tmplHtml);
    tmpId = tmplHtml.split(".")[0]
    var str=contentDb.get('content')
        .find({ id: parseInt(tmpId) })
        .get("title")
        .value()
    //console.log(str)
    res.render('../views/editor.html',{ title: str});
});

//查询所有聚合页数据
router.post('/getAllData.do',function (req,res,next) {
    var str=pageDd.get('name')
        .value()
    res.send(str);
});
//查询指定id的聚合页
router.post('/getData.do',function (req,res,next) {
    var pageId = req.body.pid;
  console.log("lalalala:"+req.body.pid);
  var str=pageDd.get('name')
      .find({ id: pageId })
      .value()
  res.send(str);
});
//添加聚合页
router.post('/addPage.do',function (req,res,next) {
    var str=req.body;
// Add a post
    pageDd.get('name')
        .push(str)
        .write()
    res.send('success');
});

//添加组
router.post('/addData.do',function (req,res,next) {
  var str=req.body.group;
    var pageId = req.body.pid;
// Add a post
    pageDd.get('name')
      .find({ id: pageId })
      .get('contents')
      .push(str)
      .write()
  res.send('success');
});

//添加子项
router.post('/addItems.do',function (req,res,next) {
    var pageId = req.body.pid;
    var gid = req.body.id;
    var str=req.body.title;
    pageDd.get('name')
        .find({ id: pageId })
        .get('contents')
        .find({ id: gid })
        .get('labels')
        .push(str)
        .write()
    res.send('success');
});

//删除聚合页
router.post('/delPage.do',function (req,res,next) {
    var pageId= req.body.pid;
    pageDd.get('name')
        .remove({id: pageId})
        .write()
    res.send('success');
});

//删除组
router.post('/delGroup.do',function (req,res,next) {
    var pageId = req.body.pid;
    var Id=req.body.id;
    pageDd.get('name')
        .find({ id: pageId })
        .get('contents')
        .remove({id:Id})
        .write()
    res.send('success');
});

//删除子项
router.post('/delItems.do',function (req,res,next) {
    var pageId = req.body.pid;
    var itemId=req.body.itemId;
    var groupId=req.body.groupId;
    pageDd.get('name')
        .find({ id: pageId })
        .get('contents')
        .find({id:groupId})
        .get('labels')
        .remove({id:itemId})
        .write()
    res.send('success');
});

//编辑组
router.post('/editGroup.do',function (req,res,next) {
    var pageId = req.body.pid;
    var groupId=req.body.groupId;
    var name=req.body.name;
    var groupIndex=req.body.groupIndex;
    pageDd.get('name')
        .find({ id: pageId })
        .get('contents')
        .chain()
        .find({id:groupId})
        .assign({name:name,groupIndex:groupIndex})
        .write()
    res.send('success');
})

//编辑子项
router.post('/editItems.do',function (req,res,next) {
    var pageId = req.body.pid;
    var groupId=req.body.groupId;
    var itemId=req.body.itemId;
    var name=req.body.name;
    var href=req.body.href;
    var src=req.body.src;
    var itemIndex=req.body.itemIndex;
    pageDd.get('name')
        .find({ id: pageId })
        .get('contents')
        .find({id:groupId})
        .get('labels')
        .find({id:itemId})
        .chain()
        .assign({labelname:name,href:href,src:src,itemIndex:itemIndex})
        .write()
    res.send('success');
})


//查询所有内容页数据
router.post('/getConData.do',function (req,res,next) {
    var str=contentDb.get('content')
        .value()
    res.send(str);
});
//查询指定id的内容页
router.post('/conData.do',function (req,res,next) {
    var pageId = req.body.pid;
    console.log("lalalala:"+req.body.pid);
    var str=contentDb.get('content')
        .find({ id: pageId })
        .value()
    res.send(str);
    console.log(str)
});
//添加内容页
router.post('/addContent.do',function (req,res,next) {
    var str=req.body;
    contentDb.get('content')
        .push(str)
        .write()
    res.send('success');
});
//删除列表内容页
router.post('/delContent.do',function (req,res,next) {
    var pageId= req.body.pid;
    contentDb.get('content')
        .remove({id: pageId})
        .write()
    res.send('success');
});
//编辑内容页
router.post('/editContent.do',function (req,res,next) {
    var Id = req.body.id;
    var author=req.body.author;
    var title=req.body.title;
    var contents=req.body.contents;
    var date2=req.body.date2;
    contentDb.get('content')
        .find({ id: Id })
        .assign({title:title,author:author,contents:contents,date2:date2})
        .write()
    res.send('success');
});


module.exports = router;
