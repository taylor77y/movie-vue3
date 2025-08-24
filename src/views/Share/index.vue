<template>
    <div class="share">
        <div class="back" @click="onBack()"><van-icon name="arrow-left" size="22" color="white" /></div>
        <div class="yuan"></div>
        <div class="nv"></div>
        <div class="kp"></div>
        <div class="bottom-btn">
            <div class="item" @click="saveQRCode()">保存二维码</div>
            <div class="item active"  @click="onCopyText()" >复制链接分享</div>
        </div>
        <div class="content">
            <div  class="con-bg">
                <div class="left">
                    <img :src="qrCodeUrl" alt="二维码" />
                </div>
                <div class="right" style="margin-left: 10px;">
                    <div style="font-size: 14px; color: rgb(0, 0, 0);">邀请码</div>
                    <div 
                        style="color: rgb(255, 20, 12); font-size: 22px; font-weight: bold; ">{{ userinfo.memberCode }}
                    </div>
                    <div style="font-size: 10px; color: rgb(102, 102, 102);">使用浏览器扫码或者直接访问</div>
                    <div 
                        style="white-space: normal; word-break: break-all; color: rgb(121, 128, 167); font-size: 14px;" @click="onOpen()">
                        {{ url }}</div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="coa">
                <div class="coa-text">被邀请人需要绑定邀请人得邀请码才可绑定成功</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import {ref,onMounted} from "vue"
import QrCodeWithLogo from 'qrcode-with-logos'
import avatar from "@/assets/my/avatar.png"
import {showSuccessToast,showFailToast} from "vant"
import { copyText } from "@lxf2513/vue3-clipboard";
const router = useRouter()
const onBack = () => {
    router.back()
}
const  userinfo =ref<any>({})
const qrCodeUrl = ref('') // 用于绑定 <img :src="qrCodeUrl">
const url =ref('')

const generateQRCodeWithLogo = async (data: any) => {
  const getRandomColor = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');

  const qr = new QrCodeWithLogo({
    content: url.value,
    width: 110,
    logo: {
      src: data?.memberAvatar && data.memberAvatar.trim() !== '' ? data.memberAvatar : avatar,
      logoRadius: 8,
      borderRadius: 8,
      borderColor: "#FFF",
      bgColor: "#FFF",
      borderWidth: 2
    }
  })

  // 获取 canvas
  const canvas = await qr.getCanvas()
  // 转成 base64 显示
  qrCodeUrl.value = canvas.toDataURL('image/png')
}
const onOpen = () => {
  window.open(url.value, '_blank')
}

const onCopyText = async () => {
    copyText(url.value, undefined, (success, event) => {
        if (success) {
            showSuccessToast('复制成功');
        } else {
            showFailToast('复制失败');
        }
    });
}
const saveQRCode = () => {
  if (!qrCodeUrl.value) return
  const link = document.createElement('a')
  link.href = qrCodeUrl.value
  link.download = '邀请好友.png' // 文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
onMounted(async () => {
  const memberInfoStr:any = localStorage.getItem('memberInfo')
      const data = JSON.parse(memberInfoStr)
      userinfo.value = data
      url.value = window.location.href +'?'+`id=${data.memberCode}`
      await generateQRCodeWithLogo(data)
})

</script>
<style lang="less" scoped>
.share {
    background-image: url("./../../assets/share/hy.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 100vh;
    position: relative;

    .back {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 32px;
        height: 32px;
        background-color: rgba(0, 0, 0, .5);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }

    .yuan {
        position: absolute;
        top: 25%;
        left: 50%;
        width: 300px; // 自己设定大小
        height: 300px;
        transform: translate(-50%, -50%);
        background-image: url("./../../assets/share/yuan.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .nv {
        position: absolute;
        top: 35%;
        left: 50%;
        width: 200px; // 自己设定大小
        height: 350px;
        transform: translate(-50%, -50%);
        background-image: url("./../../assets/share/nv.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .kp {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 307px; // 自己设定大小
        height: 130px;
        transform: translate(-50%, -50%);
        background-image: url("./../../assets/share/kp.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .content {
        padding: 10px;
        width: 90%;
        background: hsla(0, 0%, 100%, .8);
        border-radius: 16px;
        display: flex;
        position: absolute;
        top: 70%;
        left: 50%;
        transform: translate(-50%, -50%);
        .con-bg{
            display: flex;
            align-items: start;
        }
    }

    .bottom-btn {
        width: 100%;
        position: absolute;
        bottom: 10%;
        left: 0%;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .item {
            width: 42%;
            color: black;
            background-color: #b1b1b1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: PingFang SC;
            font-size: 16px;
            text-align: center;
            font-weight: 600;
            border-radius: 48px;
            height: 48px;
        }

        .active {
            background: linear-gradient(180deg, #ffbe00, #ff960c 104.01%);
            color: black;
        }
    }

    .bottom {
        width: 100%;
        position: absolute;
        bottom: 0%;
        left: 0%;
        display: flex;
        align-items: center;
        justify-content: center;

        .coa {
            display: flex;
            align-items: center;
            justify-content: center;

            .coa-text {
                margin-top: 10px;
                background: rgba(4, 4, 4, .2);
                padding: 5px 10px;
                border-radius: 3px;
                color: #ff191c;
                text-shadow: 1px 1px 0 #fff, -1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff;
            }
        }
    }
}
</style>