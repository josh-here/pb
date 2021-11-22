/**
 * Paddle Subscription button renderless component.
 *
 * @author ReeceM
 * @copyright MIT
 * @filename Subscriptions.js
 */

// import axios from 'axios'; // optional..

export default {
    data() {
        return {
            payLinks: [],
            loaded: false,
            error: false,
            message: 'Loading Subscriptions ...',
        }
    },

    props: {
        /**
         * The api endpoint to fetch the billing info
         */
        endpoint: {
            type: String,
            default: '/api/settings/billing'
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.fetch();

            this.$el.querySelectorAll('a')
                .forEach(element => {
                    if (element.href === '#!') {
                        element.classList.add('paddle_button');
                    }
                });
        });
    },

    updated() {
        this.loadPaddle()
    },

    methods: {
        /**
         * Fetch the Paddle Paylinks from the server.
         */
        fetch() {

            this.error = false;
            this.loaded = false;

            axios.get(this.endpoint)
                .then(({
                    data: { data }
                }) => {
                    this.payLinks = data;
                    this.loaded = true;
                })
                .catch(error => {
                    this.message = 'Failed to load current subscriptions';
                    this.loaded = false;
                    this.error = true;

                    throw error;
                });
        },

        /**
         * reload the Paddle buttons
         */
        loadPaddle() {
            Paddle ? Paddle.Button.load() : console.warn('Up a creek!');
        }
    },

    render() {
        return this.$scopedSlots.default({
            payLinks: this.payLinks,
            loaded: this.loaded,
            error: this.error,
            message: this.message,
            fetch: this.fetch
        });
    }
}
