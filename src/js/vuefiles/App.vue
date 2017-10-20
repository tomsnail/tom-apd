<template>
    <div class="parent">
        <div id="indexcontent">

            <!--<el-row>

                    <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                        <el-menu-item  v-for="(menu,index) in mainmenus"  v-bind:index="menu.index+'=='+menu.url" v-bind:path="menu.url">{{menu.name}}</el-menu-item>


                    </el-menu>


            </el-row>-->
            <router-view></router-view>
        </div>

    </div>
</template>

<script>
    export default {
        data () {
            return {
                mainmenus:[
                    {name:"首页",index:"1",url:"/index"},{name:"设置",index:"2",url:"/setting"},
                    {name:"联系我们",index:"3",url:"/contract"}
                ]
            }
        },

        methods: {
            dd(){
                const router = this.$router;
                router.push({path:'/about'});
            },
            handleSelect(key, keyPath) {
                console.log("key:"+key);
                console.log("keypath:"+keyPath);
                var index=key.split('==')[0];
                var path=key.split('==')[1];
                const router = this.$router;
                router.push({path:path});
            },
        }
    }
</script>

<style>
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
    }
</style>
