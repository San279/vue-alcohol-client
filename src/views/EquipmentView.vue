<script setup>
    const user = JSON.parse(localStorage.getItem("cur_user"));
</script>

<template>
    <div v-if="showModal" class="modal-wrapper" @click="closeEquipModal()">
        <div id='new_equip_modal' class='new-equip-modal' @click.stop>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="close-btn" @click="closeEquipModal()">
                <path fill="#eb0000"
                    d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg>
            <h2> Select Company</h2>
            <select class="new-data-input" v-model="companySelect">
                <option value="" disabled selected>- -</option>
                <option v-for="com in companies" :value="com['companyuuid']" :key="com['companyuuid']">{{
                    com.companyname }}</option>
            </select>
            <h2> Select Department</h2>
            <select class="new-data-input" v-model="departmentSelect">
                <option value="" disabled selected>- -</option>
                <option v-for="dep in departments" :value="dep['departmentuuid']" :key="dep['departmentuuid']">{{
                    dep.departmentname }}</option>
            </select>
            <h2> Equipment Model</h2>
            <input class="new-data-input" v-model="newEquip" type="text" placeholder='Name must match with Equipment'>
            <button class="create-btn" @click="addNewEquip()">Create</button>
        </div>
    </div>

    <div v-if="showEditModal" class="modal-wrapper" @click="closeEditModal()">
        <EditEquipModal :uuid="uuidProps" :showEditModal="showEditModal" @close="closeEditModal()" />
    </div>

    <div class="page-content">
        <h1>Equipments</h1>
        <div class="search-con" style="width: 40vw;">
            <multiselect class="search-input" id="equipTag" v-model="searchEquip" tag-placeholder="Add this as new tag"
                placeholder="Filter Equips" label="equipmentmodel" track-by="equipmentuuid" :options="equipIndex"
                :multiple="true" :taggable="true">
            </multiselect>
            <multiselect class="search-input" id="departmentTag" v-model="searchDepartment"
                tag-placeholder="Add this as new tag" placeholder="Filter Departments" label="departmentname"
                track-by="departmentuuid" :options="departmentIndex" :multiple="true" :taggable="true">
            </multiselect>
            <multiselect class="search-input" id="companyTag" v-model="searchCompany"
                tag-placeholder="Add this as new tag" placeholder="Filter Companies" label="companyname"
                track-by="companyuuid" :options="companyIndex" :multiple="true" :taggable="true" @tag="addCompany">
            </multiselect>
        </div>
        <div class=log-table>
            <div class="btn-container"v-if = "user.priv != null">
                <button class="new-data-btn" @click="openEquipModal">+ New Equip</button>
                <button v-if="selectEquip.length > 0" class="delete-equip-btn" @click="deleteEquip">Delete</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Equipment Model</th>
                        <th>Company</th>
                        <th>Department</th>
                        <th>Added On</th>
                        <th v-if = "user.priv != null">Actions</th>
                        <th v-if = "user.priv != null"></th>
                    </tr>
                </thead>
                <tbody id="table_log">
                    <tr v-for="item in filteredData" :key="item.equipmentuuid">
                        <td class="table-ele">{{ item.equipmentmodel }}</td>
                        <td class="table-ele">{{ item.companyname }}</td>
                        <td class="table-ele">{{ item.departmentname }}</td>
                        <td class="table-ele">{{ item.date }}</td>
                        <td class="table-action" v-if = "user.priv != null">
                            <svg xmlns="http://www.w3.org/2000/svg" class="edit-row-btn"
                                @click="openEditModal(item.equipmentuuid)" viewBox="0 0 512 512">
                                <path
                                    d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                            </svg>
                        </td>
                        <td class ="table-ele" v-if = "user.priv != null"> <input type="checkbox" :value=item.equipmentuuid v-model="selectEquip"></td>
                    </tr>
                </tbody>
            </table>
            <!--<button @click="generatePDF">Generate PDF</button>-->
            <br />
            <br />
        </div>
    </div>
</template>


<script>
import { ref, watch, reactive } from 'vue'
import Multiselect from 'vue-multiselect'
import html2pdf from 'html2pdf.js';
import api from '@/assets/api';
import $ from 'jquery';
import EditEquipModal from '@/components/EditEquipModal.vue';
const apiReq = new api();
export default {
    components: { Multiselect, EditEquipModal },
    data() {
        return {
            newEquip: ref([]),
            showModal: false,
            showEditModal: false,
            uuidProps: '',
            companySelect: ref([]),
            departmentSelect: ref([]),
            companies: ref([]),
            searchCompany: ref([]),
            companyIndex: ref([]),
            departments: ref([]),
            searchDepartment: ref([]),
            departmentIndex: ref([]),
            selectEquip: ref([]),
            searchEquip: ref([]),
            equipIndex: ref([]),
            tableData: ([]),
        }
    },
    methods: {
        openEquipModal() {
            this.showModal = true;
        },
        closeEquipModal() {
            this.showModal = false;
        },
        openEditModal(uuid) {
            this.showEditModal = true;
            this.uuidProps = uuid;
        },
        closeEditModal() {
            this.showEditModal = false
            this.uuidProps = null
        },
        getDepartmentData() {
            apiReq.get("dep/getAll").then(data => {
                this.departments = data;
                this.departmentIndex = data;
            }).catch(err => {
                console.log(err);
            })
        },
        getCompanyData() {
            apiReq.get("company/getAll").then(data => {
                this.companies = data;
                this.companyIndex = data;
            }).catch(err => {
                console.log(err);
            })
        },
        getEquipData() {
            apiReq.get("equip/getAll").then(data => {
                for (let i = 0; i < data.length; i++) {
                    let splitDateTime = data[i].createon.split("T");
                    //console.log(data[i]);
                    const resObj = data[i];
                    resObj.date = splitDateTime[0];
                    this.tableData.push(resObj);
                    this.equipIndex.push(resObj);
                }
                //console.log(this.tableData)
            }).catch(err => {
                console.log(err);
            })
        },
        addNewEquip() {
            const body = {
                companyUUID: [this.companySelect],
                departmentUUID: [this.departmentSelect],
                equipmentModel: this.newEquip
            }
            console.log(body);
            apiReq.post("equip/create", body).then(data => {
                console.log(data);
                alert("equip created succesfully");
                this.closeEquipModal();
                location.reload();
            }).catch(err => {
                console.log(err)
                alert("failed to create equip");
            })
        },
        deleteEquip() {
            const body = {
                equipmentUUID: this.selectEquip
            }
            console.log(body);
            apiReq.delete("equip/delete", body).then(data => {
                console.log(data);
                alert("equipment deleted successfully");
                location.reload();
            }).catch(err => {
                console.log(err);
                alert('failed to delete equipment');
            })
        }
    },
    computed: {
        filteredData() {
            let filteredEquipments = this.tableData;
            console.log()
            if (this.searchDepartment && this.searchDepartment.length > 0) {
                filteredEquipments = filteredEquipments.filter((equipment) => {
                    return this.searchDepartment.some(
                        (selectedDepartment) => selectedDepartment.departmentuuid === equipment.departmentuuid
                    );
                });
            }

            if (this.searchCompany && this.searchCompany.length > 0) {
                filteredEquipments = filteredEquipments.filter((equipment) => {
                    return this.searchCompany.some(
                        (selectedCompany) => selectedCompany.companyuuid === equipment.companyuuid
                    );
                });
            }

            if (this.searchEquip && this.searchEquip.length > 0) {
                filteredEquipments = filteredEquipments.filter((equipment) => {
                    return this.searchEquip.some(
                        (selectedEquip) => selectedEquip.equipmentuuid === equipment.equipmentuuid
                    );
                });
            }
            console.log(filteredEquipments);
            return filteredEquipments;
        },
    },
    watch: {
        searchEquip: {
            handler(newValue, oldValue) {
                console.log("searchEquip changed:", newValue, oldValue);
                //this.searchDepSet.clear();
                // newValue.forEach(item => this.searchDepSet.add(item.deptname));

                // console.log('searchDepSet (set):', this.searchDepSet);
            },
            deep: true,
        },
    },
    mounted() {
        this.getEquipData();
        this.getCompanyData();
        this.getDepartmentData();
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

.btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.delete-equip-btn {
    border: none;
    width: 10vw;
    height: 3vw;
    margin: 1vw 1vw 1vw 1vw;
    cursor: pointer;
    color: white;
    background-color: #db0c0c;
    font-size: 1vw;
    border-radius: 10px;
}

.new-data-input {
    padding: 2%;
    margin: 0.5vw 0vw 1vw 0vw;
    border-radius: 5px;
    border: 1px solid green;
    font-size: 0.9vw;
    border: none;
}

.new-equip-modal {
    /* Initially hidden */
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /*
    top: 40%;
    left: 50%;
    */
    width: 22vw;
    min-height: 20vw;
    padding: 2vw;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    z-index: 1000;
    background-color: #c3cac7;
}

.create-btn {
    width: 7vw;
    height: 2vw;
    align-self: center;
    /*top: -0.6vw;
    left: 19.7vw;*/
    cursor: pointer;
    background-color: rgb(11, 167, 107);
    border-radius: 5px;
    font-size: 0.9vw;
    color: white;
    border: none;
}

.close-btn {
    width: 2vw;
    position: absolute;
    top: -1.5%;
    left: 91.5%;
    z-index: 1000;
    cursor: pointer;
}
</style>