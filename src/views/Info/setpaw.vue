<template>
    <div class="setpaw">

        <!-- 内容区域 -->
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit"> 修改密码 </div>
            <div style="width: 30px;"></div>
        </div>
        <div class="page">
            <!-- 原密码 -->
            <div>
                <div>原密码</div>
                <div class="input-c" style="position: relative;">
                    <input v-model="form.oldPwd" :type="showPassword ? 'text' : 'password'" class="input-p"
                        placeholder="请输入原密码" style="padding-right: 30px;" />
                    <span @click="togglePassword(0)"
                        style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); cursor: pointer;">
                        <van-icon name="eye" v-if="!showPassword" />
                        <van-icon name="eye-o" v-else />
                    </span>
                </div>
            </div>

            <!-- 新密码 -->
            <div>
                <div>新密码</div>
                <div class="input-c" style="position: relative;">
                    <input v-model="form.newPwd" :type="showPassword1 ? 'text' : 'password'" class="input-p"
                        placeholder="请输入新密码" style="padding-right: 30px;" />
                    <span @click="togglePassword(1)"
                        style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); cursor: pointer;">
                        <van-icon name="eye" v-if="!showPassword1" />
                        <van-icon name="eye-o" v-else />
                    </span>
                </div>
            </div>

            <!-- 确认密码 -->
            <div>
                <div>确认密码</div>
                <div class="input-c" style="position: relative;">
                    <input v-model="form.repeatPwd" :type="showPassword2 ? 'text' : 'password'" class="input-p"
                        placeholder="再次输入新密码" style="padding-right: 30px;" />
                    <span @click="togglePassword(2)"
                        style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); cursor: pointer;">
                        <van-icon name="eye" v-if="!showPassword2" />
                        <van-icon name="eye-o" v-else />
                    </span>
                </div>
            </div>

            <!-- 保存按钮 -->
            <div style="width: 100%; display: flex; align-items: center; justify-content: center;">
                <div type="primary" block @click="submit" class="save-btn">
                    保存
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from "vue-router";
import { showToast } from "vant"
import { post } from '@/utils/request'
import AES from '@/utils/aes1.js'

const router = useRouter()
const form = reactive({
    oldPwd: '',
    newPwd: '',
    repeatPwd: ''
})

// 控制密码显示/隐藏

const showPassword = ref(false)
const showPassword1 = ref(false)
const showPassword2 = ref(false)

const togglePassword = (index: number) => {
    if (index === 0) {
        showPassword.value = !showPassword.value
    }
    if (index === 1) {
        showPassword1.value = !showPassword1.value
    }
    if (index === 2) {
        showPassword2.value = !showPassword2.value
    }
}


const submit = async () => {
    if (!form.oldPwd) return showToast('请输入原密码')
    if (!form.newPwd) return showToast('请输入新密码')
    if (form.newPwd.length < 6 || form.newPwd.length > 12) 
    return showToast('新密码长度必须在6-12位')
    if (!form.repeatPwd) return showToast('请再次输入新密码')
    if (form.repeatPwd.length < 6 || form.repeatPwd.length > 12) 
    return showToast('确认密码长度必须在6-12位')
    if (form.newPwd !== form.repeatPwd) return showToast('两次输入的密码不一致')


    showToast('修改成功')
    console.log('表单提交:', form)
    let userinfo:any= localStorage.getItem('memberInfo')
     userinfo = JSON.parse(userinfo)
    const data = {
        memberCode:userinfo,
        oldPwd: form.oldPwd,
        newPwd: form.newPwd,
    }
    const res = await post('/app-api/member/MemberInfo/changePwd', { ...data })
    console.log(res, 'res');
    if(res.code === 0){
         const data = JSON.parse(AES.decrypt(res.data, 'asdasdsadasdasds', '5245847584125485'))
         router.replace({
            path:'/login'
         })
    }

}
const onBack = () => {
    router.back()
}
</script>
<style lang="less" scoped>
.setpaw {
    position: relative;
    height: 100vh;
    overflow: auto;
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

    .page {
        background-color: #000;
        padding: 10px;

        .input-c {
            width: 100%;
            padding: 10px 0;
            display: flex;
            align-items: center;

            .input-p {
                width: 100%;
                background-color: transparent;
                border: none;
                border-bottom: 1px solid var(--br-color);
                padding-bottom: 10px;
                color: white;
                font-size: 14px;
                padding-right: 30px;
                display: flex;
                align-items: center;
            }
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
</style>