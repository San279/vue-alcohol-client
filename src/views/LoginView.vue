<script setup>
</script>

<template>
  <div class="login-page">
    <div class="login-wrapper">
      <input class="user-input" v-model="user.userName" placeholder="Username" />
      <input class="pass-input" v-model="user.passWord" type="password" placeholder="Password" />
      <button class="login-btn" @click="loginAcc">LOGIN</button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import api from '@/assets/api'
const apiReq = new api();
import router from '@/router';
export default {
  data() {
    return {
      user: ref({
        userName:'',
        passWord:''
      })
    }
  },
  methods: {
    loginAcc() {
      apiReq.post("user/login", this.user)
    .then(data => {
      alert("login succesfully")
      localStorage.setItem("token", "bearer " + data.accessToken);
      window.location.href = "http://localhost:5173/"
    })
    .catch(error => {
      console.log(error);
      alert("login failed");
    });
    },
    mounted() {

    }
  }
}
</script>
<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.login-wrapper {
  width: 20%;
  height: 15vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.9;
  border-radius: 2%;
  border: 1px solid rgb(108, 160, 219);
  background-color: rgb(218, 236, 252);
  padding: 20px;
}

.user-input {
  width: 90%;
  border: none;
  border-radius: 4px;
  padding: 10px;
  background-color: rgb(188, 200, 214);
  margin: 20px 10px 10px 10px;
}

.pass-input {
  width: 90%;
  border: none;
  border-radius: 4px;
  padding: 10px;
  background-color: rgb(188, 200, 214);
  margin: 20px 10px 10px 10px;
}

.login-btn {
  padding: 14px;
  border: none;
  width: 50%;
  ;
  margin-top: 5%;
  font-size: 14px;
  font-weight: Bold;
  background-color: rgb(108, 160, 219);
  border-radius: 4px;
  color: white;
  cursor: pointer;
}
</style>
