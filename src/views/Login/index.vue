<template>
  <div class="login-container">
    <el-form ref="formRef" :model="form" class="login-form" :rules="rules">
      <h3 class="title">{{ t('login.systemLogin') }}</h3>
      <el-form-item prop="username">
        <el-input v-model="form.username" :prefix-icon="User"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :prefix-icon="Lock"
          @keydown.enter="() => handleLogin(formRef)"
        />
      </el-form-item>
      <el-button type="primary" role="submit" class="login-button" @click="() => handleLogin(formRef)">
        {{ t('login.login') }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const router = useRouter()

const formRef = ref(null)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [
    {
      required: true,
      message: t('login.usernameRequired'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('login.passwordRequired'),
      trigger: 'blur',
    },
  ],
}

const handleLogin = async (formEl) => {
  if (!formEl) {
    return
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (form.username === 'admin' && form.password === '123456') {
        router.push('/manufacturing-process/auto-changeover/changeover-list')
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  width: 100wh;
  background-color: #2d3a4b;
  display: flex;
  justify-content: center;
  min-height: 560px;

  .login-form {
    padding-top: 180px;
    width: 480px;

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #454545;
      margin-bottom: 24px;
    }

    .el-input {
      height: 48px;
      font-size: 20px;

      :deep .el-icon {
        font-size: 24px;
      }

      :deep .el-input__wrapper {
        background-color: rgba(40, 52, 67, 1);

        .el-input__inner {
          color: #fff;
        }
      }
    }
    .login-button {
      width: 100%;
      height: 40px;
    }
  }

  .title {
    font-size: 26px;
    color: #eee;
    margin-bottom: 32px;
    text-align: center;
    user-select: none;
  }
}
</style>
