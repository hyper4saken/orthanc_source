<script>

import { mapState } from "vuex"
import api from "../orthancApi"


export default {
    props: [],
    emits: [],
    data() {
        return {
            verboseLevel: "default"
        };
    },
    async mounted() {
        this.verboseLevel = await api.getVerboseLevel();
    },
    methods: {
        async setVerboseLevel(level) {
            this.verboseLevel = level;
            await api.setVerboseLevel(level);
        }
    },
    computed: {
        ...mapState({
            uiOptions: state => state.configuration.uiOptions,
            statistics: state => state.studies.statistics,
            system: state => state.configuration.system,
            installedPlugins: state => state.configuration.installedPlugins,
        }),
        totalDiskSize() {
            if (this.statistics.TotalDiskSizeMB > 1024*1024) {
                return (Math.round(this.statistics.TotalDiskSizeMB/(1024*1024)*100) / 100) + " TB"; 
            }
            else if (this.statistics.TotalDiskSizeMB > 1024) {
                return (Math.round(this.statistics.TotalDiskSizeMB/1024*100) / 100) + " GB"; 
            }
            return this.statistics.TotalDiskSizeMB + " MB";
        }
    },
}
</script>
<template>
    <div class="settings">
        <div>
            <h5>Statistics</h5>
            <table class="table">
                <tbody>
                    <tr>
                        <th scope="row" class="w-50 header"># Studies</th>
                        <td class="value">{{ statistics.CountStudies }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="header"># Series</th>
                        <td class="value">{{ statistics.CountSeries }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="header"># Instances</th>
                        <td class="value">{{ statistics.CountInstances }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="header">Storage size</th>
                        <td class="value">{{ totalDiskSize }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <h5>Orthanc System info</h5>
            <table class="table">
                <tbody>
                    <tr>
                        <th scope="row" class="w-50 header">Orthanc version</th>
                        <td class="value">{{ system.Version }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="header">DICOM AET</th>
                        <td class="value">{{ system.DicomAet }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="header">Orthanc Name</th>
                        <td class="value">{{ system.Name }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="header">Dicom Port</th>
                        <td class="value">{{ system.DicomPort }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="header">Ingest Transcoding</th>
                        <td class="value">{{ system.IngestTranscoding }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="header">Overwrite Instances</th>
                        <td class="value">{{ system.OverwriteInstances }}</td>
                    </tr>
                    <tr>
                        <th scope="row" class="header">Storage Compression</th>
                        <td class="value">{{ system.StorageCompression }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <h5>Verbosity level</h5>
            <div>
            <button type="button" class="btn mx-2" @click="setVerboseLevel('default')" :class="{'btn-primary': verboseLevel=='default', 'btn-secondary': verboseLevel != 'default'}">Default</button>
            <button type="button" class="btn mx-2" @click="setVerboseLevel('verbose')" :class="{'btn-primary': verboseLevel=='verbose', 'btn-secondary': verboseLevel != 'verbose'}">Verbose</button>
            <button type="button" class="btn mx-2" @click="setVerboseLevel('trace')" :class="{'btn-primary': verboseLevel=='trace', 'btn-secondary': verboseLevel != 'trace'}">Trace</button>
            </div>
        </div>
        <div>
            <h5>Installed plugins</h5>
            <p class="m-2">Plugins that are loaded but not enabled or not configured correctly are <span style="text-decoration: line-through;">striked-through</span></p>
            <table class="table">
                <tbody>
                    <tr v-for="(configuration, plugin) in installedPlugins" :key="plugin"
                    :class="{'disabled-plugin': !configuration.Enabled}">
                        <th scope="row" class="w-25 header">{{ plugin }}</th>
                        <td class="w-50 value">{{ configuration.Description }}</td>
                        <td class="w-15 value">{{ configuration.Version }}</td>
                        <td class="w-10 value">
                            <a v-if="configuration.RootUri && configuration.Enabled" type="button" class="btn btn-primary" v-bind:href="configuration.RootUri">Open</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style scoped>

h5 {
    margin-top: 50px;
    margin-bottom: 15px;
    margin-left: 50px;
}

.settings {
    text-align: left;
}
.w-15 {
    width: 15%;
}
.w-10 {
    width: 15%;
}

.disabled-plugin {
    text-decoration: line-through;
}
.header {
    padding-left: 15px;
}

.value {
    text-align: right;
    padding-right: 15px;
}
</style>