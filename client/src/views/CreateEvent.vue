<template>
    <div class="mt-5 create-event-form">
        <span v-on:click="redirectToUserPage"><router-link class="link" to="#">&lt;&lt;Back to user page</router-link></span>
        <form @submit.prevent="createEvent">
            <div class="form-outline form-floating mb-4 mt-2">
                <input type="text" class="form-control" id="title" placeholder="Title" v-model="title">
                <label for="title">Title</label>
            </div>
            
            <div class="form-outline form-floating mb-4">
                <input type="date" id="startDate" class="form-control" placeholder="Start date" v-model="startDate" />
                <label for="startDate">Start date</label>
            </div>

            <div class="form-outline form-floating mb-4">
                <input type="date" id="endDate" class="form-control" placeholder="End date" v-model="endDate" />
                <label for="startDate">End date</label>
            </div>

            <div class="form-outline form-floating mb-4">
                <textarea type="tel" class="form-control" placeholder="Description" v-model="description"></textarea>
                <label for="startDate">Description</label>
            </div>

            <p>{{ eventValidationMessage }}</p>

            <button type="submit" class="btn btn-primary btn-block">Create event</button>
        </form>
    </div>

</template>

<script>
import router from '@/router';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            title: '',
            description: '',
            startDate: '',
            endDate: ''
        }
    },
    computed: mapGetters(['eventValidationMessage']),
    mounted() {
        this.$store.dispatch('buildValidationMessage', null)
    },
    methods: {
        async createEvent() {
            if (!this.title || !this.description || !this.startDate || !this.endDate) {
                this.$store.dispatch('buildValidationMessage', 'All fields must be filled');
                return;
            }

            await this.$store.dispatch('createEvent', {
                title: this.title,
                description: this.description,
                startDate: this.startDate,
                endDate: this.endDate,
                owner: this.$route.params.id
            });

            if (!this.eventValidationMessage) {
                this.redirectToUserPage();
            }
        },

        redirectToUserPage() {
            router.push(`/user/${this.$route.params.id}/1`);
        },
    }
}
</script>

<style scoped>
.create-event-form {
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