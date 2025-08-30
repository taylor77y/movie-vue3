<template>
    <div class="category">
        <div class="title">专题 <div class="line"></div> 精选视频</div>
        <div v-for="(item) in list" :key="item.id" @click="onGo('/cateInfo', item)" class="catitem">
            <img :src="item.path" style="width: 100%;height: 165px;" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter()

import { ref } from "vue"
const list = ref<any>([{
    title: '超清无码',
    path: '/topics/01.jpg',
    code: 30,
    sonTypeCode: null
}, {
    title: '华语大制作',
    path: '/topics/02.jpg',
    code: 34,
    sonTypeCode: "81,82"
}, {
    title: '黑料不打烊',
    path: '/topics/03.jpg',
    sonTypeCode: null,
    code: 33
}, {
    title: '水果派',
    path: '/topics/04.jpg',
    sonTypeCode: "134",
    code: 31
}, {
    title: '探花系列',
    path: '/topics/05.jpg',
    sonTypeCode: "68",
    code: 62
}, {
    title: '乱伦精选',
    path: '/topics/06.jpg',
    sonTypeCode: "135",
    code: 62
}, {
    title: '深夜保健室',
    path: '/topics/07.jpg',
    sonTypeCode: null,
    code: 53
}, {
    title: '中文剧情',
    path: '/topics/08.jpg',
    sonTypeCode: "93",
    code: 31
}])
const onGo = (path: any, item: any) => {
    router.push({
        path: path,
        query: {
            item: encodeURIComponent(JSON.stringify(item))
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

        .line {
            width: 3px;
            height: 16px;
            background-color: var(--primary-color);
            border-radius: 3px;
            margin: 0 10px;
        }
    }

    .catitem {
        margin-bottom: 10px;
    }
}
</style>