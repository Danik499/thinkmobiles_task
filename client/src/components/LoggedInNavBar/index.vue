<template>
    <div class="navbar">
        <div>Hello, {{ userName }}</div>
        <div>
            <span v-on:click="logout">
                <router-link to="#" class="navbar-link">Log out</router-link>
            </span>
        </div>
    </div>
</template>
  
<script>
import router from '@/router';


export default {
    data() {
        return {
            userName: localStorage.getItem('userName')
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
            alert('You were logged out successfuly');
            router.push('/main/1');
        }
    }
}
</script>
  
<style skoped>
.navbar {
    display: flex;
    justify-content: space-between;
}

.navbar-link {
    text-decoration: none;
    color: black;
}

.navbar-link:hover {
    color: black;
    text-decoration: underline;
}
</style>