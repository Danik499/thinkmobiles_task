<template>
  <div>
    <div class="select-box" v-if="users[0]">
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
            <option>First name</option>
            <option>Last name</option>
            <option>Email</option>
            <option>Phone number</option>
            <option>Events count</option>
            <option>Next event start date</option>
        </select>
        &nbsp;Order&nbsp;
        <select v-model="sortingOrder" v-on:change="sort">
          <option>From lowest to highest</option>
          <option>From highest to lowest</option>
        </select>
      </div>
    </div>
    <div v-if="users[0]">
      <users-list :users="users" :key="rerender"/>
      <paginator v-on:rerender="rerenderList" :isLast="isLastPage" :pageName="'main'"/>
    </div>
    <div v-else-if="isLoaded">
      No users created
    </div>
    <div v-else class="loader">
      <loader />
    </div>
  </div>
</template>

<script>
import UsersList from '../components/UsersList';
import Paginator from '../components/Paginator';
import Loader from '../components/Loader';
import router from '@/router';
import { mapGetters } from 'vuex';

export default {
    components: {
      UsersList, Paginator, Loader
    },
    data() {
      return {
        sortingOption: '',
        sortingOrder: 'From lowest to highest',
        pageSize: 10,
        rerender: 0
      }
    },
    computed: mapGetters(['users', 'isLastPage', 'isLoaded']),
    async mounted() {
      await this.$store.dispatch('loadUsers', this.$route.params.page);
    },
    methods: {
      async sort() {
        const sortingOrder = this.sortingOrder === 'From lowest to highest' ? '' : '-';
        const sortingOptionToCamelCase = this.sortingOption.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

        this.$store.commit('setSortingOption', sortingOrder + sortingOptionToCamelCase);
        this.$store.commit('setUsersListPageSize', this.pageSize);

        router.push('/main/' + 1);
        await this.$store.dispatch('loadUsers', 1);
      },

      async rerenderList(page) {
        await this.$store.dispatch('loadUsers', page);
        this.rerender++;
      },

      redirectToCreatePage() {
        router.push('/create-user');
      }
    }
}
</script>

<style scoped>
.select-box {
    display: flex;
    justify-content: space-between;
}

.loader {
  display: flex;
  justify-content: space-around;
}
</style>