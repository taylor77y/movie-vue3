<template>
  <div class="vip">
    <div class="header">
      <div @click="onBack()">
        <van-icon name="arrow-left" color="white" size="22" />
      </div>
      <div class="tit">会员中心</div>
      <div style="width: 22px;"></div>
    </div>

    <div style="height: calc(100vh - 50px);overflow: auto;">
      <div class="gradient-text">开通VIP享受会员特权</div>
      

       <div
    class="slider"
    ref="slider"
    @scroll.passive="onScroll"
    :style="{ paddingLeft: sidePad + 'px', paddingRight: sidePad + 'px' }"
  >
    <div
      v-for="(item, index) in cards"
      :key="index"
      class="slide"
      :class="{ active: index === activeIndex }"
    >
     <img class="img" :src="item.pic"/>
    </div>
  </div>

      <van-radio-group v-model="checked" direction="horizontal" style="padding: 10px 0px;">
        <van-radio :name="index" v-for="(item, index) in payList" :key="item.ID" checked-color="#FF960C">
          <div style="color: white;">{{ item }}</div>
        </van-radio>
      </van-radio-group>
      <div class="gradient-text-time">
        <div class="time-text">
          <div class="l-text">限时优惠</div> <div class="line"></div><div class="text">距优惠结束仅剩</div>
        </div><van-count-down :time="time">
          <template #default="timeData">
            <span class="block">{{ timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="block min">{{ String(timeData.minutes).padStart(2, '0')[0] }}</span>
            <span class="block">{{ String(timeData.minutes).padStart(2, '0')[1] }}</span>
            <span class="colon">:</span>
            <span class="block sec">{{ String(timeData.seconds).padStart(2, '0')[0] }}</span>
            <span class="block">{{ String(timeData.seconds).padStart(2, '0')[1] }}</span>
          </template>
        </van-count-down>
      </div>
      <div class="btn" @click="onPay()">立即升级</div>

      <div class="gr-text">会员权益</div>
      <div class="iconlist">
        <div v-for="(item, index) in iconList" :key="index" class="icon">
          <div class="iconimg">
            <img :src="item.icon" style="width: 30px;height: 26px;" />
          </div>
          <div class="text">{{ item.name }}</div>
        </div>
      </div>
      <div class="icontext">
        <div>
          常见问题
        </div>
        <div>
          1：如多次支付失败，请尝试其它支付方式或稍后重试
        </div>
        <div>
          2：支付成功后2-10分钟到账，超过10分钟未到账请
        </div>
        <div>
          3：部分手机支付时误报病毒，请忽略即可
        </div>
      </div>
      <div style="height: 30px;"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { post } from '@/utils/request'
import { showToast, showLoadingToast, closeToast, showFailToast } from 'vant';
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
const time = ref(15 * 60 * 1000);
const cards = [
  { pic: '/vipgo/1.png', text: '图1' },
  { pic: '/vipgo/2.png', text: '图2' },
  { pic: '/vipgo/3.png', text: '图3' },
  { pic: '/vipgo/4.png', text: '图4' },
];

const iconList = [
  { name: '金币视频免费看', icon: '/vipgo/01.png' },
  { name: 'VIP视频免费看', icon: '/vipgo/02.png' },
  { name: '暗网免费看', icon: '/vipgo/03.png' },
  { name: '头像昵称修改', icon: '/vipgo/04.png' },
  { name: '高清视频', icon: '/vipgo/05.png' },
  { name: '专属路线', icon: '/vipgo/06.png' },
  { name: '免广告播放', icon: '/vipgo/07.png' },
  { name: '专属客服', icon: '/vipgo/08.png' }
];

const list = [{
  comSpec: 30,
  money: 30,
}, {
  comSpec: 90,
  money: 100,
}, {
  comSpec: 365,
  money: 200,
}, {
  comSpec: 3650,
  money: 500,
}]
const activeIndex = ref(0);
const cardWidth = 125;
const gap = 16;

const checked = ref<any>(0)
const payList = ref<any>([])
const slider = ref<HTMLElement | null>(null);
const memberInfo = ref<any>({})
const router = useRouter();
const onBack = () => router.back();

const onGetList = async () => {
  // /app-api/pay/getGoodsLists
  const res = await post('/app-api/pay/getGoodsLists', {
    type: 2
  })
  if (res.code === 0) {
    payList.value = res.data.payList
  }
}
const onYa = async () => {
  let type = checked.value === 0 ? 1 : 2
  const data = {
    comSpec: list[activeIndex.value].comSpec,
    index: activeIndex.value,
    money: list[activeIndex.value].money * 1,
    type: type,
    typesOf: 2,
    userId: memberInfo.value.memberCode
  }
  const res = await post('/renren-api/api/pay/yianpay', {
    ...data
  })
  if (res.code === 0) {
    const goData = JSON.parse(res.data)
    window.location.href = goData.payurl;
  } else {
    showFailToast({
      message: res.msg,
      duration: 6000 // 3 秒
    });
  }
}
const onJct = async () => {
  const data = {
    comSpec: list[activeIndex.value].comSpec,
    index: activeIndex.value,
    money: list[activeIndex.value].money * 1,
    type: payList.value[checked.value],
    typesOf: 2,
    userId: memberInfo.value.memberCode
  }
  const res = await post('/renren-api/api/pay/yianpay', {
    ...data
  })
  if (res.code === 0) {
    const goData = JSON.parse(res.data)
    window.location.href = goData.payurl;
  } else {
    showFailToast({
      message: res.msg,
      duration: 6000 // 3 秒
    });
  }
}
const onPay = async () => {
  // 打开全局 loading
  showLoadingToast({
    message: '支付中...',
    forbidClick: true, // 禁止点击背景
    duration: 0,       // 不自动关闭
  });

  try {
    if (checked.value !== 1) {
      await onYa(); // 你的支付逻辑
    } else {
      await onJct(); // 另一种支付逻辑
    }
    // // 成功提示
  } catch (err) {
    console.error(err);
    showToast({
      message: '支付失败',
      type: 'fail',
    });
  } finally {
    // 无论成功或失败都关闭 loading
    closeToast();
  }
};
// 滚动防抖
const items = ref([1, 2, 3, 4])   // 4 个元素
const sidePad = ref(0)            // 动态左右留白
const GAP = 10                    // 卡片间距（与 CSS gap 对齐）

const computePad = () => {
  const el = slider.value
  if (!el) return
  const first = el.querySelector<HTMLElement>('.slide')
  if (!first) return
  const containerW = el.clientWidth
  const cardW = first.offsetWidth
  sidePad.value = Math.max(0, (containerW - cardW) / 2) // 一半容器 - 一半卡片
}

const onScroll = () => {
  const el = slider.value
  if (!el) return
  const centerX = el.scrollLeft + el.clientWidth / 2

  let closest = 0
  let minDist = Number.POSITIVE_INFINITY
  el.querySelectorAll<HTMLElement>('.slide').forEach((child, i) => {
    const childCenter = child.offsetLeft + child.offsetWidth / 2
    const d = Math.abs(childCenter - centerX)
    if (d < minDist) {
      minDist = d
      closest = i
    }
  })
  activeIndex.value = closest
}

const onResize = () => {
  computePad()
  nextTick(onScroll)
}
onMounted(async() => {
   computePad()
    window.addEventListener('resize', onResize)
    nextTick(() => {
      // 有了左右留白后，首张也能居中；初始化计算一次
      onScroll()
    })

  const info = localStorage.getItem('memberInfo')
  if (info) {
    try {
      memberInfo.value = JSON.parse(info)
      await onGetList()
    } catch (err) {
      console.error('解析本地用户信息失败', err)
    }
  } else {
    console.log('本地没有用户信息')
  }
});
</script>

<style lang="less" scoped>
.vip {
  height: 100vh;
  padding: 10px;
  color: var(--text-color);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
}

.tit {
  font-weight: bold;
}

.gradient-text {
  margin: 10px 0;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(90deg, rgba(241, 234, 218, .9), rgba(222, 185, 150, .9));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

}

/* 滑动容器 */
.slider {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 20px;
  gap: 10px;
}

.slide {
  flex: 0 0 auto;
  width: 110px;
  height: 140px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  transition: transform 0.3s;
  scroll-snap-align: center;
  .img{
    width: 100%;
    height: 100%;
    margin:  0px 20px;
  }
}

.slide.active {
  transform: scale(1.3);
  color: #fff;
}

.btn {
  margin-top: 10px;
  background: linear-gradient(180deg, #FFBE00 0%, #FF960C 104.01%);
  color: black;
  font-weight: bold;
  font-size: 18px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 45px;
}

.gr-text {
  margin-top: 10px;
}

.iconlist {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0px;
  width: 100%;

  .icon {
    width: 25%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;

    .iconimg {
      background-color: #333333;
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .text {
      font-family: PingFang SC;
      font-size: 11px;
      line-height: 16px;
      letter-spacing: 0%;
      color: white;
      margin-top: 5px;
    }
  }
}

.icontext {
  color: #999999;
  font-family: PingFang SC;
  font-size: 12px;
  line-height: 16px;
  padding: 0px 20px;
}
</style>

<style lang="less" scoped>
.gradient-text-time {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  .time-text {
    display: flex;
    align-items: center;

    .l-text {
      padding-right: 4px;
    }
    .line{
      background-color: #E20100;
      width: 2px;
      height: 20px;
    }

    .text {
      padding-left: 4px;
      padding-right: 8px;
      color: #E20100;
    }
  }
}

.colon {
  display: inline-block;
  color: #E20100;
  font-size: 26px;
}

.block {
  margin: 15px 0px;
  display: inline-block;
  width: 22px;
  height: 26px;
  line-height: 26px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  background-color: #E20100;
  border-radius: 5px;
}
.min{
  margin-right: 3px;
}
.sec{
  margin-right: 3px;
}
</style>