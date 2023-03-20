<template>
  <div class="mt-5 create-user-form">
    <router-link class="link" to="/main/1">&lt;&lt;Back to users list</router-link>
    <form @submit.prevent="createUser">
        <div class="form-outline form-floating mb-4 mt-2">
            <input type="text" id="firstName" class="form-control" placeholder="First name" v-model="firstName" />
            <label for="firstName">First name</label>
        </div>
        
        <div class="form-outline form-floating mb-4">
            <input type="text" id="lastName" class="form-control" placeholder="Last name" v-model="lastName" />
            <label for="lastName">Last name</label>
        </div>

        <div class="form-outline form-floating mb-4">
            <input type="email" id="email" class="form-control" placeholder="Email" v-model="email" />
            <label for="email">Email</label>
        </div>

        <div class="form-outline form-floating mb-4">
            <input type="password" id="passwor" class="form-control" placeholder="Password" v-model="password" />
            <label for="password">Password</label>
        </div>

        <div class="form-outline form-floating mb-4">
            <input type="tel" id="phoneNumber" class="form-control" placeholder="Phone number" v-model="phoneNumber" />
            <label for="phoneNumber">Phone number</label>
        </div>

        <p>{{ error }}</p>

        <button type="submit" class="btn btn-primary btn-block">Create User</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: ''
        };
    },
    computed: mapGetters(['error']),
    mounted() {
        this.$store.dispatch('buildError', null)
    },
    methods: {
        async createUser() {
            await this.$store.dispatch('createUser', {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                phoneNumber: this.phoneNumber,
            });

            if (!this.error) this.$router.push('/main/1');
        }
    }
}
</script>

<style scoped>
.create-user-form {
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