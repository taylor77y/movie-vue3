<template>
    <div class="my">
        <div class="header">
            <div style="width: 80px;"></div>
            <div class="tit">我的</div>
            <div class="flex">
                <img src="/my/Moon.svg" style="margin-right: 10px;" />
                <img src="/my/01.svg" style="margin-right: 10px;" />
                <div class="text" @click="onSign()">签到</div>
            </div>
        </div>
        <div class="my-con">
            <div class="info" @click="onGo('/setinfo')">
                <div class="info-left">
                    <div>
                        <img :src="memberInfo?.memberAvatar || 'public/my/user.svg'" alt="头像"
                            style="width: 82px;height: 82px;border-radius: 10px;" />
                    </div>
                    <div class="info-u">
                        <div>
                            <div style="display: flex;align-items: center;">
                                <div>{{ memberInfo.memberNichen }}</div> <img :src="vipac"
                                    style="width: 52px;height: 16px;margin-left: 10px;" />
                            </div>
                            <div class="id">ID:{{ memberInfo.memberCode }}</div>
                        </div>
                        <div class="sign">签名：{{ memberInfo.memberSignature ? memberInfo.memberSignature : '这家伙很懒，什么都没留下'
                            }}
                        </div>
                    </div>
                </div>
                <div><van-icon name="arrow" color="#FF960C" size="22" /></div>
            </div>
            <div class="go-vip">
                <div class="go-left">
                    <img src="/proilfe/king.svg" />
                    <div class="go-left-text">
                        <div class="top">VIP限时特惠 畅享全场</div>
                        <div class="min">开通VIP全场畅看</div>
                    </div>
                </div>
                <div class="go-right" @click="onVip()">会员充值</div>
            </div>

            <div class="go-count">
                <div class="go-count-left">
                    <div>
                        <div>金币数量(个)</div>
                        <div class="ac">{{ memberInfo.memberCion }}</div>
                    </div>
                    <div class="btn" @click="onPay()">充值</div>
                </div>
                <div class="line"></div>
                <div class="go-count-right">
                    <div>
                        <div>余额（元）</div>
                        <div class="ac">${{ memberInfo.balance }}</div>
                    </div>
                    <div class="btn" @click="onTx()">提现</div>
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
                    <div class="grid-item" v-for="(item, index) in listgn" :key="index" @click="onGn(index)">
                        <img :src="item.icon" style="width: 32px;height: 32px;" />
                        <div>{{ item.label }}</div>
                    </div>
                </div>
            </div>
        </div>
        <van-overlay :show="show" @click="show = false">
            <div class="wrapper">
                <div class="flex-b" @click.stop>
                    <div class="block">
                        <div class="header">
                            <div class="flex-h">
                                <div>
                                </div>
                                <div class="line">
                                </div>
                                <div style="display: flex;align-items: center;justify-content: center;height: 40px;">
                                    <van-icon name="cross" size="22" @click="show = false" />
                                </div>

                            </div>
                            <div class="flex-h-h">
                                <div class="img"> <img src="/Image/logo.png"
                                        style="width: 86px;height: 18px;" /> </div>
                                <div class="text">身份证卡</div>
                            </div>
                        </div>
                        <div class="content">
                            <div class="mask-bg">
                                <img :src="qrCodeUrl" />
                                <div v-for="(item, index) in list" :key="index"
                                    style="display: flex;align-items: center;padding:5px 10px ;width: 100%;justify-content: space-between;">
                                    <div style="display: flex;align-items: center;">
                                        <image :src="item.src" style="width: 18px;height: 18px;"></image>
                                        <div style="margin-left: 5px;font-size: 14px;color: black;font-weight: bold;">{{
                                            item.name
                                        }} {{ item.text }}</div>
                                    </div>
                                    <div style="color: #E93C36;font-size: 16px;font-weight: bold;" v-if="index != 0"
                                        @click="onCopyText(item.text)">复制</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="save-btn" @click="onSave()">请截图保存</div>
                </div>

            </div>
        </van-overlay>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

import moment from 'moment'
import QRCode from 'qrcode'

import { useHomeStore } from '@/store/home'
import router from '@/router';
import { copyText } from '@lxf2513/vue3-clipboard';
import { showToast, showSuccessToast, showFailToast } from 'vant'
const show = ref<any>(false)
const qrCodeUrl = ref<any>('')
const store = useHomeStore()
let list = ref<any>([
  {
    name: '账号：',
    text: '********',
    src: '/my/me/01.png'
  },
  {
    name: '密码：',
    text: '********',
    src: '/my/me/02.png'
  },
  {
    name: '官方网站:',
    text: 'https://91porn.hk/#/',
    src: '/my/me/03.png'
  },
  {
    name: '官方邮箱:',
    text: 'kanbei6688@gmail.com',
    src: '/my/me/04.png'
  }
]);

let listgn = ref<any>([
  { icon: '/icons/1.png', label: '账户管理' },
  { icon: '/icons/2.png', label: '身份凭证' },
  { icon: '/icons/3.png', label: '联系客服' },
  { icon: '/icons/4.png', label: '推广分享' },
  { icon: '/icons/5.png', label: '浏览记录' },
  { icon: '/icons/6.png', label: '资金明细' },
  { icon: '/icons/7.png', label: '商务合作' },
  { icon: '/icons/8.png', label: '问题反馈' },
  { icon: '/icons/9.png', label: '更改密码' },
  { icon: '/icons/11.png', label: '邀请人列表' }
]);
const vipIcons = [
  '/proilfe/0.png', // V0
  '/proilfe/1.png', // V1
  '/proilfe/2.png', // V2
  '/proilfe/3.png', // V3
  '/proilfe/4.png', // V4
  '/proilfe/5.png', // V5
  '/proilfe/6.png'  // V6
];

const vipac = ref<any>('/proilfe/0.png')
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
const onCopyText = async (text: any) => {
    copyText(text, undefined, (success, event) => {
        if (success) {
            showSuccessToast('复制成功');
        } else {
            showFailToast('复制失败');
        }
    });
}
const onPay = () => {
    router.push({
        path: '/pay'
    })
}
const onVip = () => {
    router.push({
        path: '/vip'
    })
}
const onTx = () => {
    router.push({
        path: '/tx'
    })
}
const onCreateQT = async () => {
    const text = window.location.href.replace('/my', '')
    qrCodeUrl.value = await QRCode.toDataURL(text, {
        width: 150,   // 二维码宽度
        margin: 1,
        padding: 2,
        color: {
            dark: '#000000',  // 二维码颜色
            light: '#ffffff'  // 背景颜色
        }
    })
}
const onGo = (path: any) => {
    router.push({
        path: path,
    })
}
const onOpen = (url: string) => window.open(url, '_blank')
const onGetVipIcon = () => {
  const vip = memberInfo.value.vipPeriod;
  const vipDateStr = memberInfo.value.vipDate;

  // vip = 0 或 vipDate 不存在，返回默认 V0
  if (vip === 0 || !vipDateStr) return vipIcons[0];

  const vipDate = moment(vipDateStr, 'YYYY-MM-DD HH:mm:ss');
  const now = moment();

  // VIP 有效
  if (vipDate.isAfter(now)) {
    // 根据业务逻辑返回对应等级
    return vipIcons[vip] || vipIcons[6]; // 超出范围就返回最高 V6
  }

  // VIP 已过期
  return vipIcons[0];
};
const onSign = () => {
    router.push({
        path: '/sign'
    })
}
const onGn = (index: number) => {
    if (index === 0) {
        router.push({
            path: '/centersetting'
        })
    }
    if (index === 1) {
        show.value = true
    }
    if (index === 2) {
        window.open('https://kanbei02.top/chatlink.html', '_blank');
    }
    if (index === 3) {
        router.push({
            path: '/share'
        })
    }
    if (index === 4) {
        router.push({
            path: '/history'
        })
    }
    if (index === 5) {
        router.push({
            path: '/agent'
        })
    }
    if (index === 6) {
        window.open('https://t.me/nineone91porn', '_blank');
    }
    if (index === 7) {
        router.push({
            path: '/feed'
        })
    }
    if (index === 8) {
        router.push({
            path: '/setpaw'
        })
    }
    if (index === 9) {
        router.push({
            path: '/codelist'
        })
    }
}
const onSave = () => {
    showToast('请手动截图保存')
}
onMounted(() => {
    const info = localStorage.getItem('memberInfo')
    if (info) {
        try {
            memberInfo.value = JSON.parse(info)
            console.log('本地用户信息', memberInfo.value)
            list.value[0].text = memberInfo.value.memberNichen
            list.value[1].text = memberInfo.value.memberPwdTemp
            vipac.value = onGetVipIcon()
            onCreateQT()
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
        height: 50px;

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
            padding-bottom: 80px;

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
<style lang="less" scoped>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    .flex-b {
        height: 70%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        width: 80%;

        .block {
            width: 100%;
            height: 80%;
            background: linear-gradient(1turn, #161616 79.38%, #30303d);
            color: #fff;
            border-radius: 10px;
            position: relative;

            .header {
                display: flex;
                flex-direction: column;

                .flex-h {
                    padding: 0px 10px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .line {
                        position: absolute;
                        left: 50%;
                        top: 10px;
                        -webkit-transform: translateX(-50%);
                        transform: translateX(-50%);
                        background: #000;
                        width: 70px;
                        height: 18px;
                        border-radius: 18px;
                    }
                }

                .flex-h-h {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .img {
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .text {
                        margin-top: 3px;
                        height: 24px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }

            .content {
                position: absolute;
                bottom: 0px;
                left: 0px;
                width: 100%;
                border-radius: 10px;
                background: linear-gradient(147.03deg, #fefefe 5.39%, #e9d7af 52.03%, #e0c397 84.83%, #f2c4ac 107.35%);
                display: flex;
                align-items: center;
                flex-direction: column;
            }
        }

        .save-btn {
            background-color: rgb(255, 202, 40);
            color: black;
            margin-top: 35px;
            width: 80%;
            overflow: hidden;
            border: none;
            border-radius: 50px;
            height: 35px;
            font-weight: bold;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

}

.mask-bg {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    border-radius: 10px;
    background: linear-gradient(147.03deg, #FEFEFE 5.39%, #E9D7AF 52.03%, #E0C397 84.83%, #F2C4AC 107.35%);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px 0px;
    width: 100%;
}

.btn {
    padding: 15rpx 30rpx;
    border-radius: 10rpx;
    margin: 0 10rpx;
}

.cancel {
    background: #555;
}

.confirm {
    background: #ff9800;
}
</style>