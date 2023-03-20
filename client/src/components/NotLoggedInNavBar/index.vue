<template>
  <div class="navbar">
    <div>App</div>
    <div>
        <router-link to="/login" class="navbar-link">Log in</router-link>
        &nbsp;|&nbsp;
        <router-link to="/create-user" class="navbar-link">Sign up</router-link>
    </div>
  </div>
</template>

<script>
export default {

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