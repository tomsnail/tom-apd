<template>
    <div id="editor">
        <!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">-->
            <!--<el-radio-button :label="false">展开</el-radio-button>-->
            <!--<el-radio-button :label="true">收起</el-radio-button>-->
        <!--</el-radio-group>-->
        <div class="menu">
            <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                    </template>
                    <el-menu-item-group v-for="content in list ">
                        <el-menu-item index='' @click="openTi(content.url)">{{content.title}}</el-menu-item>
                        <!--<el-menu-item index="1-2">选项2</el-menu-item>-->
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </div>


        <div v-if="isshow">
            <el-form ref="form" :model="form" label-width="80px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="标题:">
                            <el-input v-model="title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="作者:">
                            <span>{{author}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <mavon-editor v-model="value" style="height: 450px"></mavon-editor>

                <el-form-item class="btn">
                    <el-button type="primary" @click="onSubmit">保存并预览</el-button>
                    <el-button type="primary" @click="save">保存</el-button>
                    <!--<el-button type="primary" @click="goPage">返回聚合页</el-button>-->
                </el-form-item>

            </el-form>
        </div>

        <div v-else="isshow">
            <div class="show-top">
                <el-row>
                    <el-col :span="24">
                        <div><h3>{{title}}</h3></div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div><span>{{author}} 创建于: <span class="date">{{date}}</span> 最后一次修改时间：<span class="date">{{date2}}</span></span>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="text-align: right">
                            <el-button type="primary" @click="openEdit">编辑</el-button>
                            <!--<el-button type="primary" @click="goPage">返回聚合页</el-button>-->
                        </div>
                    </el-col>
                </el-row>

            </div>
            <div class="show-bot">
                <vue-markdown :source="comment"></vue-markdown>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    // Local Registration
    // import mavonEditor from 'mavon-editor'
    var mavonEditor = require('mavon-editor')
    import 'mavon-editor/dist/css/index.css'
    import VueMarkdown from 'vue-markdown';
    export default {
        name: 'editor',
        components: {
            'mavon-editor': mavonEditor.mavonEditor,
            VueMarkdown
        },
        data()
    {
        return {
            list:[],
            comment: "",
            title: "",
            author: "",
            date: "",
            date2: "",
            form: {
                delivery: false,
            },
            value: '',
            cId: "",
            isshow: false,
            isCollapse: true
        }
    },
    mounted: function () {
        var self = this;
        self.getData();
        self.getList();
    },
    methods: {
//        获取指定内容页数据
        getData: function () {
            var self = this;
            var url = window.location.href.split("editor/")[1];
            console.log("url:" + url)
            self.cId = url.split(".")[0];
            console.log(self.cId);
            var par = {"pid": parseInt(self.cId)};
            this.$http.post("/conData.do", par).then(function (res) {
                console.log(res)
                self.title = res.body.title;
                self.author = res.body.author;
                self.date = res.body.date;
                self.date2 = res.body.date2;
                self.comment = res.body.contents;
                self.value = res.body.contents;
                if (res.body.contents == "") {
                    self.comment = "欢迎使用"
                }
                if (res.body.date2 == "") {
                    self.date2 = "暂无"
                }
            })
        }
    ,
        getList: function () {
            var self = this;
            this.$http.post("/getConData.do").then(function (res) {
                console.log(res)
                self.list = res.body;
            })
        },
        openTi:function(e){
            console.log(e);
            window.location.href =e;
        },
        openEdit: function () {
            this.isshow = true;
        }
    ,
//     保存并预览
        onSubmit()
        {
            var self = this;
            var myDate = new Date();
            var date = myDate.toLocaleString();//最后编辑时间
//                console.log(date)
            var pr = {
                "id": parseInt(self.cId),
                "author": self.author,
                "title": self.title,
                "contents": self.value,
                "date2": date
            }
            this.$http.post("/editContent.do", pr).then(function (res) {
                if (res.data == 'success') {
                    window.location.reload();
                }
            })
        }
    ,
        //保存
        save:function () {
            var self = this;
            var myDate = new Date();
            var date = myDate.toLocaleString();//最后编辑时间
//                console.log(date)
            var pr = {
                "id": parseInt(self.cId),
                "author": self.author,
                "title": self.title,
                "contents": self.value,
                "date2": date
            }
            this.$http.post("/editContent.do", pr).then(function (res) {
                if (res.data == 'success') {
                    self.$notify({
                        title: '成功',
                        message: '编辑保存成功',
                        type: 'success'
                    });
                } else {
                    self.$notify.error({
                        title: '错误',
                        message: '编辑保存失败'
                    });
                }

            })

        }
    ,
        handleOpen(key, keyPath) {

            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
//        跳聚合页页
//        goPage:function () {
//            window.location.href = '/main';
//        }

    }
    }

</script>
<style>
    * {
        font-family: "Microsoft YaHei";
    }

    #editor {
        margin: 40px auto;
        width: 80%;
    }

    .btn {
        margin-top: 20px;
    }

    .date {
        font-size: 13px;
        color: gray;
    }

    .show-top {
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(34, 36, 38, .15);
        margin-bottom: 10px;
    }

    .show-bot {
        box-shadow: 0px 1px 2px 0px rgba(34, 36, 38, 0.15);
        border: 1px solid rgba(34, 36, 38, .15);
        border-radius: 5px;
    }
    /*.el-menu-vertical-demo:not(.el-menu--collapse) {*/
        /*width: 200px;*/
        /*min-height: 400px;*/
    /*}*/
    .menu{
        position: fixed;
        top: 200px;
        left:50px;
        z-index: 99;
    }
</style>
