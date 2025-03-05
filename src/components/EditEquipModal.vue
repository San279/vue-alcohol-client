<script setup>
</script>

<template>
    <div v-if="showEditModal" id='new_equip_modal' class='new-equip-modal' @click.stop>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="close-btn" @click="closeEditModal()">
            <path fill="#eb0000"
                d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
        </svg>
        <h2> Select Company</h2>
        <select class="new-data-input" v-model="equipCom.uuid">
            <option :value="equipCom.uuid" disabled selected>{{ equipCom.name }}</option>
            <option v-for="com in companies" :value="com['companyuuid']" :key="com['companyuuid']">{{
                com.companyname }}</option>
        </select>
        <h2> Select Department</h2>
        <select class="new-data-input" v-model="equipDep.uuid">
            <option :value="equipDep.uuid" disabled selected>{{ equipDep.name }}</option>
            <option v-for="dep in departments" :value="dep['departmentuuid']" :key="dep['departmentuuid']">{{
                dep.departmentname }}</option>
        </select>
        <h2> Equipment Model</h2>
        <input class="new-data-input" v-model="editData.equipmentModel" type="text">
        <button class="edit-ele-btn" @click="editSelected()">Apply Change</button>
    </div>
</template>

<script>
import api from '@/assets/api';
import { ref, watch } from 'vue'
const apiReq = new api();
export default {
    props: {
        uuid: String,
        showEditModal: Boolean
    },
    data() {
        return {
            editData: ref({
                companyUUID: '',
                departmentUUID: '',
                equipmentUUID: '',
                equipmentModel: ''
            }),
            equipCom: ref({
                name: '',
                uuid: ''
            }),
            equipDep: ref({
                name: '',
                uuid: ''
            }),
            companies: ref([]),
            departments: ref([])
        }
    },
    watch: {
        'equipCom.uuid'(newValue) {
            console.log('Company UUID changed:', newValue);
            this.getDepComData(newValue)
        },
    },
    methods: {
        closeEditModal() {
            this.$emit('close');
        },
        getDepComData(depComUUID) {
            const body = {
                companyUUID: [depComUUID]
            }
            apiReq.post("dep/getByCompanyId", body).then(data => {
                this.departments = data;
            }).catch(err => {
                console.log(err);
                alert("no department data found");
            })
        },
        getCompanyData() {
            apiReq.get("company/getAll").then(data => {
                this.companies = data;
            }).catch(err => {
                console.log(err);
                alert("no company data found");
            })
        },
        getEditData(uuid) {
            const body = {
                equipmentUUID: [uuid]
            }
            apiReq.post("equip/getById", body).then(data => {
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        this.equipCom.name = data[i].companyname;
                        this.equipCom.uuid = data[i].companyuuid;

                        this.equipDep.name = data[i].departmentname;
                        this.equipDep.uuid = data[i].departmentuuid;

                        this.editData.companyUUID = data[i].companyuuid;
                        this.editData.departmentUUID = data[i].departmentuuid;
                        this.editData.equipmentUUID = data[i].equipmentuuid;
                        this.editData.equipmentModel = data[i].equipmentmodel;
                    }
                    this.getDepComData(this.equipCom.uuid);
                }
            }).catch(err => {
                console.log(err);
                alert("no selected equipment data found");
            })
        },
        editSelected() {
            this.editData.companyUUID = this.equipCom.uuid;
            this.editData.departmentUUID = this.equipDep.uuid;
            const body = {
                equipment: this.editData
            }
            apiReq.put("equip/edit", body).then(data => {
                console.log(data);
                alert("deparment edit successfully");
                location.reload();
            }).catch(err => {
                console.log(err);
                alert('failed to edit deparment');
            })

        },
    },
    mounted() {
        this.getCompanyData();
        this.getEditData(this.uuid);
    }
};

</script>

<style scoped>
.new-equip-modal {
    /* Initially hidden */
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    /*
    top: 40%;
    left: 50%;
    */
    width: 24vw;
    min-height: 10vw;
    padding: 2vw;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    z-index: 1000;
    background-color: #c3cac7;
}

.close-btn {
    width: 2vw;
    position: absolute;
    top: -2%;
    left: 90.6%;
    z-index: 1000;
    cursor: pointer;
}
</style>