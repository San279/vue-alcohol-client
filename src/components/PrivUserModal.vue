<script setup>
</script>

<template>
    <div v-if="showPrivModal" id='edit_modal' class='new-user-modal' @click.stop>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="close-btn" @click="closePrivModal()">
            <path fill="#eb0000"
                d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
        </svg>
        <h2>Search User</h2>
        <select class="new-data-input" v-model="userData.userUUID" @change="getExistPriv(userData.userUUID)">
            <option value='' disabled selected>Select User</option>
            <option v-for="user in users" :value="user['useruuid']" :key="user['useruuid']">{{
                user.name }}</option>
        </select>
        <h2>Companies</h2>
        <div class="priv-c">
            <div class="priv-exist-table" v-for="(item,index) in existUserCompany">
                <span class="exist-data"> {{ item.companyname }}</span>
                <button class="exist-del-btn" @click="deleteExistComp(item.usercompanyuuid, index)"> - </button>
            </div>
            <div class="priv-add-table" v-for="(item, index) in userCompany">
                <select class="priv-data-input" v-model="userCompany[index]" @change="updateUserDepartment()">
                    <option value="" disabled selected> - - </option>
                    <option v-for="com in companies" :value="com['companyuuid']" :key="com['companyuuid']">{{
                        com.companyname }}</option>
                </select>
                <button class="priv-del-btn" @click="deleteComPriv(index)"> - </button>
            </div>
            <button @click="addComPriv()" class="priv-add-btn">+</button>
        </div>
        <h2>Departments</h2>
        <div class="priv-c">
            <div class="priv-exist-table" v-for="(item,index) in existUserDepartment">
                <span class="exist-data"> {{ item.departmentname }}</span>
                <button class="exist-del-btn" @click="deleteExistDep(item.userdepartmentuuid, index)"> - </button>
            </div>
            <div class="priv-add-table" v-for="(item, index) in userDepartment">
                <select class="priv-data-input" v-model="userDepartment[index]" @change="updateUserEquip()">
                    <option value="" disabled selected> - - </option>
                    <option v-for="dep in departments" :value="dep['departmentuuid']" :key="dep['departmentuuid']">{{
                        dep.departmentname }}</option>
                </select>
                <button class="priv-del-btn" @click="deleteDepPriv(index)"> - </button>
            </div>
            <button @click="addDepPriv()" class="priv-add-btn">+</button>
        </div>
        <h2>Equipments</h2>
        <div class="priv-c">
            <div class="priv-exist-table" v-for="(item,index) in existUserEquip">
                <span class="exist-data"> {{ item.equipmentmodel }}</span>
                <button class="exist-del-btn" @click="deleteExistEquip(item.userequipuuid, index)"> - </button>
            </div>
            <div class="priv-add-table" v-for="(item, index) in userEquip">
                <select class="priv-data-input" v-model="userEquip[index]">
                    <option value="" disabled selected> - - </option>
                    <option v-for="equip in equipments" :value="equip['equipmentuuid']" :key="equip['equipmentuuid']">{{
                        equip.equipmentmodel }}</option>
                </select>
                <button class="priv-del-btn" @click="deleteEquipPriv(index)"> - </button>
            </div>
            <button @click="addEquipPriv()" class="priv-add-btn">+</button>
        </div>
        <div class="dep-priv">
        </div>
        <button v-if="userCompany.length && userDepartment.length && userEquip.length" class="edit-ele-btn"
            @click="addUserAcc()">Add Priviledge</button>
    </div>
</template>

<script>
import api from '@/assets/api';
import { ref } from 'vue'
const apiReq = new api();

export default {
    props: {
        uuid: String,
        showPrivModal: Boolean
    },
    data() {
        return {
            userData: ref({
                name: '',
                userUUID: ''
            }),
            existUserCompany: ref([]),
            userCompany: ref([]),
            userDepartment: ref([]),
            existUserDepartment: ref([]),
            userEquip: ref([]),
            existUserEquip: ref([]),
            users: ref([]),
            companies: ref([]),
            departments: ref([]),
            equipments: ref([])
        }
    },
    computed: {
        companyLength() {
            return this.userCompany.length;
        },
    },
    watch: {
        /*
        companyLength(newValue, oldValue) {
            console.log("old val", oldValue);
            console.log("new val", newValue);
            if (newValue > oldValue) {
                console.log("Item added");
            } else {
                console.log("item removed");
            }
        }*/
    },
    methods: {
        closePrivModal() {
            this.$emit('close');
        },
        getUserCompData(useruuid) {
            const body = {
                userUUID: [useruuid]
            }
            console.log(body);
            apiReq.post("company/getByUserId", body).then(data => {
                if (data.length > 0) {
                    this.existUserCompany = data
                } else {
                    alert("no data found");
                }
            }).catch(err => {
                console.log(err);
                this.existUserCompany = []
            })
        },
        getUserDepData(useruuid) {
            const body = {
                userUUID: [useruuid]
            }
            console.log(body);
            apiReq.post("dep/getByUserId", body).then(data => {
                if (data.length > 0) {
                    this.existUserDepartment = data
                }
            }).catch(err => {
                console.log(err);
                this.existUserDepartment = []
            })
        },
        getUserEquipData(useruuid) {
            const body = {
                userUUID: [useruuid]
            }
            console.log(body);
            apiReq.post("equip/getByUserId", body).then(data => {
                if (data.length > 0) {
                    this.existUserEquip = data
                }
            }).catch(err => {
                console.log(err);
                this.existUserEquip = [];
            })
        },
        getExistPriv(uuid) {
            this.getUserCompData(uuid);
            this.getUserDepData(uuid);
            this.getUserEquipData(uuid);
        },
        getCompanyData() {
            apiReq.get("company/getAll").then(data => {
                this.companies = data;
            }).catch(err => {
                console.log(err);
                alert("no company data found");
            })
        },
        getDepComData(selectedComp) {
            const body = {
                companyUUID: selectedComp
            }
            apiReq.post("dep/getByCompanyId", body).then(data => {
                this.departments = data;
                console.log(this.departments);
            }).catch(err => {
                console.log(err);
                alert("no department data found");
            })
        },
        getUserData() {
            apiReq.get("user/getAll").then(data => {
                if (data.length > 0) {
                    this.users = data;
                }
            }).catch(err => {
                console.log(err);
                alert("no data found");
            })
        },
        getDepEquipData(selectedDep) {
            const body = {
                departmentUUID: selectedDep
            }
            apiReq.post("equip/getByDepId", body).then(data => {
                this.equipments = data;
                console.log(this.departments);
            }).catch(err => {
                console.log(err);
                alert("no equipment data found");
            })
        },
        addUserCompany() {
            for (let i = 0; i < this.userCompany.length; i++) {
                if (this.userCompany[i] == '') {
                    continue;
                }
                const body = {
                    userUUID: this.userData.userUUID,
                    companyUUID: this.userCompany[i]
                }
                apiReq.post("user/addUserCompany", body).then(data => {
                    console.log("added user company");
                    console.log(body);
                }).catch(err => {
                    console.log(err);
                    alert("failed to add user company");
                })
            }
        },
        addUserDepartment() {
            for (let i = 0; i < this.userDepartment.length; i++) {
                if (this.userDepartment[i] == '') {
                    continue;
                }
                const body = {
                    userUUID: this.userData.userUUID,
                    departmentUUID: this.userDepartment[i]
                }
                apiReq.post("user/addUserDep", body).then(data => {
                    console.log("added user dep");
                    console.log(body);
                }).catch(err => {
                    console.log(err);
                    alert("failed to add user department");
                })
            }
        },
        addUserEquip() {
            for (let i = 0; i < this.userEquip.length; i++) {
                if (this.userEquip[i] == '') {
                    continue;
                }
                const body = {
                    userUUID: this.userData.userUUID,
                    equipmentUUID: this.userEquip[i]
                }
                apiReq.post("user/addUserEquip", body).then(data => {
                    console.log("added user equipment");
                    console.log(body);
                }).catch(err => {
                    console.log(err);
                    alert("failed to add user equipment");
                })
            }
        },
        updateUserDepartment() {
            this.getDepComData(this.userCompany);
        },
        updateUserEquip() {
            this.getDepEquipData(this.userDepartment);
        },
        addComPriv() {
            this.userCompany.push('');
        },
        deleteComPriv(index) {
            this.userCompany.splice(index, 1);
            this.userDepartment.length = 0;
            this.userEquip.length = 0;
        },
        addDepPriv() {
            this.userDepartment.push('');
        },
        deleteDepPriv(index) {
            this.userDepartment.splice(index, 1);
            this.userEquip.length = 0;
        },
        addEquipPriv() {
            this.userEquip.push('');
        },
        deleteEquipPriv(index) {
            this.userEquip.splice(index, 1);
        },
        deleteExistComp(uuid, index) {
            const body = {
                userCompanyUUID: [uuid]
            }
            console.log(body);
            apiReq.delete("company/deleteUserCompany", body).then(data => {
                console.log(data);
                this.existUserCompany.splice(index, 1);
            }).catch(err => {
                console.log(err);
                alert('failed to delete user company');
            })
        },
        deleteExistDep(uuid, index) {
            const body = {
                userDepartmentUUID: [uuid]
            }
            console.log(body);
            apiReq.delete("dep/deleteUserDep", body).then(data => {
                console.log(data);
                this.existUserDepartment.splice(index, 1);
            }).catch(err => {
                console.log(err);
                alert('failed to delete User Department');
            })
        },
        deleteExistEquip(uuid, index) {
            const body = {
                userEquipUUID: [uuid]
            }
            console.log(body);
            apiReq.delete("equip/deleteUserEquip", body).then(data => {
                console.log(data);
                this.existUserEquip.splice(index, 1);
            }).catch(err => {
                console.log(err);
                alert('failed to delete user company');
            })
        },
        addUserAcc() {
            this.addUserCompany();
            this.addUserDepartment();
            this.addUserEquip();
            alert("added succesfully");
        },
    },
    mounted() {
        this.getUserData();
        this.getCompanyData();
        //this.getEditUserData(this.uuid)
    }
};

</script>

<style scoped>
.new-user-modal {
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

.priv-c {
    display: flex;
    flex-direction: column;
}

.exist-data {
    font-size: 0.95vw;
    color: white;
    font-weight: bold;
}

.priv-exist-table {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5vw;
    background-color: #35495e;
    padding: 0.6vw;
    border-radius: 5px;
}

.priv-add-table {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 0.5vw;
}

.priv-data-input {
    padding: 2%;
    margin: 1.2vw 0vw 1.2vw 0vw;
    border-radius: 5px;
    width: 50%;
    border: 1px solid green;
    font-size: 0.9vw;
    border: none;
    text-align: center;
}

.priv-del-btn {
    width: 2vw;
    height: 2vw;
    align-self: center;
    /*top: -0.6vw;
  left: 19.7vw;*/
    cursor: pointer;
    background-color: rgb(245, 3, 3);
    border-radius: 50%;
    font-size: 1vw;
    font-weight: bold;
    color: white;
    border: none;
}

.exist-del-btn {
    width: 1.2vw;
    height: 1.2vw;
    align-self: center;
    /*top: -0.6vw;
  left: 19.7vw;*/
    cursor: pointer;
    background-color: rgb(245, 3, 3);
    border-radius: 50%;
    font-size: 1vw;
    font-weight: bold;
    color: white;
    border: none;
}

.priv-add-btn {
    width: 1.5vw;
    height: 1.5vw;
    padding: 0.05vw;
    margin: 0.5vw;
    align-self: center;
    background-color: rgb(1, 190, 26);
    border-radius: 5px;
    font-size: 1vw;
    color: white;
    border: none;

}

.close-btn {
    width: 2vw;
    position: absolute;
    top: -1%;
    left: 92%;
    z-index: 1000;
    cursor: pointer;
}
</style>