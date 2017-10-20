<template>
    <div id="app">
        <!-- Form -->
        <backTop  :scrollmyself='true'></backTop>
        <div class="btns">
            <ul>
                <li>
                    <el-tooltip content="添加聚合页" placement="right" effect="light">
                        <el-button class="icon-btn" type="primary" @click="openPage"><i class="el-icon-star-off"></i>
                        </el-button>
                    </el-tooltip>
                </li>
                <li>
                    <el-tooltip content="添加内容页" placement="right" effect="light">
                        <el-button class="icon-btn" type="primary" @click="openContent"><i class="el-icon-document"></i>
                        </el-button>
                    </el-tooltip>
                </li>
                <li>
                    <el-tooltip content="添加组" placement="right" effect="light">
                        <el-button class="icon-btn" type="primary" @click="addGroupVisible=true"><i
                                class="el-icon-menu"></i></el-button>
                    </el-tooltip>
                </li>
                <li>
                    <el-tooltip placement="right" effect="light">
                        <el-button class="icon-btn" type="primary" @click="delShow" v-if="toggle"><i
                                class="el-icon-edit"></i></el-button>
                        <el-button class="icon-btn" type="primary" @click="comShow" v-else="toggle"><i
                                class="el-icon-circle-check"></i></el-button>
                        <div slot="content">{{tip}}</div>
                    </el-tooltip>
                </li>
            </ul>
        </div>

        <div v-for="content,index in sortContents " class="nav">
            <el-row>
                <el-col :span="12">
                    <div><span>{{content.name}}</span>
                        <el-button v-show="isshow" type="text" @click="editGroupOpen(content.id)"><i
                                class=" el-icon-edit"></i></el-button>
                    </div>
                    <el-button class="del-group" v-show="isshow" type="text" @click="delGroup(content.id)"><i
                            class=" el-icon-circle-close"></i></el-button>
                    <!--<el-button class="edit-group" v-show="isshow" type="text" @click="editGroupOpen(content.id)"><i class=" el-icon-edit"></i></el-button>-->
                </el-col>
                <el-col :span="12" class="btn-group">
                    <el-button type="text" :bind="content.id" @click="open(content.id)" v-show="none"><i class="el-icon-plus"></i>
                    </el-button>

                </el-col>
            </el-row>
            <div class="nav_items" v-for="label,index in sortLabels(content.id)">
                <div class="nav_item">
                    <el-button class="del" v-show="isshow" type="text" @click="del(label.id,content.id)"
                               :bind="label.id"><i class=" el-icon-circle-cross"></i></el-button>

                    <a :href="label.href" class="nav-block" target="_blank" :title="label.labelname">
                        <img :src="label.src" alt=""/>
                        <span class="nav-txt">{{label.labelname}}</span>
                    </a>
                    <span class="edit-btn"><el-button v-show="isshow" type="text"
                                                      @click="editItemOpen(label.id,content.id)"><i
                            class=" el-icon-edit"></i></el-button></span>
                </div>
            </div>
            <el-dialog title="添加子项" :visible.sync="dialogFormVisible" size="tiny">
                <el-form :model="form">
                    <el-form-item label="名称：" :label-width="formLabelWidth">
                        <el-input v-model="form.labelname" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="链接地址：" :label-width="formLabelWidth">
                        <el-input v-model="form.href" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="图标地址：" :label-width="formLabelWidth">
                        <el-input v-model="form.src" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序：" :label-width="formLabelWidth">
                        <el-input v-model="form.itemIndex" auto-complete="off"></el-input>
                    </el-form-item>


                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addItem()">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="添加聚合页" :visible.sync="dialogForm1Visible">
                <el-row>
                    <el-col :span="14">
                        <div class="grid-content bg-purple">
                            <template>
                                <el-table
                                        @cell-click="gotoPage"
                                        :data="tableData"
                                        style="width: 100%;cursor: pointer"
                                        height="250">
                                    <el-table-column
                                            prop="name"
                                            label="名称"
                                            width="100">
                                    </el-table-column>
                                    <el-table-column
                                            prop="url"
                                            width="220"
                                            label="链接地址">
                                    </el-table-column>
                                    <el-table-column
                                            label="操作">
                                        <template scope="scope">
                                            <el-button
                                                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                                                    type="text"
                                                    size="small">
                                                移除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div class="grid-content bg-purple-light">
                            <el-form :model="form1">
                                <el-form-item label="名称：" :label-width="formLabelWidth">
                                    <el-input v-model="form1.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer" style="text-align: center">
                                <el-button @click="dialogForm1Visible = false">取 消</el-button>
                                <el-button type="primary" :bind="content.id" @click="addPage()">确 定</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-dialog>

            <el-dialog title="添加内容页" :visible.sync="contentVisible">
                <el-row>
                    <el-col :span="14">
                        <div class="grid-content bg-purple">
                            <template>
                                <el-table
                                        @cell-click="gotoContent"
                                        :data="contentTable"
                                        style="width: 100%;cursor: pointer"
                                        height="250">
                                    <el-table-column
                                            prop="title"
                                            label="标题"
                                            width="100">
                                    </el-table-column>
                                    <el-table-column
                                            prop="author"
                                            width="100"
                                            label="作者">
                                    </el-table-column>
                                    <el-table-column
                                            prop="url"
                                            width="220"
                                            label="链接地址">
                                    </el-table-column>
                                    <el-table-column
                                            prop="date"
                                            width="120"
                                            label="时间">
                                    </el-table-column>
                                    <el-table-column
                                            label="操作">
                                        <template scope="scope">
                                            <el-button
                                                    @click.native.prevent="delContent(scope.$index, contentTable)"
                                                    type="text"
                                                    size="small">
                                                移除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div class="grid-content bg-purple-light">
                            <el-form :model="contentForm">
                                <el-form-item label="标题：" :label-width="formLabelWidth">
                                    <el-input v-model="contentForm.title" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-form>
                            <el-form :model="contentForm">
                                <el-form-item label="作者：" :label-width="formLabelWidth">
                                    <el-input v-model="contentForm.author" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer" style="text-align: center">
                                <el-button @click="contentVisible = false">取 消</el-button>
                                <el-button type="primary" :bind="content.id" @click="addContent()">确 定</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-dialog>


            <el-dialog title="添加组" :visible.sync="addGroupVisible" size="tiny">
                <el-form :model="addGroupForm">
                    <el-form-item label="组名称：" :label-width="formLabelWidth">
                        <el-input v-model="addGroupForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序：" :label-width="formLabelWidth">
                        <el-input v-model="addGroupForm.groupIndex" auto-complete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addGroupVisible = false">取 消</el-button>
                    <el-button type="primary" :bind="content.id" @click="addGroup()">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑组" :visible.sync="editGroupDetail" size="tiny">
                <el-form :model="editGroupForm">
                    <el-form-item label="组名称：" :label-width="formLabelWidth">
                        <el-input v-model="editGroupForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序：" :label-width="formLabelWidth">
                        <el-input v-model="editGroupForm.groupIndex" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editGroupDetail = false">取 消</el-button>
                    <el-button type="primary" :bind="content.id" @click="editGroup()">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="编辑子项" :visible.sync="editItems" size="tiny">
                <el-form :model="editItemForm">
                    <el-form-item label="名称：" :label-width="formLabelWidth">
                        <el-input v-model="editItemForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="链接地址：" :label-width="formLabelWidth">
                        <el-input v-model="editItemForm.url" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="图标地址：" :label-width="formLabelWidth">
                        <el-input v-model="editItemForm.src" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="排序：" :label-width="formLabelWidth">
                        <el-input v-model="editItemForm.itemIndex" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editItems = false">取 消</el-button>
                    <el-button type="primary" :bind="content.id" @click="editItem()">确 定</el-button>
                </div>
            </el-dialog>
        </div>

    </div>

</template>
<script type="text/ecmascript-6">
    import imgSrc from './../../images/icon.png'
    export default {
        data ()
        {
            return {
                contents: "",
                tableData: "",
                contentTable: "",
                rowtemplate: {"id": "", "name": "", "groupIndex": "", "labels": []},
                itemtemplate: {"id": "", "src": "", "href": "", "labelname": "", "itemIndex": ""},
                pagetemplate: {"id": "", "name": "", "url": "", "contents": [{"id": 1, "name": "默认组", "groupIndex": 0, "labels": [{"id":1,"itemIndex":1, "src": "/850e06e2a48b0c2efc7afa11344d2474.png","href":"","labelname":"默认子项"}]}]},
                contemplate: {"id": "", "title": "", "author": "", "url": "", "date": "", "contents": ""},
                dialogForm1Visible: false,
                dialogFormVisible: false,
                contentVisible: false,
                editGroupDetail: false,
                editItems: false,
                addGroupVisible: false,
                addGroupForm: {
                    name: '',
                    url: '',
                    groupIndex: ''
                },
                form: {
                    name: '',
                    url: '',
                    src: imgSrc,
                    itemIndex: ''
                },
                form1: {
                    name: '',
                    url: '',
                },
                contentForm: {
                    title: '',
                    author: ''
                },
                editGroupForm: {
                    name: '',
                    url: '',
                    src: '',
                },
                editItemForm: {
                    name: '',
                    url: '',
                    src: '',
                    itemIndex: ''
                },
                formLabelWidth: '100px',
                groupId: "",
                itemid: "",
                groupId2: "",
                toggle: true,
                isshow: false,
                a: 0,
                b: 0,
                pageId: '',
                rep: 0,
                tip:"点击编辑",
                none:true
            }

        },
        mounted: function () {
            var self = this;
            self.getData();
        },
        computed: {
            //组排序
            sortContents: function () {
                return _.orderBy(this.contents, 'groupIndex', 'desc')
            }
        },
        methods: {
            //表格内跳转到指定聚合页
            gotoPage: function (row, event, column) {
                if (event.label == "链接地址") {
                    window.location.href = row.url;
                }
            }
            ,
            //表格内跳转到指定内容页
            gotoContent: function (row, event, column) {
                if (event.label == "链接地址") {
                    window.open(row.url);
                }
            }
            ,

            //子项排序
            sortLabels: function (id) {
                var dd = [];
                this.contents.forEach(function (item) {
                    if (id == item.id) {
                        dd = item.labels
                    }
                })
                return _.orderBy(dd, 'itemIndex', 'desc')
            }
            ,

//        获取指定聚合页数据
            getData: function () {
                var self = this;
                var test = window.location.href;
                console.log("url:" + test)
                var url = test.split("main")[1];
                if (url == "") {
                    this.$http.post("/getAllData.do").then(function (res) {
                        console.log(res)
                        var gourl = res.body[0].url;
                        window.location.href = gourl;//main默认跳到第一个页面
                    })
//                    self.pageId=1;
                } else {
                    self.pageId = (url.split("/")[1]).split(".")[0];
                }
                console.log("zui"+self.pageId);
                var par = {"pid": parseInt(self.pageId)};
                this.$http.post("/getData.do", par).then(function (res) {
                    self.contents = res.body.contents;
                    if (self.contents.length == 0) {
                        self.contents.push({"id": 1, "name": "请先添加组", "groupIndex":0, "labels": []});
                        self.none = false;
                    }
                })
                self.none = true;
            }
            ,
            // 删除 聚合页
            deleteRow(index, rows)
            {
                var self = this;
                var pageId = rows[index].id;
                if(pageId==1){
                    self.$notify.error({
                        title: '错误',
                        message: '对不起,首页不能移除!'
                    });
                    return;
                }
                var par = {"pid": pageId};
                this.$http.post("/delPage.do", par).then(function (res) {
                    if (res.data == 'success') {
                        self.$notify({
                            title: '成功',
                            message: '删除聚合页成功',
                            type: 'success'
                        });
                        rows.splice(index, 1);
                    } else {
                        self.$notify.error({
                            title: '错误',
                            message: '删除聚合页名失败'
                        });
                    }

                })
            }
            ,
//        编辑显示
            delShow: function () {
                this.toggle = false;
                this.isshow = true;
                this.tip = "点击完成";
            }
            ,
//        完成显示
            comShow: function () {
                this.toggle = true;
                this.isshow = false;
                this.tip = "点击编辑";
            }
            ,
            //打开聚合页弹框
            openPage: function () {
                var self = this;
                this.$http.post("/getAllData.do").then(function (res) {
                    console.log(res)
                    self.tableData = res.body;
                })
                this.dialogForm1Visible = true;
            }
            ,
            // 添加聚合页确认
            addPage()
            {
                var self = this;
                var timestap = Date.parse(new Date());
                for (var i = 0; i < self.tableData.length; i++) {
                    if (self.tableData[i].name == self.form1.name) {
                        self.b = 1;
                        break;
                    } else {
                        self.b = 2;
                    }
                }
                if (self.b == 1) {
                    self.$notify.error({
                        title: '错误',
                        message: '您添加的聚合页名已存在'
                    });
                } else {
                    var test = window.location.href;
                    var url = "/";
                    self.pagetemplate.id = timestap;
                    self.pagetemplate.name = self.form1.name;
                    self.pagetemplate.url = url + 'main/' + timestap + '.html';
                    this.$http.post("/addPage.do", self.pagetemplate).then(function (res) {
                        if (res.data == 'success') {
                            self.$notify({
                                title: '成功',
                                message: '添加聚合页成功',
                                type: 'success'
                            });
                            self.tableData.unshift(self.pagetemplate);
                        } else {
                            self.$notify.error({
                                title: '错误',
                                message: '添加聚合页失败'
                            });
                        }


                    })
                }
//            this.dialogForm1Visible = false;
            }
            ,
            //打开内容页弹框
            openContent: function () {
                var self = this;
                this.$http.post("/getConData.do").then(function (res) {
                    console.log(res)
                    self.contentTable = res.body;
                })
                this.contentVisible = true;
            }
            ,
            // 添加内容页确认
            addContent()
            {
                var self = this;
                var timestap = Date.parse(new Date());
                for (var i = 0; i < self.contentTable.length; i++) {
                    if (self.contentTable[i].title == self.contentForm.title) {
                        self.rep = 1;
                        break;
                    } else {
                        self.rep = 2;
                    }
                }
                if (self.rep == 1) {
                    self.$notify.error({
                        title: '错误',
                        message: '您添加的内容页名已存在'
                    });
                } else {
                    var myDate = new Date();
                    var date = myDate.toLocaleString();
                    console.log(date)
                    var test = window.location.href;
                    console.log("url:" + test)
                    var url = test.split("main")[0];
                    self.contemplate.id = timestap;
                    self.contemplate.date = date;
                    self.contemplate.date2 = "";
                    self.contemplate.title = self.contentForm.title;
                    self.contemplate.contents = "";
                    self.contemplate.author = self.contentForm.author;
                    self.contemplate.url = url + 'editor/' + timestap + '.html';
                    this.$http.post("/addContent.do", self.contemplate).then(function (res) {
                        if (res.data == 'success') {
                            self.$notify({
                                title: '成功',
                                message: '添加内容页成功',
                                type: 'success'
                            });
                            self.contentTable.unshift(self.contemplate);
                        } else {
                            self.$notify.error({
                                title: '错误',
                                message: '添加内容页失败'
                            });
                        }


                    })
                }
            }
            ,
            // 表格删除 内容页
            delContent(index, rows)
            {
                var self = this;
                var pageId = rows[index].id
                var par = {"pid": pageId};
                this.$http.post("/delContent.do", par).then(function (res) {
                    if (res.data == 'success') {
                        self.$notify({
                            title: '成功',
                            message: '删除内容页成功',
                            type: 'success'
                        });
                        rows.splice(index, 1);
                    } else {
                        self.$notify.error({
                            title: '错误',
                            message: '删除内容页名失败'
                        });
                    }

                })
            }
            ,
            //添加组
            addGroup()
            {
                var self = this;
                var timestap = Date.parse(new Date());
                for (var i = 0; i < self.contents.length; i++) {
                    if (self.contents[i].name == self.addGroupForm.name) {
                        self.a = 1;
                        break;
                    } else {
                        self.a = 2;
                    }
                }
                if (self.a == 1) {
                    self.$notify.error({
                        title: '错误',
                        message: '您添加的组名已存在'
                    });
                } else {
                    //alert('新加组')
                    self.rowtemplate.id = timestap;
                    self.rowtemplate.name = self.addGroupForm.name;
                    self.rowtemplate.groupIndex = self.addGroupForm.groupIndex;
                    var par = {"group": self.rowtemplate, "pid": parseInt(this.pageId)};
                    this.$http.post("/addData.do", par).then(function (res) {
                        console.log(res)
                        if (res.data == 'success') {
                            self.contents.push(self.rowtemplate);
                            self.$notify({
                                title: '成功',
                                message: '添加组成功',
                                type: 'success'
                            });

                        } else {
                            self.$notify.error({
                                title: '错误',
                                message: '添加组失败'
                            });
                        }
//
                    })
                }
                this.addGroupVisible = false;
                self.getData();

            }
            ,
//        打开添加子项模态框
            open(e)
            {
                this.dialogFormVisible = true;
                this.groupId = e;
            }
            ,
//        添加子项确认
            addItem()
            {
                var timestap = Date.parse(new Date());
                var self = this;
                this.contents.forEach(function (item) {
                    if (self.groupId == item.id) {
                        self.itemtemplate.id = timestap;
                        self.itemtemplate.src = self.form.src;
                        self.itemtemplate.href = self.form.href;
                        self.itemtemplate.labelname = self.form.labelname;
                        self.itemtemplate.itemIndex = parseInt(self.form.itemIndex);
                        var par = {"id": self.groupId, "title": self.itemtemplate, "pid": parseInt(self.pageId)};
                        self.$http.post("/addItems.do", par).then(function (res) {
                            console.log(res)
//                        location.reload();
                            if (res.data == 'success') {
                                item.labels.push({
                                    id: timestap,
                                    src: self.form.src,
                                    href: self.form.href,
                                    labelname: self.form.labelname,
                                    itemIndex: parseInt(self.form.itemIndex)
                                })
                                self.$notify({
                                    title: '成功',
                                    message: '添加子项成功',
                                    type: 'success'
                                });
                            } else {
                                self.$notify.error({
                                    title: '错误',
                                    message: '添加子项失败'
                                });
                            }

                        })

                    }
                });
                this.dialogFormVisible = false;
                self.getData();
            }
            ,
            //打开编辑组模态框 设置默认值
            editGroupOpen(e)
            {
                this.editGroupDetail = true;
                this.groupId = e;
                var self = this;
                this.contents.forEach(function (item) {
                    if (self.groupId == item.id) {
                        self.editGroupForm.name = item.name;
                        self.editGroupForm.groupIndex = item.groupIndex;
                    }
                })
            }
            ,
            //编辑组确认
            editGroup()
            {
                var self = this;
//            console.log(self.editGroupForm.name);
                var pr = {
                    "groupId": this.groupId,
                    "name": self.editGroupForm.name,
                    "groupIndex": parseInt(self.editGroupForm.groupIndex),
                    "pid": parseInt(this.pageId)
                }
                this.contents.forEach(function (item) {
                    if (self.groupId == item.id) {
                        self.$http.post("/editGroup.do", pr).then(function (res) {
                            if (res.data == 'success') {
                                self.$notify({
                                    title: '成功',
                                    message: '编辑组成功',
                                    type: 'success'
                                });
                                item.name = self.editGroupForm.name;
                                item.groupIndex = parseInt(self.editGroupForm.groupIndex);
                            } else {
                                self.$notify.error({
                                    title: '错误',
                                    message: '编辑组失败'
                                });
                            }
                        })
                    }
                })
                this.editGroupDetail = false;
                self.getData();
            }
            ,
            //打开编辑子项模态框
            editItemOpen(e, id)
            {
                this.editItems = true;
                this.itemid = e;
                this.groupId2 = id;
//            console.log(this.itemid);
//            console.log(this.groupId);
                var self = this;
                this.contents.forEach(function (item) {
//                不加这层判断出bug
                    if (self.groupId2 == item.id) {
                        item.labels.forEach(function (i) {
                            if (self.itemid == i.id) {
                                console.log(item.labels);
                                console.log(self.itemid)
                                console.log(i.id)
                                self.editItemForm.name = i.labelname;
                                self.editItemForm.url = i.href;
                                self.editItemForm.src = i.src;
                                self.editItemForm.itemIndex = i.itemIndex;
                            }
                        })
                    }

//
                })
            }
            ,
            //编辑子项确认
            editItem()
            {
                var self = this;
                var pr = {
                    "pid": parseInt(this.pageId),
                    "itemId": this.itemid,
                    "groupId": this.groupId2,
                    "name": self.editItemForm.name,
                    "href": self.editItemForm.url,
                    "src": self.editItemForm.src,
                    "itemIndex": parseInt(self.editItemForm.itemIndex)
                }

                this.contents.forEach(function (item) {
                    if (self.groupId2 == item.id) {
                        item.labels.forEach(function (i) {
                            if (self.itemid == i.id) {
                                self.$http.post("/editItems.do", pr).then(function (res) {
                                    if (res.data == 'success') {
                                        self.$notify({
                                            title: '成功',
                                            message: '编辑子项成功',
                                            type: 'success'
                                        });
                                        i.labelname = self.editItemForm.name;
                                        i.href = self.editItemForm.url;
                                        i.src = self.editItemForm.src;
                                        i.itemIndex = self.editItemForm.itemIndex;
                                    } else {
                                        self.$notify.error({
                                            title: '错误',
                                            message: '编辑子项失败'
                                        });
                                    }

                                })

                            }
                        })
                    }

                })
                this.editItems = false;
                self.getData();
            }
            ,
//        删除子项
            del(itemId, e)
            {
                var self = this;
                this.groupId = e;
                var pr = {"pid": parseInt(this.pageId), "itemId": itemId, "groupId": self.groupId}
                this.contents.forEach(function (item) {
                    if (self.groupId == item.id) {
                        self.$http.post("/delItems.do", pr).then(function (res) {
//                        item.labels.splice(index, 1);
                            if (res.data == 'success') {
                                self.$notify({
                                    title: '成功',
                                    message: '删除子项成功',
                                    type: 'success'
                                });
                                location.reload();
                            } else {
                                self.$notify.error({
                                    title: '错误',
                                    message: '删除子项失败'
                                });
                            }
                        })

                    }
                });
            }
            ,
//        删除组

            delGroup(e)
            {
//            console.log(index);
                console.log(e);
                var self = this;
                var pr = {"id": e, "pid": parseInt(self.pageId)};
                this.$http.post("/delGroup.do", pr).then(function (res) {
//                this.contents.splice(index,1 );
                    if (res.data == 'success') {
                        location.reload();

                    } else {
                        self.$notify.error({
                            title: '错误',
                            message: '删除组失败'
                        });

                    }
                })

            }

        }
    }


</script>

<style>
    *, body {
        font-family: "Microsoft YaHei";
        list-style-type: none;
    }

    .nav {
        width: 1100px;
        margin: 20px auto 0;
        border: #ddd 1px solid;
        padding: 10px 0 13px 25px;
        overflow: hidden;
    }

    h1 {
        font-size: 14px;
        color: #333;
    }

    .nav_item {
        display: inline-block;
        float: left;
        margin-top: 15px;
        margin-right: 18px;
        position: relative;
        background: #f2f2f2;
    }

    .nav-block {
        width: 160px;
        height: 60px;
        line-height: 60px;
        position: relative;
        display: block;
    }

    img {
        position: absolute;
        top: 40%;
        left: 10px;
        margin-top: -10px;
        width: 32px;
        height: 32px;
    }

    .nav-txt {
        position: absolute;
        text-align: left;
        left: 50px;
        color: #333;
        font-size: 14px;
        max-width: 110px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
    }

    .btn-group {
        text-align: right;
        padding-right: 50px;
    }

    .icon-btn {
        margin-bottom: 5px;
        width: 45px;
        height: 45px;
    }

    .btns {
        position: fixed;top: 250px;left: 10px;z-index: 99
    }

    .del-group {
        position: absolute;
        top: -20px;
        left: -25px;
        color: gray !important;
    }

    .del {
        position: absolute;
        color: gray !important;
        /*right: 0;*/
        top: -10px;
        z-index: 99;
    }

    .edit-btn {
        position: absolute;
        right: 0;
        z-index: 99;
        top: 10px;
    }
</style>
