<script>
import ResourceButtonGroup from "./ResourceButtonGroup.vue";
import InstanceList from "./InstanceList.vue";
import ResourceDetailText from "./ResourceDetailText.vue";

export default {
    props: ['seriesId', 'seriesMainDicomTags', 'instancesIds'],
    emits: ['deletedSeries'],
    setup() {
    },
    data() {
        return {
        };
    },
    computed: {
    },
    components: { ResourceButtonGroup, InstanceList, ResourceDetailText },
    methods: {
        onDeletedInstance(instanceId) {
            const pos = this.instancesIds.indexOf(instanceId);
            if (pos >= 0) {
                this.instancesIds.splice(pos, 1);
                if (this.instancesIds.length == 0) {
                    this.$emit("deletedSeries", this.seriesId);
                }
            }
        },
        onDeletedSeries() {
            this.$emit("deletedSeries", this.seriesId);
        }
    }

}
</script>


<template>
    <table class="table table-responsive table-sm series-details-table">
        <tr>
            <td width="70%" class="cut-text">
                <ul>
                    <ResourceDetailText :value="seriesMainDicomTags.SeriesDate">Series Date</ResourceDetailText>
                    <ResourceDetailText :value="seriesMainDicomTags.SeriesTime">Series Time</ResourceDetailText>
                    <ResourceDetailText :value="seriesMainDicomTags.SeriesDescription" :truncate="true">Series Description</ResourceDetailText>
                    <ResourceDetailText :value="seriesMainDicomTags.SeriesNumber">Series Number</ResourceDetailText>
                    <ResourceDetailText :value="seriesMainDicomTags.BodyPartExamined">Body Part Examined</ResourceDetailText>
                    <ResourceDetailText :value="seriesMainDicomTags.ProtocolName">Protocol Name</ResourceDetailText>
                    <ResourceDetailText :value="seriesMainDicomTags.SeriesInstanceUID" :truncate="true">Series Instance UID</ResourceDetailText>
                    <ResourceDetailText :value="seriesMainDicomTags.SeriesDate">Series Date</ResourceDetailText>
                </ul>
            </td>
            <td width="30%" class="series-button-group">
                <ResourceButtonGroup
                :resourceOrthancId="this.seriesId"
                :resourceLevel="'series'"
                :resourceDicomUid="this.seriesMainDicomTags.SeriesInstanceUID"
                :customClass="'instance-button-group'"
                @deletedResource="onDeletedSeries"
                ></ResourceButtonGroup>
            </td>
        </tr>
        <tr>
            <td colspan="100">
                <InstanceList
                    :seriesId="this.seriesId"
                    :seriesMainDicomTags="this.seriesMainDicomTags"
                    :instancesIds="this.instancesIds"
                    @deletedInstance="onDeletedInstance"
                ></InstanceList>
            </td>
        </tr>
    </table>
</template>

<style scoped>
.series-details-table {
    margin-top: var(--details-top-margin);
    margin-left: 5%;
    width: 95% !important;
    background-color: var(--series-selected-color);
    font-size: 0.8rem;
}

.series-details-table td {
    vertical-align: top;
}

</style>
<style>
.series-button-group i {
    font-size: 1.3rem;
}
</style>
