<template>
  <!-- 开启顶部安全区适配 -->
  <RouterView :key="route.fullPath">
  </RouterView>
  <div  v-if="route.path === '/'"  class="anzhuang" @click="onAnZhuang()">安装到桌面</div>

  <van-overlay :show="showGuanggao" :style="{ zIndex: 9998 }">
    <div class="g-wrapper">
      <div class="block">
        <div class="cont">
          <div class="posicon" @click="showGuanggao = false"><van-icon name="cross" size="20" /></div>
          <div class="cont-title">将应用安装到桌面</div>
          <div class="cont-bottom">
            <div @click="onDowloand()">安卓安装</div>
            <div class="l" @click="onShowAppleTutorial()">苹果教程</div>
          </div>
        </div>
      </div>
    </div>
    <van-overlay :show="showOverlay" :style="{ zIndex: 9999 }">
      <div class="outer-content" @click.stop>
        <!-- 内层遮罩 -->
        <div class="inner-overlay" @click.stop>
          <!-- 自定义内容 -->
          <div class="custom-content">
            <div
              style="display: flex;align-items: center;justify-content: space-between;width: 100%;padding: 10px 30px;border-bottom: 1px solid white;margin-bottom: 10px;">
              <div>
                <div>添加到应用</div>
                <div>快捷访问，极致观影体验</div>
              </div>
              <div @click="closeOverlay"><van-icon name="cross" size="24" /></div>
            </div>
            <img src="/tips.png" style="width: 80%;" />
          </div>
        </div>
      </div>
    </van-overlay>
  </van-overlay>
  <van-overlay :show="showIndexGuanggao"  :style="{ zIndex: 9996 }">
    <div  class="g-wrapper">
         <div class="indexgg" >
          <div class="close" @click="showIndexGuanggao = false"><van-icon name="cross" color="black" size="24" /></div>
          <img class="index" @click="onOpen()" :src="homeStore.indexPopupAd[0].img"/>
         </div>
    </div>
  </van-overlay>
  <!-- homeStore -->
  <!-- 开启底部安全区适配 -->
  <van-number-keyboard safe-area-inset-bottom />
</template>
<script setup lang="ts">
import { ref, onMounted ,onBeforeMount} from "vue"
import { useRoute } from 'vue-router'
import { useHomeStore } from '@/store/home'

const homeStore = useHomeStore()
const route = useRoute()
const showIndexGuanggao = ref<any>(false)
const showGuanggao = ref<any>(false)
const showOverlay = ref(false)
const onAnZhuang = () => {
  showGuanggao.value = true
}
const onDowloand = () => {
   window.open('https://91porn.hk/download/apk/kanbei14.apk', '_blank')
}
const onShowAppleTutorial = () => {
  showOverlay.value = !showOverlay.value
}
const closeOverlay = () => {
  showOverlay.value = !showOverlay.value
}
const onOpen= ()=>{
  window.open(homeStore.indexPopupAd[0].url, '_blank')
}
onBeforeMount(async () => {
  // 首页加载时弹出广告
  // 首页加载时，如果 sessionStorage 里没有记录过广告显示，则弹出广告
  if (!sessionStorage.getItem('showGuanggao')) {
    showGuanggao.value = true;
    // 记录广告已经显示过，下次刷新就不会再弹
    sessionStorage.setItem('showGuanggao', 'true');
  }
  await homeStore.initHome()
  if(homeStore.showAd){
    showIndexGuanggao.value = true
  }
})
</script>
<style lang="less" scoped>
.g-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .block {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;

    .conta {
      display: flex;
      align-items: center;
      flex-direction: column;
      font-size: 16px;
      font-weight: bold;

      .govip {
        background: linear-gradient(180deg, #FFBE00 0%, #FF960C 104.01%);
        color: black;
        font-weight: bold;
        width: 130px;
        height: 35px;
        border-radius: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
      }

      .live {}

      .ac {
        font-size: 18px;
        color: var(--primary-color);
      }

      .pd5 {
        padding-bottom: 5px;
      }

      .pd {
        padding: 20px 0;
      }
    }

    .top {}

    .cont {
      width: 70%;
      display: flex;
      flex-direction: column;
      background-color: white;
      border-radius: 10px;
      color: #000000;
      text-align: center;
      position: relative;

      .posicon {
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .cont-title {
        padding: 50px 0;
      }

      .cont-bottom {
        width: 100%;
        height: 60px;
        background-color: rgb(238, 238, 238);
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: black;
        border-top: 1px solid rgb(204, 204, 204);
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        .l {
          color: var(--primary-color);
        }
      }
    }
  }
}

.aw {
  background: #00000073;
}

.outer-content {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: end;
  justify-content: end;

  .inner-overlay {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column-reverse;

    .custom-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #000000;
    }
  }
}
</style>
<style lang="less">
.skeleton {
  width: 100%;
  height: 100%;
  background: #eee;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    background-color: #eee;
  }

  50% {
    background-color: #ddd;
  }

  100% {
    background-color: #eee;
  }
}
.indexgg{
  width: 80%;
  height: auto;
  height: 80%;
  border-radius: 8px;
  position: relative;
  .index{
    width: 100%;
    height: 100%;
  }
  .close{
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
.anzhuang {
  width: 180px;
  height: 42px;
  border-radius: 21px;
  background-color: rgb(250, 165, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 60px;
  left: 50%;
  /* 水平居中 */
  transform: translateX(-50%);
  color: black;
  font-weight: bold;
  z-index: 9995;
}
</style>
