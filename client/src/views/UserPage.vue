<template>
  <div>
    <div>
        <span class="link-wrapper"><router-link to="/main/1" class="link">&lt;&lt;Back to users list</router-link></span>
        <div v-if="user.firstName" class="user-info">
            <div>
                Name: <b>{{ user.firstName + ' ' + user.lastName }}</b> <br />
                Email: <b>{{ user.email }}</b> <br />
                Phone number: <b>{{ user.phoneNumber }}</b> <br />
                Events count: <b>{{ user.eventsCount }}</b> <br />
                <span v-if="user.nextEventStartDate">
                    Next event start date: <b>{{ user.nextEventStartDate.split('T')[0] }}</b>
                </span>
            </div>
        </div>
        <div>
            <div class="select-box"  v-if="events && events[0]">
                <div>
                    Items per page&nbsp;
                    <select v-model="pageSize" v-on:change="sort">
                        <option>5</option>
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                </div>
                <div>
                    Sort by&nbsp;
                    <select v-model="sortingOption" v-on:change="sort">
                        <option>Title</option>
                        <option>Description</option>
                        <option>Start date</option>
                        <option>End date</option>
                    </select>
                    &nbsp;Order&nbsp;
                    <select v-model="sortingOrder" v-on:change="sort">
                        <option>From lowest to highest</option>
                        <option>From highest to lowest</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
    <div v-if="events && events[0]">
        <events-list :events="events" v-on:rerender="rerenderList" :key="rerender"/>
        <paginator v-on:rerender="rerenderList" :isLast="isLastEventPage" :pageName="`user/${this.$route.params.id}`" />
    </div>
    <div v-else-if="isLoaded">
        This user has no events
    </div>
    <div v-else class="loader">
        <loader />
    </div>

    <button class="mt-2 mb-5 btn btn-primary btn-block" v-on:click="redirectToCreateEventPage">Create event</button>
  </div>
</template>

<script>
import EventsList from '../components/EventsList';
import Paginator from '../components/Paginator';
import Loader from '../components/Loader';
import router  from '@/router';
import { mapGetters } from 'vuex';

export default {
    components: {
        EventsList, Paginator, Loader
    },
    data() {
        return {
            sortingOption: '',
            sortingOrder: 'From lowest to highest',
            pageSize: 10,
            rerender: 0
        }
    },
    computed: mapGetters(['events', 'isLastEventPage', 'user', 'isLoaded']),
    mounted() {
        this.$store.commit('setEventsListPageSize', 10);
        this.$store.commit('setEvents', null)

        this.$store.dispatch('loadUserEvents', { id: this.$route.params.id, page: this.$route.params.page });
        this.$store.dispatch('getUserById', this.$route.params.id);
    },
    methods: {
        async sort() {
            const sortingOrder = this.sortingOrder === 'From lowest to highest' ? '' : '-';
            const sortingOptionToCamelCase = this.sortingOption.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

            this.$store.commit('setSortingOption', sortingOrder + sortingOptionToCamelCase);
            this.$store.commit('setEventsListPageSize', this.pageSize);

            router.push('/user/' + this.$route.params.id + '/1');
            await this.$store.dispatch('loadUserEvents', { id: this.$route.params.id, page: 1 });
        },

        redirectToCreateEventPage() {
            router.push(`/user/${this.$route.params.id}/create-event`);
        },

        async rerenderList(page) {
            await this.$store.dispatch('loadUserEvents', { id: this.$route.params.id, page });
            this.rerender++;
        }
    }
}
</script>

<style scoped>
.user-info {
    display: flex;
    justify-content: flex-start;
    text-align: start;
}

.link-wrapper {
    display: flex;
    justify-content: flex-start;
}

.link {
    text-decoration: none;
}

.select-box {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.loader {
    display: flex;
    justify-content: space-around;
}
</style>