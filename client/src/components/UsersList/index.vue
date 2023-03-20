<template>
    <div>
        <div class="table-responsive">
            <table class="table table=bordered border-dark">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone number</th>
                        <th>Events count</th>
                        <th>Next event start date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user._id">
                        <td>
                            <span v-on:click="redirectToUserPage(user._id)" class="user-name">{{ user.firstName + " " + user.lastName }}</span>
                        </td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.phoneNumber }}</td>
                        <td>{{ user.eventsCount }}</td>
                        <td>{{ user.nextEventStartDate?.split("T")[0] || "No events in the future" }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import router from '@/router';

export default {
    props: {
        users: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        redirectToUserPage(id) {
            if (localStorage.getItem('userId') && id != localStorage.getItem('userId')) {
                alert('You have to log out first');
                return;
            }

            if (!localStorage.getItem('userId')) {
                router.push('/login');
                return;
            }
            
            router.push('/user/' + id + '/1');
        }
    }
}
</script>

<style>
.user-name {
    cursor: pointer;
}

.user-name:hover {
    text-decoration: underline;
}
</style>