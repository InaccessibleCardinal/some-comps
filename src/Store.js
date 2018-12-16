export default class Store {
    constructor(initialState, reducer) {
        this.state = initialState;
        this.reducer = reducer;
        this.listeners = [];
        this.isDispatching = false;
    }

    getState() {
        return this.state;
    }

    subscribe(fn) {
        console.log(fn + ' subscribing.')
        this.listeners.push(fn);
    }

    dispatch(action) {
        if (this.isDispatching) {
            throw new Error('Reducers can\'t dispatch actions');
        }
        if (!action.type) {
            throw new Error('Actions must have a type');
        }
        let currentState = this.getState();
        this.isDispatching = true;
        this.state = this.reducer(currentState, action);
        this.listeners.forEach((fn) => fn());
        this.isDispatching = false;
    }
}

