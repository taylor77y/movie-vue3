<template>
    <div v-if="item.adtype" class="ad" @click="onOpen(item.url)">
            <img :src="item.img" class="adimg" @click="onOpen(item.url)"/>
             <div class="adname">{{ item.title }}</div>
        </div>
    <div v-else class="cartoon-item" @click="onGoVideoInfo(item)">
        <div class="img-wrapper" @click="onGoVideoInfo(item)">
            <img v-lazy="item.cartoonImage"  class="img" @error="onImgError"  @click="onGoVideoInfo(item)"/>
            <div class="img-top" v-if="item.cartoonVip" >VIP</div>
            <div class="img-bottom">
                <div class="flex">
                    <img src="./../assets/show.svg" style="width: 15px;height: 15px;margin-right: 3px;" />
                    <div> {{ item.cartoonHot }}</div>
                </div>
                <div class="flex">
                    {{ item.vodDuration }}
                </div>
            </div>
        </div>
        <div class="name">{{ item.cartoonName }}</div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
    item: { type: Object, required: true },
})

const emits = defineEmits(['error','goVideo'])

const onImgError = (e) => {
    emits('error', e)
}
const onOpen = (url) => {
  window.open(url, '_blank')
}
const onGoVideoInfo=(item)=>{
    router.push({
        path:'/videoinfo',
        query:{
            id:item.cartoonCode
        }
    })
     emits('goVideo', item)
}


</script>

<style lang="less" scoped>
.ad{
    width: 48%;
    display: flex;
    flex-direction: column;
    .adimg{
        width: 100%;
         height: 100px;
        border-radius: 5px;
    }
}
.cartoon-item {
    width: 48%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .img-wrapper {
         height: 100px;
        position: relative;
          background-image: url("./../assets/Image/pl.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

        .img {
            height: 100%;
            width: 100%;
            border-radius: 5px;
            object-fit: cover;
                -webkit-user-drag: none; /* 禁止拖拽 */
        user-select: none;
        pointer-events: none;     /* 交给外层 div 接收点击 */
        }

        .img-top {
            position: absolute;
            top: 0px;
            right: 0px;
            padding: 0 5px;
            background-color: var(--primary-color);
            color: var(--text-color);
            border-top-right-radius: 5px;
            border-bottom-left-radius: 5px;
            font-size: 14px;
        }

        .img-bottom {
            width: 100%;
            position: absolute;
            bottom: 2px;
            right: 0px;
            padding: 0 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;

            .flex {
                display: flex;
                align-items: center;
            }
        }
    }

    .name {
        margin-top: 10px;
        font-size: 12px;
        color: var(--text-color);
        display: -webkit-box;
        /* 创建伸缩盒子模型 */
        -webkit-line-clamp: 2;
        /* 限制最多显示 2 行 */
        -webkit-box-orient: vertical;
        /* 垂直排列子元素 */
        overflow: hidden;
        /* 超出隐藏 */
        text-overflow: ellipsis;
        /* 显示省略号 */
    }
}
.adname{
      margin-top: 10px;
        font-size: 12px;
        color: var(--text-color);
        display: -webkit-box;
        /* 创建伸缩盒子模型 */
        -webkit-line-clamp: 2;
        /* 限制最多显示 2 行 */
        -webkit-box-orient: vertical;
        /* 垂直排列子元素 */
        overflow: hidden;
        /* 超出隐藏 */
        text-overflow: ellipsis;
        /* 显示省略号 */
}
</style>
