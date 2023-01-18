// module_rest.js

import axios from 'axios'

////////////////////////////////////////////////////////////////////////////////

function Task(context) {
    this.context = context;
}

Task.prototype = {

    makeURL(p) {
        let url = p.url;
        let path = p.path;
        let type = p.type;
        let id = p.id;
        let api = p.api;

        if (url != null) {
            return url;
        }

        if (path != null) {
            return path;
        }

        // use:api/type/id

        if (api == null) {
            api = this.context.getters["defaultApiPath"]
        }

        if (type == null) {
            type = "/notype"
        } else {
            type = "/" + type
        }

        if (id == null) {
            id = ""
        } else {
            id = "/" + id
        }

        return api + type + id
    },

    open(p) {
        if (p == null) {
            p = {}
        }
        let config = {}
        this.prepareAll(config, p)
        this.context.commit("taskCountAddWith", 1)
        return config
    },

    prepareAll(config, p) {
        this.prepareMethod(config, p)
        this.prepareURL(config, p)
        this.prepareHeaders(config, p)
        this.prepareParams(config, p)
        this.prepareData(config, p)
    },

    prepareMethod(config, p) {
        let method = p.method;
        if (method == null) { method = "GET" }
        method = method.trim()
        if (method == "") { method = "GET" }
        config.method = method.toUpperCase()
    },

    prepareURL(config, p) {
        config.url = this.makeURL(p)
    },

    prepareHeaders(config, p) {
        let headers = p.headers;
        if (headers == null) { return }
        config.headers = headers;
    },

    prepareParams(config, p) {
        let params = p.params;
        if (params == null) { return }
        config.params = params;
    },

    prepareData(config, p) {
        let data = p.data;
        if (data == null) { return }
        config.data = data;
    },

    handleOK(/*p*/) { },

    handleError( /*p*/) { },

    handleFinally(/*p*/) {
        this.context.commit("taskCountAddWith", -1)
    },
}

////////////////////////////////////////////////////////////////////////////////

const state = {
    defaultApiPath: "/api/v1",
    working: false,
    taskCount: 0,
}

const getters = {
    defaultApiPath(state) {
        return state.defaultApiPath
    }
}

const mutations = {
    defaultApiPath(state, value) {
        if (value == null || value == "") {
            value = "/api/v1"
        }
        state.defaultApiPath = value
    },

    taskCountAddWith(state, addWithValue) {
        let old = state.taskCount
        let next = old + addWithValue
        state.taskCount = next
        state.working = (next > 0)
    }
}

const actions = {
    execute(context, p) {
        let t = new Task(context)
        let config = t.open(p)
        return axios(config).then((value) => {
            t.handleOK(value)
            return Promise.resolve(value)
        }).catch((reason) => {
            t.handleError(reason)
            return Promise.reject(reason)
        }).finally(() => {
            t.handleFinally()
        })
    }
}

export default {
    name: "module_rest",
    namespaced: true,
    actions, getters, mutations, state,
}
