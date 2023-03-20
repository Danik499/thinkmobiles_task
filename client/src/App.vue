<template>
  <div>
    <div class="mb-3">
      <not-logged-in-nav-bar v-if="!isAuthenticated"/>
      <logged-in-nav-bar v-else /> 
    </div>
    <router-view/>
  </div>
</template>

<script>
import NotLoggedInNavBar from './components/NotLoggedInNavBar';
import LoggedInNavBar from './components/LoggedInNavBar';
import { mapGetters } from 'vuex';

export default {
  components: {
    NotLoggedInNavBar, LoggedInNavBar
  },
  data() {
    return {
      isAuthenticated: false
    }
  },
  computed: mapGetters(['userId']),
  watch: {
      userId() {
        this.isAuthenticated = !!localStorage.getItem('userId');
      }
  },
  mounted() {
    this.isAuthenticated = !!localStorage.getItem('userId');
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 80%;
  margin: 0 auto;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
