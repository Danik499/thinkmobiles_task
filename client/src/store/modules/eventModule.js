export default {
    state: {
        events: [],
        sortingOption: '',
        pageSize: 10,
        isLastPage: false,
        validationMessage: '',
        isLoaded: false
    },
    getters: {
        events: store => store.events,
        isLastEventPage: store => store.isLastPage,
        eventValidationMessage: store => store.validationMessage,
        isLoaded: store => store.isLoaded
    },
    mutations: {
        setEvents: (state, events) => state.events = events,
        setSortingOption: (state, sortingOption) => state.sortingOption = sortingOption,
        setEventsListPageSize: (state, pageSize) => state.pageSize = pageSize,
        setIsLastPage: (state, isLastPage) => state.isLastPage = isLastPage,
        setEventValidationMessage: (state, validationMessage) => state.validationMessage = validationMessage,
        setIsLoaded: (state, isLoaded) => state.isLoaded = isLoaded
    },
    actions: {
        async loadUserEvents({ commit }, { id, page }) {
            try {
                commit('setIsLoaded', false);

                const response = await fetch(this.state.serverURL + `/events?user=${id}&sort=${this.state.eventModule.sortingOption}&page=${page}&limit=${this.state.eventModule.pageSize}`);
                const events = await response.json();

                commit('setEvents', events.data.events);

                // getting the next page to check if the current page is the last one
                const nextPage = await fetch(this.state.serverURL + `/events?user=${id}&sort=${this.state.eventModule.sortingOption}&page=${+page+1}&limit=${this.state.eventModule.pageSize}`);
                const nextEvents = await nextPage.json();

                commit('setIsLastPage', !(nextEvents.data.events[0]));
            } catch (error) {
                dispatch('buildValidationMessage', 'Something went wrong');
            } finally {
                commit('setIsLoaded', true);
            }
        },

        async createEvent({ commit, dispatch }, eventData) {
            try {
                commit('setIsLoaded', false);

                if (new Date(eventData.startDate) > new Date(eventData.endDate)) {
                    dispatch('buildValidationMessage', 'Start date should be greater or equal then end date');
                    return;
                }

                let response = await fetch(this.state.serverURL + '/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(eventData)
                });

                response = await response.json();
                if (response.status === 'fail') {
                    dispatch('buildValidationMessage', response.message);
                } else {
                    dispatch('buildValidationMessage', null);
                }
            } catch (error) {
                dispatch('buildValidationMessage', 'Something went wrong');
            } finally {
                commit('setIsLoaded', true);
            }
        },

        async deleteEvent({ dispatch }, { eventId, userId }) {
            try {
                const response = await fetch(this.state.serverURL + `/events/${eventId}`, {
                    method: 'DELETE'
                });

                dispatch('getUserById', userId)

                return response.status == 204;
            } catch (error) {
                dispatch('buildValidationMessage', 'Something went wrong');
            }
        },

        buildValidationMessage({ commit }, message) {
            switch (message) {
                case 'Start date should be greater or equal then end date':
                    commit('setEventValidationMessage', 'Start date should be greater or equal then end date')
                    break
                case 'You can\'t create event for this date':
                    commit('setEventValidationMessage', 'You can\'t create event for this date')
                    break
                case 'All fields must be filled':
                    commit('setEventValidationMessage', 'All fields must be filled')
                    break
                case 'Something went wrong':
                    commit('setEventValidationMessage', 'Something went wrong')
                    break
                case null:
                    commit('setEventValidationMessage', null)
                    break
                default:
                    break
            }   
        }
    }
}