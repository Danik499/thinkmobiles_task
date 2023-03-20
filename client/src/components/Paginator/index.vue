<template>
  <div>
    <button v-if="!isFirst" v-on:click="previousPage" class="btn btn-primary btn-block">&lt;</button>
    <span>&nbsp;</span>
    <button v-if="!isLast" v-on:click="nextPage" class="btn btn-primary btn-block">&gt;</button>
  </div>
</template>

<script>
import router from '@/router';

export default {
    props: {
        isLast: {
            type: Boolean
        },
        pageName: {
            type: String
        }
    },
    computed: {
        isFirst() {
            return this.$route.params.page === "1" || !this.$route.params.page;
        },
        page() {
            return this.$route.params.page || 1;
        }
    },
    methods: {
        previousPage() {
            const newPage = +this.$route.params.page - 1;
            router.push(`/${this.pageName}/` + (+this.page - 1));
            this.$emit('rerender', newPage);
        },
        nextPage() {
            const newPage = +this.$route.params.page + 1;
            router.push(`/${this.pageName}/` + (+this.page + 1));
            this.$emit('rerender', newPage);
        }
    }
}
</script>

<style>

</style>