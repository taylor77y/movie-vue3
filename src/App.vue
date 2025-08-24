<template>
    <RouterView >
    </RouterView>
    <van-overlay  :show="showGuanggao"  :style="{ zIndex: 9998 }">
    <div class="g-wrapper">
      <div class="block">
         <div class="cont">
           <div class="posicon" @click="showGuanggao=false"><van-icon name="cross" size="20" /></div>
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
          <div style="display: flex;align-items: center;justify-content: space-between;width: 100%;padding: 10px 30px;border-bottom: 1px solid white;margin-bottom: 10px;">
            <div>
              <div>添加到应用</div>
              <div>快捷访问，极致观影体验</div>
            </div>
            <div @click="closeOverlay"><van-icon name="cross" size="24" /></div>
          </div>
          <img src="./assets/tips.png" style="width: 80%;"/>
        </div>
      </div>
    </div>
  </van-overlay>
  </van-overlay>
</template>
<script setup lang="ts">
import {ref,onMounted} from "vue"

 
const showGuanggao = ref<any>(false)
const showOverlay = ref(false)

const onDowloand =()=>{
  	window.location.href = 'https://91porn.hk/download/apk/kanbei14.apk';
}
const onShowAppleTutorial =()=>{
  showOverlay.value = !showOverlay.value
}
const closeOverlay=()=>{
  showOverlay.value = !showOverlay.value
}
onMounted(async() => {
  // 首页加载时弹出广告
  showGuanggao.value = true
})
</script>
<style lang="less" scoped>
.g-wrapper{
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .block{
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    .conta{
      display: flex;
      align-items: center;
      flex-direction: column;
      font-size: 16px;
      font-weight: bold;
      .govip{
        background: linear-gradient(180deg, #FFBE00 0%, #FF960C 104.01%);
        color: black;
        font-weight: bold;
        width: 130px;
        height: 35px;
        border-radius: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top:20px;
      }
      .live{

      }
      .ac{
        font-size: 18px;
        color: var(--primary-color);
      }
      .pd5{
        padding-bottom: 5px;
      }
      .pd{
        padding: 20px 0;
      }
    }
    .top{

    }
    .cont{
      width: 70%;
      display: flex;
      flex-direction: column;
      background-color: white;
      border-radius: 10px;
      color: #000000;
      text-align: center;
      position: relative;
      .posicon{
        position: absolute;
        right: 10px;
        top: 10px;
      }
      .cont-title{
        padding:50px 0 ;
      }
      
      .cont-bottom{
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
        .l{
          color: var(--primary-color);
        }
      }
    }
  }
}
.aw{
  background: #00000073;
}
.outer-content{
  height: 100%;
  width: 100%;
  display: flex;
    align-items: end;
    justify-content: end;
  .inner-overlay{
        height: 100%;
      width: 100%;
     display: flex;
    align-items: center;
    flex-direction: column-reverse;
  .custom-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #000000;
  }
  }
}
</style>

