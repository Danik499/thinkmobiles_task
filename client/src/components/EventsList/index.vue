<template>
    <div>
        <div class="table-responsive">
            <table class="table table=bordered border-dark">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="event in events" :key="event._id">
                        <td>{{ event.title }}</td>
                        <td>{{ event.description }}</td>
                        <td>{{ event.startDate?.split("T")[0] }}</td>
                        <td>{{ event.endDate?.split("T")[0]  }}</td>
                        <td>
                            <i v-on:click="deleteEvent(event._id, event.title)" class="bi bi-trash trash-icon"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import router  from '@/router';

export default {
    props: {
        events: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        async deleteEvent(id, title) {
            const eventsDisplayed = this.events.length;
            const toDelete = confirm(`Are you sure you want to delete event '${title}'`);

            if (toDelete) {
                const result = await this.$store.dispatch('deleteEvent', {
                    eventId: id,
                    userId: this.$route.params.id
                });
                if (result) {
                    const currentPage = +this.$route.params.page;
                    const newPage = eventsDisplayed === 1 && currentPage != 1 ? currentPage - 1 : currentPage;
                    this.$emit('rerender', newPage);
                    router.push(`/user/${this.$route.params.id}/${newPage}`);
                }
            }
        }
    }
}
</script>

<style>
.trash-icon:hover {
    color: red;
    cursor: pointer;
}
</style>