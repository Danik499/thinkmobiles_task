<template>
  <div class="mt-5 login-form">
    <router-link class="link" to="/main/1">&lt;&lt;Back to users list</router-link>
    <form @submit.prevent="login">        
        <div class="form-outline form-floating mb-4">
            <input type="email" id="email" class="form-control" placeholder="Email" v-model="email" />
            <label for="email">Email</label>
        </div>

        <div class="form-outline form-floating mb-4">
            <input type="password" id="passwor" class="form-control" placeholder="Password" v-model="password" />
            <label for="password">Password</label>
        </div>

        <p>{{ error }}</p>

        <button type="submit" class="btn btn-primary btn-block">Log in</button>
    </form>
  </div>
</template>

<script>
import router from '@/router';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
    computed: mapGetters(['error']),
    mounted() {
        this.$store.dispatch('buildError', null)
    },
    methods: {
        async login() {
            await this.$store.dispatch('login', {
                email: this.email,
                password: this.password
            });

            if (!this.error) {
                router.push(`/user/${localStorage.getItem('userId')}/1`);
            }
        }
    }
}
</script>

<style scoped>
.login-form {
    width: 50%;
    margin: 0 auto;
}

.link {
    text-decoration: none;
    display: flex;
    justify-content: flex-start;
    margin-left: auto;
    margin-right: 0;
}
</style>