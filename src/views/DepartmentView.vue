<script setup>
const user = JSON.parse(localStorage.getItem("cur_user"));
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
            <input class="new-data-input" v-model = "newDepartment"/>
            <h2>Set Alcohol Range Threshold</h2>
            <div class="range-slider-c">
                <div class="min-max-range-c">
                    <label class = "range-label" for="min-range">Min:</label> {{ lowRange }} mg/100ml
                    <input class="range-slider slider1-color" v-model = "lowRange" type="range" id="min-range" min="0" max="50">
                </div>
                <div class="min-max-range-c">
                    <label class = "range-label" for="max-range">Medium</label> {{ mediumRange }} mg/100ml
                    <input class="range-slider slider2-color" v-model = "mediumRange" id="medium-range" type="range" min="51" max="150">
                </div>
                <div class="min-max-range-c">
                    <label class = "range-label" for="max-range">Max:</label> {{ highRange }} mg/100ml
                    <input class="range-slider slider3-color" v-model = "highRange" id="max-range" type="range" min="151" max="300">
                </div>
            </div>
            <button class="create-btn" @click="addNewDepartment()">Create</button>
        </div>
    </div>

    <div v-if="showEditModal" class="modal-wrapper" @click="closeEditModal()">
        <EditDepModal :uuid="uuidProps" :showEditModal="showEditModal" @close="closeEditModal()" />
    </div>

    <div class="page-content">
        <h1>Department</h1>
        <div class="search-con" style="width: 30vw;">
            <multiselect class="search-input" id="departmentTag" v-model="searchDepartment"
                tag-placeholder="Add this as new tag" placeholder="Filter Departments" label="departmentname"
                track-by="departmentuuid" :options="departmentIndex" :multiple="true" :taggable="true"
                @tag="addDepartment">
            </multiselect>
            <multiselect class="search-input" id="companyTag" v-model="searchCompany"
                tag-placeholder="Add this as new tag" placeholder="Filter Companies" label="companyname"
                track-by="companyuuid" :options="companyIndex" :multiple="true" :taggable="true" @tag="addCompany">
            </multiselect>
        </div>
        <div class=log-table>
            <div class="btn-container" v-if="user.priv != null">
                <button class="new-data-btn" @click="openDepartmentModal">+ New Department</button>
                <button v-if="selectDepartment.length > 0" class="delete-department-btn"
                    @click="deleteDepartment">Delete</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Company</th>
                        <th>Added On</th>
                        <th v-if="user.priv != null">Action</th>
                        <th v-if="user.priv != null"></th>
                    </tr>
                </thead>
                <tbody id="table_log">
                    <tr v-for="item in filteredData" :key="item.departmentuuid">
                        <td class="table-ele">{{ item.departmentname }}</td>
                        <td class="table-ele">{{ item.companyname }}</td>
                        <td class="table-ele">{{ item.date }}</td>
                        <td class="table-action" v-if="user.priv != null">
                            <svg xmlns="http://www.w3.org/2000/svg" class="edit-row-btn"
                                @click="openEditModal(item.departmentuuid)" viewBox="0 0 512 512">
                                <path
                                    d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                            </svg>
                        </td>
                        <td class="table-ele" v-if="user.priv != null"> <input type="checkbox"
                                :value=item.departmentuuid v-model="selectDepartment"></td>
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
            newDepartment: ref(""),
            lowRange: ref(0),
            mediumRange: ref(51),
            highRange: ref(151),
            showModal: false,
            showEditModal: false,
            uuidProps: '',
            companySelect: ref(""),
            companies: ref([]),
            selectDepartment: ref([]),
            searchDepartment: ref([]),
            departmentIndex: ref([]),
            searchCompany: ref([]),
            companyIndex: ref([]),
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
        addCompany(newTag) {
            this.companyIndex.push(newTag)
            this.searchCompany.push(newTag);
        },
        getCompanyData() {
            apiReq.get("company/getAll").then(data => {
                this.companies = data;
                this.companyIndex = data;
                /*
                for (let i = 0; i < this.tableData.length; i++) {
                    let splitDateTime = this.tableData[i].checkdate.split(" ");
                    this.tableData[i].date = splitDateTime[0];
                    this.tableData[i].time = splitDateTime[1];
                }
                    */
            }).catch(err => {
                console.log(err);
                alert("no Dcompany data found");
            })
        },
        getDepartmentData() {
            apiReq.get("dep/getAll").then(data => {
                for (let i = 0; i < data.length; i++) {
                    let splitDateTime = data[i].createon.split("T");
                    console.log(data[i]);
                    const resObj = data[i];
                    resObj.date = splitDateTime[0];
                    this.tableData.push(resObj);
                    this.departmentIndex.push(resObj);
                }
                //console.log(this.tableData)
            }).catch(err => {
                console.log(err);
                alert("no data found");
            })
        },
        addNewDepartment() {
            const body = {
                companyUUID:this.companySelect,
                departmentName: this.newDepartment,
                lowAlcLvl: this.lowRange,
                medAlcLvl: this.mediumRange,
                highAlcLvl: this.highRange
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
    computed: {
        filteredData() {
            let filteredDepartments = this.tableData;

            if (this.searchDepartment && this.searchDepartment.length > 0) {
                filteredDepartments = filteredDepartments.filter((department) => {
                    return this.searchDepartment.some(
                        (selectedDepartment) => selectedDepartment.departmentuuid === department.departmentuuid
                    );
                });
            }

            if (this.searchCompany && this.searchCompany.length > 0) {
                filteredDepartments = filteredDepartments.filter((department) => {
                    return this.searchCompany.some(
                        (selectedCompany) => selectedCompany.companyuuid === department.companyuuid
                    );
                });
            }
            return filteredDepartments;
        },
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
.btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    width: 25vw;
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

.range-slider-c {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5vw;
}

.range-label{
    font-size: 1vw;
}
.range-slider::-webkit-slider-runnable-track {
  background: #ddd; /* Default track color */
  height: 8px;
  border-radius: 4px;
}

.min-max-range-c{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.5vw;
}

.close-btn {
    width: 2vw;
    position: absolute;
    top: -1.5%;
    left: 92.5%;
    z-index: 1000;
    cursor: pointer;
}

.range-slider::-webkit-slider-runnable-track {
  background: #ddd; /* Default track color */
  height: 8px;
  border-radius: 3px;
}

.range-slider::-moz-range-track {
  background: #ddd;
  height: 8px;
  border-radius: 4px;
}

.range-slider::-ms-track {
  background: transparent;
  border-color: transparent;
  color: transparent;
  height: 8px;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #007bff; /* Default thumb color */
  margin-top: -6px;
}

.range-slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border: none;
  border-radius: 50%;
  background: #007bff;
}

.range-slider::-ms-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #007bff;
}

/* Specific colors for each slider */
.slider1-color::-webkit-slider-runnable-track {
  background: rgb(244, 241, 100);
}

.slider2-color::-webkit-slider-runnable-track {
  background: rgb(211, 158, 59);
}

.slider3-color::-webkit-slider-runnable-track {
  background: rgb(229, 13, 13);
}

/* Add similar rules for -moz- and -ms- prefixes */
.slider1-color::-moz-range-track {
  background: rgb(179, 210, 54);
}

.slider2-color::-moz-range-track {
  background: rgb(211, 158, 59);
}

.slider3-color::-moz-range-track {
  background: rgb(229, 13, 13);
}

.slider1-color::-ms-track {
  background: rgb(179, 210, 54);
}

.slider2-color::-ms-track {
  background: rgb(211, 158, 59);
}

.slider3-color::-ms-track {
  background: rgb(229, 13, 13);
}

</style>