<template>

    <div class="feed">
        <div class="header">
            <div @click="onBack()"><van-icon name="arrow-left" color="white" size="22" /></div>
            <div class="tit"> 留言反馈 </div>
            <div style="width: 22px;"></div>
        </div>
        <div style="padding: 5px 0px;">
            感谢您的宝贵意见和建议
        </div>
        <div>
            <van-cell-group inset style="margin: 0px;">
                <van-field class="ly" v-model="message" rows="1" autosize  type="textarea"
                    placeholder="请输入留言" />
            </van-cell-group>
        </div>
        <div class="line"></div>

        <div class="submit" @click="onSubmit()">提交</div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue"
import { showFailToast, showSuccessToast } from "vant";
import { post } from '@/utils/request'
const router = useRouter()
const message = ref<any>('')
const onBack = () => {
    router.back()
}
const onSubmit=async()=>{
    if(message.value === ''){
        showFailToast('请填写留言')
        return false;
    }
    const res = await post('/app-api/member/saveEntity', {
        comment_content:message.value
    })
    if (res.code === 0) {
        // 不显示提示
        message.value = '';
       showSuccessToast('感谢您的留言')
    }
}
</script>
<style lang="less" scoped>
.feed {
    height: calc(100vh - 50px);
    overflow: hidden;
    color: var(--text-color);
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

    .ly {
        background-color: var(--background-color);
        color: var(--text-color);
        padding: 0px;
    }
    .line{
        margin-top: 20px;
        width: 100%;
        height: 1px;
        background-color: white;
    }
    .submit{
        margin-top: 40px;
    height: 35px;
    width: 100%;
    overflow: hidden;
    background: linear-gradient(180deg, #ffbe00, #ff960c 104.01%);
    color: #000;
    font-weight: 700;
    display: flex
;
    align-items: center;
    justify-content: center;
    border-radius: 35px;
    }
}
</style>
<style lang="less">
/deep/ .van-field__label {
    color: var(--text-color);
}

/deep/ .van-field__control {
    color: var(--text-color) !important;
}

/deep/ .van-cell-group--inset {
    padding: 0px;
    border-radius: 0px;
    color: var(--text-color);
}
.van-field__control{
     color: var(--text-color) !important;
}
</style>