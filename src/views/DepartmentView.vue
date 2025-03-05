<script setup>
</script>

<template>
    <div v-if="showModal" class="modal-wrapper" @click="closeDepartmentModal()">
        <div id='new_dep_modal' class='new-dep-modal' @click.stop>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="close-btn"
                @click="closeDepartmentModal()">
                <path fill="#eb0000"
                    d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg>
            <h2>Select Company</h2>
            <select class="new-data-input" v-model="companySelect">
                <option value="" disabled selected>- -</option>
                <option v-for="com in companies" :value="com['companyuuid']" :key="com['companyuuid']">{{
                    com.companyname }}</option>
            </select>
            <h2>Enter Department Name</h2>
            <input class="new-data-input" v-model="newDepartment" type="text" placeholder='New Department'>
            <button class="create-btn" @click="addNewDepartment()">Create</button>
        </div>
    </div>
    
    <div v-if="showEditModal" class="modal-wrapper" @click="closeEditModal()">
        <EditDepModal :uuid = "uuidProps" :showEditModal ="showEditModal" @close = "closeEditModal()"/>
    </div>
    
    <div class="department-view">
        <h1>Department</h1>
        <div class="search-con" style="width: 20vw;">
            <multiselect class="search-input" id="departmentTag" v-model="searchDepartment"
                tag-placeholder="Add this as new tag" placeholder="Filter Departments" label="departmentName"
                track-by="departmentuuid" :options="departmentIndex" :multiple="true" :taggable="true"
                @tag="addDepartment">
            </multiselect>
        </div>
        <div class=log-table>
            <div class="btn-container">
                <button class="new-department-btn" @click="openDepartmentModal">+ New Department</button>
                <button v-if="selectDepartment.length > 0" class="delete-department-btn"
                    @click="deleteDepartment">Delete</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Company</th>
                        <th>Added On</th>
                        <th>Action</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="table_log">
                    <tr v-for="item in tableData" :key="item.departmentuuid">
                        <td class="table-ele">{{ item.departmentname }}</td>
                        <td class="table-ele">{{ item.companyname }}</td>
                        <td class="table-ele">{{ item.date }}</td>
                        <td class="table-action">
                            <svg xmlns="http://www.w3.org/2000/svg" class="edit-row-btn"
                                @click="openEditModal(item.departmentuuid)" viewBox="0 0 512 512">
                                <path
                                    d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                            </svg>
                        </td>
                        <td class ="table-ele"> <input type="checkbox" :value=item.departmentuuid v-model="selectDepartment"></td>
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
import EditDepModal from '@/components/EditDepModal.vue';
const apiReq = new api();
export default {
    components: { Multiselect, EditDepModal },
    data() {
        return {
            newDepartment: ref([]),
            showModal: false,
            showEditModal: false,
            uuidProps: '',
            companySelect: ref(""),
            companies: ref([]),
            selectDepartment: ref([]),
            searchDepartment: ref([]),
            departmentIndex: ref([
                {
                    "departmentUUID": "43210",
                    "departmentName": "yamaha"
                },
                {
                    "departmentUUID": "43211",
                    "departmentName": "honda"
                }
            ]),
            tableData: ([]),
        }
    },
    methods: {
        openEditModal(uuid) {
            this.showEditModal = true;
            this.uuidProps = uuid;
        },
        closeEditModal() {
            this.showEditModal = false
            this.uuidProps = null
        },
        openDepartmentModal() {
            this.showModal = true;
        },
        closeDepartmentModal() {
            this.showModal = false;
        },
        addDepartment(newTag) {
            this.departmentIndex.push(newTag)
            this.searchDepartment.push(newTag);
        },
        getCompanyData() {
            apiReq.get("company/getAll").then(data => {
                this.companies = data;
                /*
                for (let i = 0; i < this.tableData.length; i++) {
                    let splitDateTime = this.tableData[i].checkdate.split(" ");
                    this.tableData[i].date = splitDateTime[0];
                    this.tableData[i].time = splitDateTime[1];
                }
                    */
                console.log(this.companies)
            }).catch(err => {
                console.log(err);
                alert("no Dcompany data found");
            })
        },
        getDepartmentData() {
            apiReq.get("dep/getAll").then(data => {
                for (let i = 0; i < data.length; i++){
                    let splitDateTime = data[i].createon.split("T");
                    console.log(data[i])
                    const resObj = data[i];
                    resObj.date = splitDateTime[0]
                    this.tableData.push(resObj)
                }
                //console.log(this.tableData)
            }).catch(err => {
                console.log(err);
                alert("no data found");
            })
        },
        addNewDepartment() {
            const body = {
                companyUUID: [this.companySelect],
                departmentName: [this.newDepartment]
            }
            console.log(body);
            apiReq.post("dep/create", body).then(data => {
                console.log(data);
                alert("department created succesfully");
                this.closeDepartmentModal();
                location.reload();
            }).catch(err => {
                console.log(err)
                alert("failed to create department");
            })
        },
        deleteDepartment() {
            const body = {
                departmentUUID: this.selectDepartment
            }
            console.log(body);
            apiReq.delete("dep/delete", body).then(data => {
                console.log(data);
                alert("department deleted successfully");
                location.reload();
            }).catch(err => {
                console.log(err);
                alert('failed to delete department');
            })
        }
    },
    watch: {
        searchDepartment: {
            handler(newValue, oldValue) {
                console.log("searchDepartment changed:", newValue, oldValue);
                //this.searchDepSet.clear();
                // newValue.forEach(item => this.searchDepSet.add(item.deptname));

                // console.log('searchDepSet (set):', this.searchDepSet);
            },
            deep: true,
        },
    },
    mounted() {
        this.getDepartmentData();
        this.getCompanyData();
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.department-view {
    width: 100vw;
    height: 100%;
    padding-right: 8vw;
    padding-top: 2vw;
}

.btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.new-department-btn {
    border: none;
    width: 10vw;
    height: 3vw;
    margin: 1vw 1vw 1vw 1vw;
    cursor: pointer;
    color: white;
    background-color: #42b883;
    font-size: 1vw;
    border-radius: 10px;
}

.delete-department-btn {
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

.new-dep-modal {
    /* Initially hidden */
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    /*
    top: 40%;
    left: 50%;
    */
    width: 22vw;
    min-height: 10vw;
    padding: 2.2vw;
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
    top: -2%;
    left: 92%;
    z-index: 1000;
    cursor: pointer;
}
</style>