<template>
    <div class="sign">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="#ff960c" size="22" /></div>
            <div class="tit">任务中心</div>
            <div style="width: 22px;">
            </div>
        </div>
        <div class="sign-li">
            <div class="sign-li-h">
                <img src="/check/star-coin.png" style="width: 30px;height: 30px;" />
                <div class="text">{{ memberInfo.memberCion }}</div>
            </div>

            <div class="sign-li-l">
                <div class="left">每日签到</div>
                <div class="right">已连续签到{{ days }}天</div>
            </div>
            <div class="sign-li-q">
                <div :class="[
                    index === 6 ? 'item items' : 'item',       // 你的原表达式（完全不动）
                    { selected: index <= daysqm}        // 另加的选中 class
                ]" v-for="(item, index) in 7">
                    <div v-if="index < 6">
                        <div>第{{ item  }}天 </div>
                        <img src="/check/star-coin.png" style="width: 30px;height: 30px;margin: 5px 0;" />
                        <div class="fl">{{ list[index] }}</div>
                    </div>
                    <div v-else class="d7">
                        <div>第{{ item  }}天 </div>
                        <div class="fl">{{ list[index] }}</div>
                    </div>
                </div>
            </div>

            <div class="signbn" @click="onPostSign()">签到</div>

            <div class="signlist">
                <div style="display: flex;align-items: center;justify-content: end;margin: 10px 0px;">
                    <div>MORE</div>
                    <div><van-icon name="arrow" /></div>
                </div>

                <div v-for="(item, index) in iconlist" :key="index" class="more-item" @click="onGo(index)">
                    <div class="flex-item">
                        <img class="icon" :src="item.icon" />
                        <div class="rtext">
                            <div>{{ item.name }}</div>
                            <div class="des">{{ item.des }}</div>
                        </div>
                    </div>
                    <div>
                        <div :class="index % 2 === 0 ? 'go isl' : 'isgo isl'">{{ item.title }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router";
import o1 from "/check/1.png"
import o2 from "/check/2.png"
import o3 from "/check/3.png"
import o4 from "/check/4.png"
import { post, get } from '@/utils/request'
import { showFailToast, showLoadingToast, showSuccessToast } from "vant";
const router = useRouter()
const list = ['+1金币', '+1金币', '+1天VIP', '+2金币','+2金币', '+3金币', '+3天VIP']
const days = ref<any>(0)
const daysqm = ref<any>(0)
const memberInfo = ref<any>({})
const iconlist = [{
    name: '每日登录',
    des: '每日登录可领取1金币',
    icon: o1,
    title: '待领取'
}, {
    name: '邀请好友',
    des: '邀请1位有效好友可领取1天VIP',
    icon: o2,
    title: '去完成'
}, {
    name: '每日观看视频',
    des: '20分钟以上可领取2金币',
    icon: o3,
    title: '去完成'
}, {
    name: '首次充值会员',
    des: '充值会员可领取5金币',
    icon: o4,
    title: '去完成'
}]
const lwlist=[1, 1, 1, 2, 2, 3, 3]
const onBack = () => {
    router.back()
}
const onGo = (index: number) => {
    showLoadingToast({
        message: '敬请期待',
        forbidClick: true,
        });
    return false;
    if (index === 0) {
        router.push({
            path: '/login'
        })
    }
    if (index === 1) {
        router.push({
            path: '/share'
        })
    }
    if (index === 2) {
        router.push({
            path: '/'
        })
    }
    if (index === 3) {
        router.push({
            path: '/vip'
        })
    }
}
const onPostSign = async () => {
      showLoadingToast({
        message: '签到中...',
        forbidClick: true,
        });
    const today = new Date()

    // 获取年、月、日
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0') // 月份从0开始
        const day = String(today.getDate()).padStart(2, '0')

    // 拼接成 YYYY-MM-DD
    // lwlist
    const currentDate = `${year}-${month}-${day}`
    let index =daysqm.value === '-1'?0:daysqm.value
  
    
    
    const data = {
        amount:lwlist[index],
        commodityType:(index === 2||index === 6) ?2:1,
        date:currentDate
    }
    const res = await post('/renren-api/api/sign', {
        ...data
    })
    console.log(res, "签到日期");
     if (res.code === 0) {
        await onGetSignDay()
        await onGetSignDay()
        await onRfUserInfo()
        showSuccessToast("签到成功");
    }else{
        showFailToast("今日已经打过卡了,明天再来吧...");
    }
}
const onGetSign = async () => {
  
    const res = await get('/renren-api/api/sign', {
    })
    console.log(res, "签到日期");
    if (res.code === 0) {
       
    }else{
    }
}
const onGetSignDay = async () => {
    const res = await get('/renren-api/api/sign/count', {
    })
    if (res.code === 0) {
        days.value = res.data * 1
        if(res.data * 1 != 0){
             daysqm.value =  (days.value %7)-1
        }else{
             daysqm.value =  '-1'
        }
    }
}
const isIphoneX = () => {
  const ua = navigator.userAgent
  const isIOS = /iP(hone|od|ad)/.test(ua)
  const { width, height } = window.screen
  // iPhone X/XS: 375 x 812
  // iPhone XR/XS Max: 414 x 896
  // iPhone 12/13/14 mini/pro/max 等同 XR/XS 系列尺寸
  const iphoneXLike =
    (width === 375 && height === 812) ||
    (width === 812 && height === 375) ||
    (width === 414 && height === 896) ||
    (width === 896 && height === 414)
  
  return isIOS && iphoneXLike
}
const onRfUserInfo = async () => {
  const res = await post('/app-api/member/getEntityByCode', {
    memberCode: memberInfo.value.memberCode
  });

  if (res.code === 0) {
    memberInfo.value = res.data
    localStorage.setItem('memberInfo', JSON.stringify(res.data))
  }
}
onMounted(async () => {
    const info = localStorage.getItem('memberInfo')
    if (info) {
        try {
            memberInfo.value = JSON.parse(info)
            await onGetSign()
            await onGetSignDay()
        } catch (err) {
            console.error('解析本地用户信息失败', err)
        }
    } else {
        console.log('本地没有用户信息')
    }
    
})
</script>
<style lang="less" scoped>
.sign {
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

    .sign-li {
        height: calc(100vh - 50px);
        overflow: auto;
        background-image: url('/check/bg.png');
        /* 换成你的背景图路径 */
        background-repeat: no-repeat;
        background-position: right top;
        /* 定位到右上角 */
        background-size: 160px 190px;

        /* 图片保持原始大小 */
        .sign-li-h {
            display: flex;
            align-items: center;

            .text {
                font-size: 24px;
                margin-left: 10px;
            }
        }

        .sign-li-l {
            margin-top: 50px;
            display: flex;
            align-items: center;

            .left {
                font-weight: bold;
                font-size: 18px;
                height: 18px;
                line-height: 18px;
                color: #ff960c;
            }

            .right {
                margin-left: 5px;
                font-size: 15px;
                font-weight: bold;
            }
        }

        .sign-li-q {
            margin-top: 10px;
            display: flex;
            flex-wrap: wrap;

            .item {
                margin-right: 2%;
                background-color: #333;
                width: 23%;
                margin-bottom: 8px;
                border-radius: 8px;
                height: auto;
                padding: 10px;
                display: flex;
                align-items: center;
                flex-direction: column;
                font-family: PingFang SC;
                font-weight: 400;
                font-style: Bold;
                font-size: 14px;
                text-align: center;
                color: #fff;

                .fl {
                    font-size: 12px;
                    color: var(--primary-color);
                }
                .d7{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: start;
                    flex-direction: column;
                    background-image: url('/check/mbl.png');
                    background-repeat: no-repeat;       /* 不重复 */
                    background-position: center;        /* 居中 */
                    background-size: contain;           /* 保持比例，缩放到容器内完整显示 */
                }
            }

            .items {
                width: 48%;
            }

            .selected {
                color: #000;
                background: linear-gradient(180deg, #ffbe00, #ff960c);
                .d7{
                    display: flex;
                    align-items: start;
                    flex-direction: column;
                   
                }
                 .fl {
                        color: var(--text-color);
                    }
                
            }
        }

        .signbn {
            background: linear-gradient(180deg, #ffbe00, #ff960c 104.01%);
            font-size: 16px;
            text-align: center;
            color: rgba(0, 0, 0, .8980392156862745);
            height: 40px;
            border-radius: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
        }

        .signlist {
            display: flex;
            flex-direction: column;
            padding-bottom: 100px;

            .more-item {
                background: #FFFFFF33;
                padding: 12px 8px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .flex-item {
                    display: flex;

                    .icon {
                        width: 34px;
                        height: 34px;
                    }

                    .rtext {
                        margin-left: 20px;

                        .des {
                            font-family: 400;
                            font-weight: bold;
                            font-size: 12px;
                            color: hsla(0, 0%, 100%, .4);
                        }
                    }
                }

                .go {
                    background: linear-gradient(180deg, #ffbe00, #ff960c);
                    color: #fff;
                }

                .isgo {
                    background: linear-gradient(180deg, #f9730b, #f24119);
                    color: #fff;
                }

                .isl {
                    width: 74px;
                    height: 32px;
                    border-radius: 16px;
                    text-align: center;
                    line-height: 32px;
                }
            }
        }
    }
}
</style>