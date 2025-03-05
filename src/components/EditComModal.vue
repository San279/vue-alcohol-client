<script setup>
</script>

<template>
    <div v-if = "showEditModal" id='new_comp_modal' class='new-comp-modal' @click.stop>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="close-btn" @click="closeEditModal()">
            <path fill="#eb0000"
                d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
        </svg>
        <h2>Change Company Name</h2>
        <input class="new-data-input" v-model="editData.companyName" type="text">
        <button class="edit-ele-btn" @click="editSelected()">Apply Change</button>
    </div>
</template>

<script>
import api from '@/assets/api';
import { ref } from 'vue'
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
                companyName: ''
            }),
        }
    },
    methods: {
        closeEditModal() {
            this.$emit('close');
        },
        getEditData(uuid) {
            const body = {
                companyUUID: [uuid]
            }
            apiReq.post("company/getById", body).then(data => {
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        this.editData.companyUUID = data[i].companyuuid;
                        this.editData.companyName = data[i].companyname;
                    }
                }
            }).catch(err => {
                console.log(err);
                alert("selected companies not found");
            })
        },
        editSelected() {
            const body = {
                company: this.editData
            }
            apiReq.put("company/edit", body).then(data => {
                console.log(data);
                alert("company edit successfully");
                location.reload();
            }).catch(err => {
                console.log(err);
                alert('failed to edit company');
            })

        },
    },
    mounted() {
        this.getEditData(this.uuid)
    }
};

</script>

<style scoped>
.new-comp-modal {
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