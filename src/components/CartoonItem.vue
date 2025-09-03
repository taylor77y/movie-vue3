<template>
    <div v-if="item.adtype" class="ad-ad" @click="onOpen(item)">
            <van-image @load="onLoad" :src="item.img"  class="adimg"  >  </van-image>
             <div class="adname">{{ item.title }}</div>
        </div>
    <div v-else class="ad-cartoon-item" @click="onGoVideoInfo(item)">
        <div class="img-wrapper" @click="onGoVideoInfo(item)">
            <van-image @load="onLoad" :src="item.cartoonImage"  class="img zoomIn" @error="onImgError"  @click="onGoVideoInfo(item)" >  </van-image>
            <div class="img-top" v-if="item.cartoonVip" >VIP</div>
            <div class="img-bottom">
                <div class="flex">
                    <img src="/show.svg" style="width: 15px;height: 15px;margin-right: 3px;" />
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
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
const props = defineProps({
    item: { type: Object, required: true },
        index: { type: Number, required: true },
            title: { type: String, required: true },
})
const emits = defineEmits(['error','goVideo','imgLoaded'])
const start = performance.now() // 组件挂载时记录开始时间
const onLoad = async() => {
  const end = performance.now()
  const time = end - start
  emits('imgLoaded', {title:props.title, index: props.index, time,id:props.item.cartoonCode })
}

const onImgError = (e) => {
    emits('error', e)
}
const onOpen = async(item) => {
    const res = await post('/renren-api/api/member/randomAdClickCount', {
    id:item.id
  })
  if (res.code === 0) {
    const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
  }
  window.open(item.url, '_blank')
}
const onGoVideoInfo = async (item) => {
  emits('goVideo', item);
};



</script>

<style lang="less" scoped>
.ad-ad{
      width: 100%;
    display: flex;
    flex-direction: column;
    .adimg{
        width: 100%;
         height: 100px;
        border-radius: 5px;
    }
}

.ad-cartoon-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .img-wrapper {
         height: 100px;
        position: relative;
    background-image: url("/Image/pl.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
          border-radius: 5px;
        .img {
            height: 100%;
            width: 100%;
            border-radius: 5px;
            object-fit: cover;
              -webkit-user-drag: none; /* 禁止拖拽 */
        user-select: none;
        pointer-events: none;     /* 交给外层 div 接收点击 */
                  transform: scale(0);        /* 初始非常小 */
  animation: zoomIn 0.5s forwards ease-out;  /* 放大动画 */
        
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
@keyframes zoomIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.full-width {
  width: 100% !important;
  .img-wrapper{
    height: 200px;
    background-image: url("/Image/pl.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
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
/deep/ .van-image__img {
    border-top-left-radius: 5px;
     border-top-right-radius: 5px;
}
</style>
