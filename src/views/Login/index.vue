<template>
    <div class="login">


        <!-- 内容区域 -->
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit">登录</div>
            <div></div>
        </div>
        <!-- 背景视频 -->
        <video ref="videoRef" class="bg-video" style="width: 100%;height: calc(100vh - 50px);" autoplay muted loop
            playsinline>
            <source src="/background.mp4" type="video/webm" />
            <source src="/background.mp4" type="video/mp4" />
        </video>
        <div class="bg-video-item ">
            <div style="display: flex;align-items: center;">
                <div class="welcome-text">欢迎来到</div>
                <img class="welcome-logo" src="/91PORN.png" style="width: 150px;height: 30px;" />
            </div>
            <div class="logintext">账号登录</div>
            <div class="login-container">
                <!-- 账号输入框 -->
                <input v-model="account" class="login-input" type="text" placeholder="请输入账号"
                    placeholder-class="placeholder" />

                <!-- 密码输入框 -->
                <input v-model="password" class="login-input" type="password" placeholder="请输入密码"
                    placeholder-class="placeholder" />

                <!-- 忘记密码 -->
                <div class="forget-box">
                    <text>忘记密码？</text>
                    <text class="link" @click="onKefu()">点我联系客服</text>
                </div>

                <!-- 登录按钮 -->
                <button class="login-btn" @click="onLogin()">立即登录</button>

                <!-- 年龄提示 -->
                <div class="age-limit">
                    静止未满18周岁的用户注册使用
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { onMounted, ref } from "vue"
import { post } from '@/utils/request'
import { showToast } from "vant"
const router = useRouter()
const account = ref<any>('')
const password = ref<any>('')
const videoRef = ref<any>(null)
const onBack = () => {
    router.back()
}
const onKefu = () => {
    window.open('https://kanbei03.top/chatlink.html', '_blank')
}
const onLogin = async () => {
    // 判空
    if (!account.value) {
        showToast('请输入账号')
        return
    }
    if (!password.value) {
        showToast('请输入密码')
        return
    }

    try {
        const data = {
            loginName: account.value,
            loginPwd: password.value,
            type: "login"
        }

        const res = await post('app-api//login', { ...data })

        if (res.code === 0) {
            const parsedData = res.data
            console.log(parsedData.token,"parsedData");
            localStorage.setItem('memberInfo', JSON.stringify(parsedData))
            localStorage.setItem('token', JSON.stringify(parsedData.token))
            router.push("/")
            // 登录成功提示
            showToast('登录成功！')
            // 可以在这里做登录后的操作，例如跳转或存储 token
        } else {
            // 登录失败提示
            showToast(res.message || '登录失败')
        }
    } catch (error) {
        console.error(error)
        showToast('网络异常，请稍后重试')
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
onMounted(() => {
    const video = videoRef.value
    if (video) {
        video.addEventListener('click', e => e.preventDefault())
        video.addEventListener('contextmenu', e => e.preventDefault())
    }
     if (isIphoneX()) {
    const header = document.querySelector('.videoinfo') as HTMLElement
    if (header) header.style.paddingTop = '90px'
    }
})
</script>

<style lang="less" scoped>
.login {
    position: relative;
    min-height: 90vh;
    overflow: hidden;


    .header {
        position: relative; // 保证在视频上方
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        color: white;

        .tit {
            font-weight: bold;
            font-size: 18px;
        }
    }

    .bg-video {
        width: 100%;
        height: calc(100vh - 50px);
        object-fit: cover;
        position: relative;
        top: 0;
        left: 0;
        z-index: 1;
    }

    /* 覆盖内容层 */
    .bg-video-item {
        position: relative;
        z-index: 888;
        /* 高于视频 */
        display: flex;
        align-items: start;
        flex-direction: column;
        color: white;
        text-align: center;
        width: 100%;
        height: calc(100vh - 50px);
        object-fit: cover;
        background-color: transparent;
        z-index: 99;
        position: absolute;
        top: 50px;
        left: 0;
        padding: 80px 15px;

        .uni-input-placeholder {
            text-align: left;
        }

        .welcome-text {
            font-family: PingFang SC;
            font-size: 32px;
            line-height: 18px;
            letter-spacing: 0px;
            text-align: center;
            color: #FFFFFFCC;
        }

        .welcome-logo {
            width: 120px;
            height: auto;
        }

        .logintext {
            font-family: PingFang SC;
            font-weight: bold;
            font-size: 24px;
            line-height: 16px;
            letter-spacing: 0%;
            text-align: center;
            color: white;
            padding: 40px 0px;
        }

        .login-container {
            color: #fff;
            font-size: 14px;
            width: 95%;
        }

        /* 输入框样式 */
        .login-input {
            width: 100%;
            height: 55px;
            background-color: #2f2f2f;
            border-radius: 10px;
            margin-bottom: 15px;
            padding: 0 12px;
            color: #fff;
            border: none;
        }

        .placeholder {
            color: #999;
        }

        /* 忘记密码行 */
        .forget-box {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 13px;
            color: white;
            margin-bottom: 20px;
        }

        .link {
            margin-left: 5px;
        }

        /* 登录按钮 */
        .login-btn {
            width: 100%;
            height: 45px;
            line-height: 45px;
            color: #000;
            font-weight: bold;
            background: linear-gradient(90deg, #ffbe00, #ff960c);
            border-radius: 25px;
            font-size: 16px;
            border: none;
        }

        /* 年龄限制提示 */
        .age-limit {
            text-align: center;
            color: white;
            font-size: 12px;
            margin-top: 15px;
        }
    }
}
</style>
