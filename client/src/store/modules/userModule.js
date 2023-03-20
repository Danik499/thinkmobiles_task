export default {
    state: {
        user: {},
        userId: '',
        users: [],
        sortingOption: '',
        pageSize: 10,
        isLastPage: false,
        error: '',
        isLoaded: false
    },
    getters: {
        user: store => store.user,
        userId: store => store.userId,
        users: store => store.users,
        isLastPage: store => store.isLastPage,
        error: store => store.error,
        idLoaded: store => store.isLoaded
    },
    mutations: {
        setUser: (state, user) => state.user = user,
        setUserId: (state, userId) => state.userId = userId,
        setUsers: (state, users) => state.users = users,
        setSortingOption: (state, sortingOption) => state.sortingOption = sortingOption,
        setUsersListPageSize: (state, pageSize) => state.pageSize = pageSize,
        setIsLastPage: (state, isLastPage) => state.isLastPage = isLastPage,
        setError: (state, error) => state.error = error,
        setIsLoaded: (state, isLoaded) => state.isLoaded = isLoaded
    },
    actions: {
        async loadUsers({ commit, dispatch }, page) {
            try {
                commit('setIsLoaded', false);

                const response = await fetch(this.state.serverURL + `/users?sort=${this.state.userModule.sortingOption}&page=${page}&limit=${this.state.userModule.pageSize}`);
                const users = await response.json();

                commit('setUsers', users.data.users);

                // getting the next page to check if the current page is the last one
                const nextPage = await fetch(this.state.serverURL + `/users?sort=${this.state.userModule.sortingOption}&page=${+page+1}&limit=${this.state.userModule.pageSize}`);
                const nextUsers = await nextPage.json();

                commit('setIsLastPage', !(nextUsers.data.users[0]));
            } catch (error) {
                dispatch('buildError', 'Something went wrong');
            } finally {
                commit('setIsLoaded', true);
            }
        },

        async getUserById({ commit }, id) {
            try {
                commit('setIsLoaded', false);

                const response = await fetch(this.state.serverURL + '/users/' + id);
                const user = await response.json();

                commit('setUser', user.data.user)
            } catch (error) {
                dispatch('buildError', 'Something went wrong');
            } finally {
                commit('setIsLoaded', true);
            }
        },

        async createUser({ commit, dispatch }, userData) {
            try {
                if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.phoneNumber) {
                    dispatch('buildError', 'All fields must be filled');
                    return;
                }

                if (userData.password.length < 6) {
                    dispatch('buildError', 'A password must have less or equal then 6 characters');
                    return;
                }

                let response = await fetch(this.state.serverURL + '/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                response = await response.json();
                if (response.status === 'fail') {
                    dispatch('buildError', response.message);
                    return;
                }

                localStorage.setItem('userId', response.data.user._id);
                localStorage.setItem('userName', response.data.user.firstName);
                commit('setUserId', response.data.user._id);
                dispatch('buildError', null);
        
            } catch (error) {
                dispatch('buildError', 'Something went wrong');
            }
        },

        async login({ commit, dispatch }, { email, password }) {
            try {
                if (!email || !password) {
                    dispatch('buildError', 'All fields must be filled');
                    return;
                }

                const response = await fetch(this.state.serverURL + '/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                if (result.status === 'fail') {
                    dispatch('buildError', result.message);
                    return;
                }

                localStorage.setItem('userId', result.data.user._id);
                localStorage.setItem('userName', result.data.user.firstName);
                commit('setUserId', result.data.user._id);
                dispatch('buildError', null);
            } catch (error) {
                dispatch('buildError', 'Something went wrong');
            }
        },

        logout({ commit }) {
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            commit('setUserId', null);
        },

        buildError({ commit }, message) {
            switch (message) {
                case 'Duplicate field \'email\'. Please use another value':
                    commit('setError', 'This email is already in use')
                    break
                case 'Invalid phone number':
                    commit('setError', 'Invalid phone number format')
                    break
                case 'All fields must be filled':
                    commit('setError', 'All fields must be filled')
                    break
                case 'Check your email or password':
                    commit('setError', 'Check your email or password')
                    break
                case 'A password must have less or equal then 6 characters':
                    commit('setError', 'A password must have less or equal then 6 characters')
                    break
                case 'Something went wrong':
                    commit('setError', 'Something went wrong')
                    break
                case null:
                    commit('setError', null)
                    break
                default:
                    break
            }
        }
    }
}