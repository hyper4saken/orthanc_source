import api from "../../orthancApi"

///////////////////////////// STATE
const state = () => ({
    installedPlugins: {},
    orthancPeers: [],
    targetDicomWebServers: [],
    queryableDicomWebServers: [],
    queryableDicomModalities: [],
    targetDicomModalities: [],
    maxStudiesDisplayed: 100,
    orthancApiUrl: "../../",
    uiOptions: {},
    loaded: false,
    system: {}
})

///////////////////////////// GETTERS
const getters = {
}

///////////////////////////// MUTATIONS

const mutations = {
    setUiOptions(state, { uiOptions }) {
        state.uiOptions = uiOptions;
    },
    setInstalledPlugin(state, { plugin, pluginConfiguration }) {
        state.installedPlugins[plugin] = pluginConfiguration;
    },
    setDicomWebServers(state, { dicomWebServers }) {  // TODO: split in two
        state.targetDicomWebServers = dicomWebServers;
        state.queryableDicomWebServers = dicomWebServers;
    },
    setOrthancPeers(state, { orthancPeers }) {
        state.orthancPeers = orthancPeers;
    },
    setDicomModalities(state, { dicomModalities }) {  // TODO: split in two
        state.queryableDicomModalities = dicomModalities;
        state.targetDicomModalities = dicomModalities;
    },
    setSystem(state, { system }) {
        state.system = system;
    },
    setLoaded(state) {
        state.loaded = true;
    }

}

///////////////////////////// ACTIONS

const actions = {
    async load({ commit, state}) {
        await this.dispatch('configuration/loadOe2Configuration');

        const orthancPeers = await api.loadOrthancPeers();
        commit('setOrthancPeers', { orthancPeers: orthancPeers});

        const dicomModalities = await api.loadDicomModalities();
        commit('setDicomModalities', { dicomModalities: dicomModalities});

        const system = await api.loadSystem();
        commit('setSystem', { system: system});

        commit('setLoaded');
    },
    async loadOe2Configuration({ commit }) {
        const oe2Config = await api.loadOe2Configuration();
        commit('setUiOptions', { uiOptions: oe2Config['UiOptions']});

        for (const [pluginName, pluginConfiguration] of Object.entries(oe2Config['Plugins'])) {

            commit('setInstalledPlugin', { plugin: pluginName, pluginConfiguration: pluginConfiguration})

            if (pluginName === "dicom-web") {
                const dicomWebServers = await api.loadDicomWebServers();
                commit('setDicomWebServers', { dicomWebServers: dicomWebServers});
            }
        }

    },
}



///////////////////////////// EXPORT

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}