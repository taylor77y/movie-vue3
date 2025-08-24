<template>
    <div class="my">
        <div class="header">
            <div style="width: 80px;"></div>
            <div class="tit">我的</div>
            <div class="flex">
                <img src="./../assets/my/Moon.svg" style="margin-right: 10px;" />
                <img src="./../assets/my/01.svg" style="margin-right: 10px;" />
                <div class="text">签到</div>
            </div>
        </div>
        <div class="my-con">
            <div class="info">
                <div class="info-left">
                    <div>
                        <img :src="memberInfo?.memberAvatar || defaultAvatar" alt="头像" />
                    </div>
                    <div class="info-u">
                        <div>
                            <div style="display: flex;align-items: center;">
                                <div>{{ memberInfo.memberName }}</div> <img :src="vipac"
                                    style="width: 52px;height: 16px;margin-left: 10px;" />
                            </div>
                            <div class="id">ID:{{ memberInfo.memberCode }}</div>
                        </div>
                        <div class="sign">签名：{{ memberInfo.memberSignature ? memberInfo.memberSignature : '这家伙很懒，什么都没留下' }}
                        </div>
                    </div>
                </div>
                <div><van-icon name="arrow" color="#FF960C" size="22" /></div>
            </div>
            <div class="go-vip">
                <div class="go-left">
                    <img src="./../assets/proilfe/king.svg" />
                    <div class="go-left-text">
                        <div class="top">VIP限时特惠 畅享全场</div>
                        <div class="min">开通VIP全场畅看</div>
                    </div>
                </div>
                <div class="go-right">会员充值</div>
            </div>

            <div class="go-count">
                <div class="go-count-left">
                    <div>
                        <div>金币数量(个)</div>
                        <div class="ac">{{ memberInfo.memberCion }}</div>
                    </div>
                    <div class="btn">充值</div>
                </div>
                <div class="line"></div>
                <div class="go-count-right">
                    <div>
                        <div>余额（元）</div>
                        <div class="ac">${{ memberInfo.balance }}</div>
                    </div>
                    <div class="btn">提现</div>
                </div>
            </div>

            <div style="margin-top: 10px;">
                <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" style="margin-bottom: 10px;">
                    <van-swipe-item v-for="(item, index) in store.user" :key="index" @click="onOpen(item.url)">
                        <img :src="item.img" style="height: 125px;width: 100%;border-radius: 5px;object-fit: cover;" />
                    </van-swipe-item>
                </van-swipe>
            </div>
            <div class="gn">
                <div style="padding: 10px 0;">功能中心</div>
                <div class="grid">
                    <div class="grid-item" v-for="(item, index) in listgn" :key="index"  @click="onGn(index)">
                        <img :src="item.icon" style="width: 32px;height: 32px;" />
                        <div>{{ item.label }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import defaultAvatar from "./../assets/my/user.svg"
import moment from 'moment'
import V0 from "@/assets/proilfe/0.png"
import V1 from "@/assets/proilfe/1.png"
import V2 from "@/assets/proilfe/2.png"
import V3 from "@/assets/proilfe/3.png"
import V4 from "@/assets/proilfe/4.png"
import V5 from "@/assets/proilfe/5.png"
import V6 from "@/assets/proilfe/6.png"
import o1 from "@/assets/icons/1.png";
import o2 from "@/assets/icons/2.png";
import o3 from "@/assets/icons/3.png";
import o4 from "@/assets/icons/4.png";
import o5 from "@/assets/icons/5.png";
import o6 from "@/assets/icons/6.png";
import o7 from "@/assets/icons/7.png";
import o8 from "@/assets/icons/8.png";
import o9 from "@/assets/icons/9.png";
import o11 from "@/assets/icons/11.png";
// import oo1 from "@/assets/me/01.png";
// import oo2 from "@/assets/me/02.png";
// import oo3 from "@/assets/me/03.png";
// import oo4 from "@/assets/me/04.png";
import { useHomeStore } from '@/store/home'
import router from '@/router';

const store = useHomeStore()
// let list= [
// 				{
// 					name: '账号：',
// 					text: '********',
// 					src: oo1
// 				},
// 				{
// 					name: '密码：',
// 					text: '********',
// 					src: oo2
// 				},
// 				{
// 					name: '官方网站:',
// 					text: 'https://91porn.hk/#/',
// 					src: oo3
// 				},
// 				{
// 					name: '官方邮箱:',
// 					text: 'kanbei6688@gmail.com',
// 					src: oo4
// 				}
// 			]
let listgn = [{
    icon: o1,
    label: '账户管理'
},
{
    icon: o2,
    label: '身份凭证'
},
{
    icon: o3,
    label: '联系客服'
},
{
    icon: o4,
    label: '推广分享'
},
{
    icon: o5,
    label: '浏览记录'
},
{
    icon: o6,
    label: '资金明细'
},
{
    icon: o7,
    label: '商务合作'
},
{
    icon: o8,
    label: '问题反馈'
},
{
    icon: o9,
    label: '更改密码'
},
{
    icon: o11,
    label: '邀请人列表'
},

]
console.log(store, "store");

const vipac = ref<any>(V0)
const memberInfo = ref<any>({
    memberName: '',
    memberCode: 0,
    memberAvatar: '',
    memberSignature: '这家伙很懒，什么都没留下',
    vipPeriod: 0,
    vipDate: '2025-06-19 19:34:46',
    memberCion: 0,
    balance: 0
})
const onOpen = (url: string) => window.open(url, '_blank')
const onGetVipIcon = () => {
    let vip = memberInfo.value.vipPeriod;
    const vipDateStr = memberInfo.value.vipDate
    // vipPeriod 为 0，直接返回 V0
    if (vip === 0) return V0

    if (!vipDateStr) return V0 // vipDate 不存在也返回 V0

    const vipDate = moment(vipDateStr, 'YYYY-MM-DD HH:mm:ss')
    const now = moment()

    // 如果 VIP 有效期大于当前时间
    if (vipDate.isAfter(now)) {
        return V6 // 或根据你的业务逻辑返回不同等级
    }
    if (vip === 1) {
        return V1
    }
    if (vip === 2) {
        return V2
    }
    if (vip === 3) {
        return V3
    }
    if (vip === 4) {
        return V4
    }
    if (vip === 5) {
        return V5
    }
}
const onGn=(index:number)=>{
    if(index === 0){
        router.push({
            path:'/centersetting'
        })
    }
}
onMounted(() => {
    const info = localStorage.getItem('memberInfo')
    if (info) {
        try {
            memberInfo.value = JSON.parse(info)
            console.log('本地用户信息', memberInfo.value)
            vipac.value = onGetVipIcon()
        } catch (err) {
            console.error('解析本地用户信息失败', err)
        }
    } else {
        console.log('本地没有用户信息')
    }
})
</script>
<style lang="less" scoped>
.my {
    height: 100vh;
    padding: 10px;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;

        .tit {
            font-weight: bold;
        }

        .flex {
            display: flex;
            align-items: center;

            .text {
                color: var(--primary-color);
                font-size: 14px;
                font-weight: bold;
            }
        }

    }

    .my-con {
        height: calc(100vh - 100px);
        overflow: auto;

        .info {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .info-left {
                display: flex;

                .info-u {
                    margin-left: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 80px;

                    .id {
                        color: var(--primary-color);
                        font-size: 12px;
                    }

                    .sign {
                        font-size: 12px;
                    }
                }
            }
        }

        .go-vip {
            margin-top: 10px;
            background: linear-gradient(90deg, #FFE2BD -2.32%, #FFAD41 108.33%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 10px;

            .go-left {
                display: flex;
                align-items: center;

                .go-left-text {
                    display: flex;
                    align-items: start;
                    flex-direction: column;
                    color: #8F5B2B;
                    margin-left: 10px;

                    .top {
                        font-weight: bold;
                        margin-bottom: 5px;
                    }

                    .min {
                        font-size: 10px;
                    }
                }
            }

            .go-right {
                background: linear-gradient(180deg, #FA7908 0%, #F23E1B 100%);
                color: var(--text-color);
                font-size: 14px;
                padding: 5px 15px;
                border-radius: 50px;
                font-weight: 500;
            }
        }

        .go-count {
            margin-top: 10px;
            width: 100%;
            padding: 10px;
            background: #FFFFFF33;
            color: var(--text-color);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .go-count-left {
                width: 48%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;

                .ac {
                    font-size: 16px;
                    color: var(--primary-color);
                }
            }

            .line {
                background: #EEEEEE33;
                height: 35px;
                width: 1px;
            }

            .go-count-right {
                width: 48%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;

                .ac {
                    font-size: 16px;
                    color: var(--primary-color);
                }
            }

            .btn {
                background: linear-gradient(180deg, #FA7908 0%, #F23E1B 100%);
                color: var(--text-color);
                font-size: 14px;
                padding: 5px 15px;
                border-radius: 50px;
                font-weight: 500;
            }
        }

        .gn {
            .grid {
                display: flex;
                flex-wrap: wrap;
                justify-content: start;

                .grid-item {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    width: 24.5%;
                    text-align: center;
                    margin-bottom: 15px;
                }
            }
        }
    }
}
</style>