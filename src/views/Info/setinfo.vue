<template>
    <div class="setinfo">

        <!-- 内容区域 -->
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit">个人信息</div>
            <div style="width: 30px;"></div>
        </div>

        <div class="setinfo-con">
            <div class="avatar" v-if="loading === 0">
                <van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" :preview-image="true"
                    class="avatar-uploader">
                    <template #default>
                        <div v-if="!fileList.length" class="upload-placeholder">
                            <img src="/my/avatar.png" alt="头像" />
                        </div>
                    </template>
                </van-uploader>
            </div>
            <div v-else-if="loading === 1" class="avatar">
                <img :src="userinfo.data.memberAvatar" alt="头像" style="width: 80px;height: 80px;border-radius: 80px;" />
            </div>
            <div class="cn">
                <div class="text">用户名 (不可修改)</div>
                <div class="br">{{ userinfo.data.memberName }}</div>
            </div>
            <div class="cn">
                <div class="text">昵称 </div>
                <div class="br">
                    <input v-model="userinfo.data.memberNichen" type="text" class="input-p" placeholder=""
                        style="padding-right: 30px;" />
                </div>
            </div>
            <div class="cn">
                <div class="text">签名 </div>
                <div class="br">
                    <input v-model="userinfo.data.memberSignature" type="text" class="input-p" placeholder=""
                        style="padding-right: 30px;" />
                </div>
            </div>
            <!-- 保存按钮 -->
            <div style="width: 100%; display: flex; align-items: center; justify-content: center;">
                <div type="primary" block @click="onUpdate()" class="save-btn">
                    保存
                </div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from "vue-router";
import { Uploader, showToast } from 'vant'
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'
import avatar from "/my/avatar.png"
const loading = ref<any>(0)
const fileList = ref<any>([
])
const router = useRouter()
// 控制密码显示/隐藏
const userinfo = reactive<any>({
    data: {
        memberAvatar: avatar
    }
})

const afterRead = async (file: any) => {
    try {
        loading.value = 1
        const formData = new FormData()
        formData.append('file', file.file)
        const res = await post('/app-api/member/updateimg', formData)
        if (res.code === 0) {
            showToast('上传成功！')
            userinfo.data.memberAvatar = res.data.file // 直接修改属性即可
            console.log(userinfo.data.memberAvatar, " userinfo.data.memberAvatar ");
        }
    } catch (err) {
        console.log('上传错误:', err)
        showToast('上传失败')
    }
}
const onUpdate = async () => {
    const data = {
        memberAvatar: userinfo.data.memberAvatar,
        memberCode: userinfo.data.memberCode,
        memberNichen: userinfo.data.memberNichen,
        memberSignature: userinfo.data.memberSignature
    }
    const res = await post('/app-api/member/updateMember', data)
    if (res.code === 0) {
        onRfUserInfo()
        showToast('更新成功')
    }
}
const onRfUserInfo = async () => {
    const res = await post('/app-api/member/getEntityByCode', {
        memberCode: userinfo.data.memberCode
    });

    if (res.code === 0) {
        userinfo.data = res.data
        localStorage.setItem('memberInfo', JSON.stringify(res.data))
    }
}
const onBack = () => {
    router.back()
}
onMounted(() => {
    const memberInfoStr = localStorage.getItem('memberInfo')
    if (memberInfoStr) {
        const data = JSON.parse(memberInfoStr)
        userinfo.data = data
        // userinfo.data.memberAvatar = avatar
        // 如果有其他字段，也一一赋值
    } else {
        userinfo.data = null
    }
})
</script>
<style lang="less" scoped>
.setinfo {
    position: relative;
    height: 100vh;
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

    .setinfo-con {
        height: calc(100vh - 50px);
        display: flex;
        flex-direction: column;

        .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cn {
            padding: 0 10px;
            display: flex;
            flex-direction: column;

            .text {
                padding-bottom: 5px;
            }

            .br {
                padding-bottom: 10px;
                border-bottom: 1px solid white;
                margin-bottom: 10px;
            }
        }
    }

}

.input-p {
    width: 100%;
    background-color: transparent;
    border: none;
    color: white;
    padding-right: 30px;
    display: flex;
    align-items: center;
    font-size: 11px;
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
</style>