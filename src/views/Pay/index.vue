<template>
    <!-- 开启顶部安全区适配 -->
    <div class="pay">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit">金币充值</div>
            <div style="width: 22px;"></div>
        </div>
        <div class="con">
            <div class="hbg">
                <div class="hbg-t">
                    <img :src="memberInfo?.memberAvatar || '/my/user.svg'" alt="头像"
                        style="width: 54px;height: 54px;border-radius: 10px;" />

                    <div class="hbg-info-u">
                        <div>
                            <div style="display: flex;align-items: center;">
                                <div class="name">{{ memberInfo.memberNichen }}</div> <img :src="vipac"
                                    style="width: 52px;height: 16px;margin-left: 10px;" />
                            </div>
                            <div class="hbg-id">升级至尊会员享额外特权</div>
                        </div>
                        <div class="hbg-sign">
                            <div>金币: </div>
                            <div class="hbg-a active">{{ memberInfo.memberCion }}</div>
                        </div>
                    </div>
                </div>

                <div class="title-c">
                    <div class="vip" v-if="vip">vip</div>
                    <div class="title" v-html="title"></div>
                </div>
            </div>
            <div class="t">金币充值</div>
            <div class="grid3">
                <div v-for="(it, i) in items" :key="it.id" class="cell" :class="{ active: activeIndex === i }"
                    @click="activeIndex = i">
                    <div v-if="i < 2"> {{ it.duration }}</div>
                    <div v-else style="font-size: 12px;text-align: center;">
                        <div>请填写个数/金额</div>
                        <div> {{ it.duration }}</div>
                    </div>
                    <div v-if="i < 2"
                        style="display: flex;align-items: center;justify-content: space-between;color: #FF960C;">
                        <div style="font-size: 22px;">￥{{ it.price }}</div>
                    </div>
                    <div v-else
                        style="display: flex;align-items: center;justify-content: space-between;color: #FF960C;">
                        <!-- <div style="font-size: 22px;">￥{{ it.price }}</div> -->
                       <van-field
                        v-model.number="it.price"
                        type="number"
                        placeholder="请输入金额"
                        input-align="right"
                        clearable
                        :border="false"
                        style="--van-field-input-text-color: #FF960C; font-size: 22px;"
                        @blur="limitPrice(it)"
                        />

                    </div>
                </div>
            </div>
            <van-radio-group v-model="checked" direction="horizontal" style="padding: 0 10px;">
                <van-radio :name="index" v-for="(item, index) in payList" :key="item.ID" checked-color="#FF960C">
                    <div style="color: white;">{{ item }}</div>
                </van-radio>
            </van-radio-group>
       
            <div class="btn" @click="onPay()">立即升级</div>

            <!-- <div class="t">会员特权</div>

            <div class="privilege">
			<div class="privilege-item" v-for="(item, index) in privilegeList" :key="index" hover-class="hover">
				<img class="privilege-item-pic" :src="item.pic" mode=""></img>
				<div class="privilege-item-text " style="color: var(--text-color)">{{ item.text }}</div>
			</div>
		</div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import moment from "moment";
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
import { closeToast, showLoadingToast, showSuccessToast, showToast,showFailToast } from "vant";
const vipac = ref<any>('/proilfe/0.png')
const isios = ref<any>(false)
const router = useRouter()
const memberInfo = ref<any>({})
const items = ref<any>([])
const checked = ref(0);
const activeIndex = ref(0)
const onBack = () => {
    router.back()
}
const privilegeList = ref<any>([
  { pic: '/pay/vip/coin.png', text: '每日金币' },
  { pic: '/pay/vip/quan.png', text: '大额神券' },
  { pic: '/pay/vip/red-bag.png', text: '更多返利' },
  { pic: '/pay/vip/goods.png', text: '精选商品' },
  { pic: '/pay/vip/speed.png', text: '极速到账' },
  { pic: '/pay/vip/share.png', text: '分享领券' },
  { pic: '/pay/vip/active.png', text: '专享活动' },
  { pic: '/pay/vip/birthday.png', text: '生日折扣' },
  { pic: '/pay/vip/notic.png', text: '上架提醒' },
  { pic: '/pay/vip/kefu.png', text: '专属客服' }
])

const title = ref<any>('暂未开通vip')
const payList = ref<any>([])
const vip = ref<any>(false)
const limitPrice = (item: any) => {
  if (!item.price) return
  if (item.price < 10) {
    showSuccessToast('最小金额为10,已经自动为您修改')
    item.price = 10
  } else if (item.price > 5000) {
     showSuccessToast('最大金额为5000,已经自动为您修改')
    item.price = 5000
  }
}
const vipIcons = [
  "/proilfe/0.png",
  "/proilfe/1.png",
  "/proilfe/2.png",
  "/proilfe/3.png",
  "/proilfe/4.png",
  "/proilfe/5.png",
  "/proilfe/6.png"
];

const onGetVipInfo = () => {
    const vip = memberInfo.value.vipPeriod;
    const vipDateStr = memberInfo.value.vipDate;

    // 默认值
    let icon = vipIcons[0];
    let isVip = false;
    let expireDate: string | null = null;
    let daysLeft = 0;

    // 如果 vip = 0 或 没有到期时间，直接返回非 VIP
    if (vip === 0 || !vipDateStr) {
        return { icon, isVip, expireDate, daysLeft };
    }

    const vipDate = moment(vipDateStr, 'YYYY-MM-DD HH:mm:ss');
    const now = moment();

    // 判断是否有效
    if (vipDate.isAfter(now)) {
        isVip = true;
        expireDate = vipDate.format('YYYY-MM-DD HH:mm:ss');

        // 计算剩余天数（向上取整）
        daysLeft = vipDate.diff(now, 'days');
        if (vipDate.diff(now, 'hours') % 24 > 0) {
            daysLeft += 1;
        }

        // 设置对应图标
        icon = vipIcons[vip] || vipIcons[6]; // vip 超过最大值就显示最后一个
    }

    return { icon, isVip, expireDate, daysLeft };
};

const onGetList = async () => {
    // /app-api/pay/getGoodsLists
    const res = await post('/app-api/pay/getGoodsLists', {
        type: 2
    })
    if (res.code === 0) {
        let newitem: any = {
            commoditySpecification: "",
            commodityToSort: 9999,
            duration: "10-5000",
            id: "3",
            price: 10,
            status: 1,
            time: "",
            type: 1
        }

        items.value = [...res.data.optionList, newitem]
        payList.value = res.data.payList
    }
}
const onYa = async () => {
    let type = checked.value === 2?checked.value:1
    const res = await post('/renren-api/api/pay/yianpay', {
        comSpec: items.value[activeIndex.value].commoditySpecification,
        index: 0,
        money: items.value[activeIndex.value].price*1,
        type: type,
        typesOf: 1,
        userId: memberInfo.value.memberCode
    })
    if(res.code===0){
        const goData = JSON.parse(res.data)
        window.location.href = goData.payurl;
    }else{
         showFailToast({
        message: res.msg,
        duration: 6000 // 3 秒
      });
    }
}
const onJct = async () => {
    const res = await post('/renren-api/api/pay/yianpay', {
        comSpec: items.value[activeIndex.value].commoditySpecification,
        index: items.value[activeIndex.value].commodityToSort *1 ,
        money: items.value[activeIndex.value].price*1,
        payChannel: 2,
        type: true,
        typesOf: 1,
        userId: memberInfo.value.memberCode
    })
     if(res.code===0){
        const goData = JSON.parse(res.data)
        window.location.href = goData.payurl;
    }else{
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
    console.log('activeIndex:', activeIndex.value);
    console.log('checked:', checked.value);

    if (checked.value !== 1) {
      await onYa(); // 你的支付逻辑
    } else {
      await onJct(); // 另一种支付逻辑
    }
    // 成功提示
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

onMounted(async () => {
    await onGetList()
    const info = localStorage.getItem('memberInfo')
    if (info) {
        try {
            memberInfo.value = JSON.parse(info)
            console.log('本地用户信息', memberInfo.value)
            const { icon, isVip, expireDate, daysLeft } = onGetVipInfo()
            vipac.value = icon;
            vip.value = isVip
            if (isVip) {
                title.value = `剩余 <span style='color:#FF960C;font-size:12px'>${daysLeft}</span> 天，有效期至 <span style='color:#FF960C;font-size:12px'>${expireDate}</span>`
            } else {
                title.value = '暂未开通VIP'
            }
        } catch (err) {
            console.error('解析本地用户信息失败', err)
        }
    } else {
        console.log('本地没有用户信息')
    }
})

</script>

<style lang="less" scoped>
.pay {
    height: 100vh;
    overflow: auto;
    color: var(--text-color);
    padding: 10px;
    .header {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .tit {
            font-weight: bold;
        }
    }

    .con {
        height: calc(100vh - 50px);
        overflow: hidden;
        width: 100%;

        .hbg {
            width: 100%;
            height: 150px;
            background-image: url("@/assets/paybg.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 10px;
            padding: 10px 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .hbg-t {
                display: flex;
                align-items: start;

                .info-u {
                    color: black;
                    margin-left: 10px;
                }
            }

            .hbg-info-u {
                margin-left: 10px;

                .name {
                    color: black;
                    font-size: 16px;
                    font-weight: bold;
                }

                .hbg-id {
                    color: black;
                    font-size: 12px;
                }

                .hbg-sign {
                    display: flex;
                    align-items: center;
                    color: black;

                    .active {
                        color: #FF960C;
                        font-size: 24px;
                        font-weight: bold;
                        margin-left: 10px;
                    }

                }
            }

            .title-c {
                display: flex;
                align-items: end;
                justify-content: end;
                color: black;

                .vip {
                    background: linear-gradient(180deg, #FFBE00 0%, #FF960C 100%);
                    border-top-right-radius: 4px;
                    border-bottom-left-radius: 4px;
                    padding: 0 5px;
                    margin-right: 5px;
                }

                .title {
                font-size: 12px;
                }
            }
        }

        .t {
            padding: 5px;
            padding-top: 20px;
        }

        .grid3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            /* 一行三个 */
            gap: 10px;
            margin-bottom: 20px;
        }

        .cell {
            width: 23%;
            padding: 10px 0;
            margin-left: 7px;
            width: 100px;
            height: 115px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: solid 1px #f2f2f3;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            cursor: pointer;
            user-select: none;
            transition: background .15s;
            justify-content: space-around;
        }

        .cell.active {
            position: relative;
            background: #272727;
            color: var(--text-color);
            border-radius: 8px;
            /* 圆角半径 */
            /* 渐变边框技巧 */
            border: 1px solid transparent;
            background-image:
                linear-gradient(#272727, #272727),
                /* 内层背景 */
                linear-gradient(360deg, #87725E -4.02%, #F4D6AE 111.61%);
            /* 外层渐变 */
            background-origin: border-box;
            background-clip: padding-box, border-box;
             /deep/ .van-cell{
                background: #272727;
            }
        }

    }
    .btn{
        margin-top: 30px;
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
    .privilege {
	padding: 0 30rpx;
	margin-bottom: 40rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;

	&-item {
		margin: 0 12px;
		margin-bottom: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 18%;

		&-pic {
			width: 40px;
			height: 40px;
			margin-bottom: 10px;
		}

		&-text {
			font-size: 24rpx;
			color: #383738;
		}
	}
}
 /deep/ .van-cell{
                background: var(--background-color);
            }
   
}

/deep/ .van-field__control{
    font-size: 16px;
    text-align: left;
}
</style>
