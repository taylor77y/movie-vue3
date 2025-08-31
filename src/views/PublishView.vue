<template>
    <div class="mask">
        <div class="header">
            <div></div>
            <div class="tit">暗网</div>
            <div></div>
        </div>
        <AD v-if="store.showDarksideAd" :list="[...store.darksidead]"></AD>
        <div class="mask-list">
            <div v-for="(item, index) in list" :key="item.id" class="mask-item">
                <div class="mask-title">
                    <div class="flex">
                        <img src="/kl.png" style="width: 16px;height: 16px;" />
                        <div class="ditname">{{ item.dictName }}</div>
                    </div>
                    <div class="flex" @click="onGo(item, index)">
                        <div>查看更多</div>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="mask-li">
                    <div v-for="(i, index) in item.relationMovies"
                        :class="['cartoon-item', { 'full-width': index === 0 }]">
                        <div v-show="!loadedMap[i.cartoonCode]"
                            :class="['skeleton-item', { 'full-width': index === 0 }]">
                            <div class="skeleton-img">
                                <van-loading type="spinner" />
                            </div>
                               <div class="skeleton-text">{{ item.cartoonName }}</div>
                        </div>
                        <PbCateInfoItem v-show="loadedMap[i.cartoonCode]" @goVideo="handleGoVideo" :key="item.id"
                            :item="i" :index="index" @error="onImgError" title="暗网" @imgLoaded="handleImgLoaded">
                        </PbCateInfoItem>
                    </div>
                </div>
                <div class="change-bt">
                    <div class="c-left" @click="onGo(item, index)">查看更多</div>
                    <div class="c-right" @click="onRef(item, index)"><van-icon name="replay"
                            :class="{ spinning: loadingIndex === index }" /> 换一批</div>
                </div>
            </div>
            <van-back-top bottom="10vh" :style="{ backgroundColor: '#FF960C', borderRadius: '50%' }" />
            <div style="height: 50px;"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
import PbCateInfoItem from "@/components/PbCateInfoItem.vue"
import { useRouter } from "vue-router";
import { useHomeStore } from '@/store/home'
import AD from "@/components/Ad.vue"
const store = useHomeStore()
const router = useRouter()
const list = ref<any>([])
const loadingIndex = ref<any>('')
const onGetData = async () => {
    const res = await post('/app-api/cartoon/selectSubjectByName', {
        dictName: '暗网',
        type: 0
    })
    if (res.code === 0) {
        const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
        console.log(data, "data");
        list.value = data
    }
}
const handleGoVideo = (item: any) => {
    console.log('即将跳转', item.cartoonCode)
    router.push({
        path: '/videoinfo',
        query: { id: item.cartoonCode }
    }).catch(err => console.warn(err))
}
const loadedMap = reactive<any>({
})
// 初始化
const handleImgLoaded = ({
    title,
    index,
    time,
    id
}: {
    title: string
    index: number
    time: number,
    id: any
}) => {
    loadedMap[id] = true
}

const onImgError = () => {

}
const onGo = async (item: any, index: any) => {
    router.push({
        path: '/sreinfo',
        query: {
            type: item.pid,
            sonType: item.dictCode,
            searchStr: '',
            title: '暗网'
        }
    })
}
const onRef = async (item: any, index: any) => {
    loadingIndex.value = index;
    const res = await post('/app-api/cartoon/changeBatch', {
        currentPage: 1,
        dictName: item.dictName,
        type: item.dictCode
    })
    if (res.code === 0) {
        const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
        console.log(data, "data");
        list.value[index].relationMovies = data
    }
    loadingIndex.value = '';
}
onMounted(async () => {
    await onGetData()
    await store.getConfig()
})
</script>
<style lang="less" scoped>
.mask {
    height: 100vh;
    padding: 10px;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;

        .tit {
            font-weight: bold;
        }
    }

    .mask-list {
        height: calc(100vh - 50px);
        overflow: auto;

        .mask-item {

            .mask-title {
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;

                .flex {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 25px;
                    font-size: 13px;

                    .ditname {
                        color: var(--primary-color);
                        color: rgb(255, 150, 12);
                        font-size: 16px;
                        margin-left: 10px;
                    }
                }
            }
        }

        .change-bt {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;

            .c-left {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 48%;
                height: 32px;
                border-radius: 20px;
                font-size: 16px;
                padding-left: 6px;
                background: linear-gradient(rgb(255, 190, 0) 0%, rgb(255, 150, 12) 104.01%);
                color: black;
                font-weight: bold;
            }

            .c-right {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 48%;
                height: 32px;
                border-radius: 20px;
                font-size: 16px;
                padding-left: 6px;
                background: linear-gradient(rgb(255, 190, 0) 0%, rgb(255, 150, 12) 104.01%);
                color: black;
                font-weight: bold;
            }
        }

    }

    .mask-li {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
}

.spinning {
    animation: spin 0.2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.cartoon-item {
    width: 48%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.full-width {
    width: 100% !important;

    .img-wrapper {
        height: 200px;
        background-image: url("/Image/pl.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
}
</style>