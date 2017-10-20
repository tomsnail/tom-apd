<template>
    <div id="msg">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                msg: '',
            }
        },

        methods: {

        }
    }
</script>

<style>
    #msg {
        font-family: Helvetica, sans-serif;
        text-align: center;
    }
</style>
