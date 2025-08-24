<template>
    <div class="category">
        <div class="title">专题 <div class="line"></div> 精选视频</div>
        <div v-for="(item) in list" :key="item.id" @click="onGo('/cateInfo',item)" class="catitem">
            <img :src="item.path" style="width: 100%;height: 165px;" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter()
import O1 from "./../assets/topics/01.jpg"
import O2 from "./../assets/topics/02.jpg"
import O3 from "./../assets/topics/03.jpg"
import O4 from "./../assets/topics/04.jpg"
import O5 from "./../assets/topics/05.jpg"
import O6 from "./../assets/topics/06.jpg"
import O7 from "./../assets/topics/07.jpg"
import O8 from "./../assets/topics/08.jpg"
import { ref } from "vue"
const list = ref<any>([  {
    title:'超清无码',
    path:O1,
    code:30,
    sonTypeCode: null
},{
    title:'华语大制作',
    path:O2,
     code:34,
     sonTypeCode:"81,82"
},{
    title:'黑料不打烊',
    path:O3,
    sonTypeCode: null,
    code: 33
},{
    title:'水果派',
    path:O4,
      sonTypeCode: "134",
    code: 31
},{
    title:'探花系列',
    path:O5,
       sonTypeCode: "68",
    code: 62
},{
    title:'乱伦精选',
    path:O6,
          sonTypeCode: "135",
    code: 62
},{
    title:'深夜保健室',
    path:O7,
            sonTypeCode: null,
    code: 53
},{
    title:'中文剧情',
    path:O8,
   sonTypeCode: "93",
    code: 31
}])
const onGo = (path: any,item:any) => {
    router.push({
        path: path,
        query:{
            item:encodeURIComponent(JSON.stringify(item)) 
        }
    })
}
</script>
<style lang="less" scoped>
.category {
    height: calc(100vh - 50px);
    overflow: auto;
    padding: 10px;

    .title {
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 10px;
        color: var(--primary-color);
        width: 100%;
        display: flex;
        align-items: center;
        .line{
            width: 3px;
            height: 16px;
            background-color: var(--primary-color);
            border-radius: 3px;
            margin: 0 10px;
        }
    }
    .catitem{
        margin-bottom: 10px;
    }
}
</style>