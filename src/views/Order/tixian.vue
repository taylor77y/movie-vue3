<template>
    <div class="tixian">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit">提现</div>
            <div style="width: 36px;"></div>
        </div>
        <div class="pd10">
            <div class="title">提取金额</div>
            <!-- 允许输入数字，调起带符号的纯数字键盘 -->
            <van-field v-model="number" type="number" label="￥" placeholder="请输入提现金额" />
            <div class="tx-h">
                <div>可提现金额0元</div>
                <div class="tx-text" @click="goOrder()">提现记录</div>
            </div>

            <div>
                <van-uploader :after-read="afterRead">
                    <!-- 自定义内容 -->
                    <div class="custom-uploader">
                        <div v-if="!url"
                            style="display: flex;align-items: center;justify-content: center;flex-direction: column;">
                            <van-icon name="plus" size="40" color="white" />
                            <div class="text">收款码</div>
                        </div>
                        <img v-else :src="url" style="width: 120px;height:130px;border-radius: 5px;" />
                    </div>

                </van-uploader>
            </div>

            <div style="padding: 20px 0px;">
                <van-radio-group v-model="checked" checked-color="#E1B39F">
                    <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 20px;">
                        <img src="/tixian/wx.svg" style="width: 28px;height: 28px;" /><van-radio
                            name="1"></van-radio>
                    </div>
                    <div style="display: flex;align-items: center;justify-content: space-between;"><img
                            src="/tixian/zfb.svg" style="width: 28px;height: 28px;" /><van-radio
                            name="2"></van-radio></div>
                </van-radio-group>
            </div>

            <div class="save" @click="onSave()">确认提现</div>

        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
const O1 = '/setting/01.svg';
const O2 = '/setting/02.svg';

import { post } from '@/utils/request'
import { useRouter } from "vue-router";
import { showFailToast, showSuccessToast } from "vant";
const router = useRouter()
const number = ref<any>('')
const checked = ref('1');
const url = ref<any>('')
const onBack = () => {
    router.back()
}
const afterRead = async (file: any) => {
    // 此时可以自行将文件上传至服务器
    const formData = new FormData()
    formData.append('file', file.file)
    const res = await post('/app-api/member/updateimg', formData)
    if (res.code === 0) {
        showSuccessToast('上传成功')
        url.value = res.data.file
    }
};
const goOrder= ()=>{
    router.push({
        path:'/order'
    })
}
const onSave = async () => {
    if (number.value === '' || number.value === 0) {
        showFailToast('请输入金额')
    }
    if (url.value === '') {
        showFailToast('请上传收款码')
    }

    const data = {
        imgurl: url.value,
        index: checked.value === '1' ? 'wx' : "zfb",
        money: number.value
    }
    const res = await post('/app-api/member/tixian', {
        ...data
    })
    if (res.code === 0) {
        showFailToast(res.msg)
        await onRfUserInfo()
    } else {
        showFailToast(res.msg)
    }
}
const onRfUserInfo = async () => {
     const memberInfoStr = localStorage.getItem('memberInfo')
    if (memberInfoStr) {
        const data = JSON.parse(memberInfoStr)
            const res = await post('/app-api/member/getEntityByCode', {
            memberCode: data.memberCode
        });

        if (res.code === 0) {
            localStorage.setItem('memberInfo', JSON.stringify(res.data))
        }
    } else {
    }
  
}
onMounted(() => {
})
</script>
<style lang="less" scoped>
.tixian {
    height: 100vh;

    .header {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--text-color);

        .tit {
            font-weight: bold;
        }
    }

    .pd10 {
        padding: 10px;
        display: flex;
        flex-direction: column;

        .title {
            font-size: 16px;
        }

        .tx-h {
            padding: 20px 0px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .tx-text {
                color: var(--primary-color);
            }
        }
    }


    /deep/ .van-cell {
        background-color: var(--background-color);
        padding: 20px 0px;
    }

    /deep/ .van-field__label {
        width: 5%;

        >label {
            color: white;
            font-size: 20px;
            font-weight: bold;
        }
    }

    /deep/ .van-field__control {
        color: white;
        font-size: 20px;
    }

    /deep/ .van-radio__label {
        color: var(--text-color);
    }

    .custom-uploader {
        position: relative;
        background: #272727;
        height: 131px;
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 8px;
        z-index: 0;
        /* 保证伪元素在底层 */
        overflow: hidden;
        /* 防止伪元素溢出 */
    }

    .custom-uploader::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 8px;
        padding: 2px;
        /* 边框厚度 */
        background: linear-gradient(270deg, #87725E, #F4D6AE, #87725E);
        background-size: 300% 300%;
        /* 让渐变有足够空间流动 */
        -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
        transition: background-position 0.3s linear;
    }

    /* hover 时启动动画 */
    .custom-uploader:hover::after {
        animation: border-flow 3s linear infinite;
    }

    @keyframes border-flow {
        0% {
            background-position: 0% 50%;
        }

        50% {
            background-position: 100% 50%;
        }

        100% {
            background-position: 0% 50%;
        }
    }

    .save {
        background: linear-gradient(180deg, #FFBE00 0%, #FF960C 104.01%);
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 45px;
        border-radius: 45px;
        font-weight: bold;
    }

}
</style>