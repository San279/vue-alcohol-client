<script setup>
const user = JSON.parse(localStorage.getItem("cur_user"));
</script>

<template>
  <div class="page-content">
    <h1>Logs</h1>
    <div class="search-con">
      <!--
      <multiselect class="search-input" id="companyTag" v-model="searchCompany" tag-placeholder="Add this as new tag"
        placeholder="Filter Companies" label="companyName" track-by="companyName" :options="companyIndex"
        :multiple="true" :taggable="true" @tag="addCompany"></multiselect> -->

      <multiselect class="search-input" id="departTag" v-model="searchDepartment" tag-placeholder="Add this as new tag"
        placeholder="Filter Departments" label="departmentname" track-by="departmentname" :options="departmentIndex"
        :multiple="true" :taggable="true"></multiselect>
      <multiselect class="search-input" id="equipTag" v-model="searchEquip" tag-placeholder="Add this as new tag"
        placeholder="Filter Equipments" label="equipmentmodel" track-by="equipmentmodel" :options="equipIndex"
        :multiple="true" :taggable="true"></multiselect>
      <multiselect class="search-input" id="gidTag" v-model="searchGid" tag-placeholder="Add this as new tag"
        placeholder="Filter ID's" label="" track-by="gid" :options="gidIndex" :multiple="true" :taggable="true">
      </multiselect>
      <div class="calendar-picker">
        <div class="date-input-c">
          <input class="date-input" @click="showCalendar = !showCalendar"
            :placeholder="fromDate && toDate ? fromDate + ' - ' + toDate : 'Select Date'">
          </input>
          <button v-if = "showCalendar || fromDate || toDate" class = "remove-date-btn" @click="removeDate()"> x </button>
        </div>
        <v-calendar v-if="showCalendar" :attributes="attributes" @dayclick="onDayClick" />
        <p v-if="fromDate && toDate">
        </p>
      </div>
    </div>
    <div class=log-table>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Id</th>
            <th>Name</th>
            <th>Time</th>
            <th>Alcohol Strength</th>
            <th>Department</th>
            <th>Equipment Model</th>
            <th>Check No.</th>
          </tr>
        </thead>
        <tbody id="table_log">
          <tr v-for="item in filteredData" :key="item.checkserialnumber">
            <td class="table-ele">{{ item.date }}</td>
            <td class="table-ele">{{ item.gid }}</td>
            <td class="table-ele">{{ item.name }}</td>
            <td class="table-ele">{{ item.time }}</td>
            <td class="table-ele">{{ item.alcoholstrength }} miligram</td>
            <td class="table-ele">{{ item.deptname }}</td>
            <td class="table-ele">{{ item.equipmentmodel }}</td>
            <td class="table-ele">{{ item.checkserialnumber }}</td>
          </tr>
        </tbody>
      </table>
      <button class="pdf-btn" @click="generatePDF">Generate PDF</button>
    </div>
  </div>
</template>

<script>
import { ref, watch, reactive } from 'vue'
import Multiselect from 'vue-multiselect'
import html2pdf from 'html2pdf.js';
import api from '@/assets/api';
import $ from 'jquery';
const apiReq = new api();
export default {
  components: { Multiselect },
  data() {
    return {
      showCalendar: ref(false),
      fromDate: ref(null),
      toDate: ref(null),
      selectedDates: ref([]),
      attributes: ref([]),

      searchCompany: ref(new Set()),
      companyIndex: ref([
        {
          "companyUUID": "43210",
          "companyName": "yamaha"
        },
        {
          "companyUUID": "43211",
          "companyName": "honda"
        }
      ]),

      searchEquip: ref([]),
      equipIndex: ref([]),

      searchGid: ref([]),
      gidIndex: ref([]),

      searchDepartment: ref([]),
      departmentIndex: ref([]),
      tableData: ([]),
    }
  },
  methods: {
    onDayClick(day) {
      const date = day.date;

      if (!this.fromDate) {
        this.fromDate = date.toLocaleDateString();
        this.selectedDates = [date];
      } else if (!this.toDate) {
        if (date > new Date(this.fromDate)) {
          this.toDate = date.toLocaleDateString();
          this.selectedDates.push(date);
          this.showCalendar = false;
        } else {
          this.fromDate = date.toLocaleDateString();
          this.selectedDates = [date];
        }
      } else {
        this.fromDate = date.toLocaleDateString();
        this.toDate = null;
        this.selectedDates = [date];
      }
    },
    removeDate(){
      this.showCalendar = false;
      this.fromDate = null;
      this.toDate = null;
      this.selectedDates = [];
    },
    getLogData() {
      apiReq.get("log/getAllLogs").then(data => {
        this.tableData = data;
        for (let i = 0; i < this.tableData.length; i++) {
          let splitDateTime = this.tableData[i].checkdate.split(" ");
          this.tableData[i].date = splitDateTime[0];
          this.tableData[i].time = splitDateTime[1];
        }
        console.log(this.tableData)
      }).catch(err => {
        console.log(err);
        alert("no data found");
      })
    },
    getDepartmentData() {
      apiReq.get("dep/getAll").then(data => {
        this.departmentIndex = data;
      }).catch(err => {
        console.log(err);
      })
    },
    getCompanyData() {
      apiReq.get("equip/getAll").then(data => {
        this.equipIndex = data;
      }).catch(err => {
        console.log(err);
      })
    },
    generatePDF() {
      const element = document.querySelector('table'); // Get the table element

      const opt = {
        margin: 10, // Margin in mm
        filename: 'my-table.pdf', // Name of the PDF file
        image: { type: 'jpeg', quality: 100 }, // Image settings
        html2canvas: { scale: 5 }, // Increase scale for better resolution
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, // PDF settings
      };

      // New Promise-based usage:
      html2pdf().from(element).set(opt).save();


      // Old callback-based usage (still supported):
      // html2pdf(element, opt);
    },
  },
  computed: {
    filteredData() {
      let filteredLogs = this.tableData;
      console.log()
      if (this.searchDepartment && this.searchDepartment.length > 0) {
        filteredLogs = filteredLogs.filter((log) => {
          return this.searchDepartment.some(
            (selectedDepartment) => selectedDepartment.departmentname === log.deptname
          );
        });
      }

      if (this.searchEquip && this.searchEquip.length > 0) {
        filteredLogs = filteredLogs.filter((log) => {
          return this.searchEquip.some(
            (selectedEquip) => selectedEquip.equipmentmodel === log.equipmentmodel
          );
        });
      }

      if (this.fromDate && this.toDate) {
        const from = new Date(this.fromDate);
        const to = new Date(this.toDate);

        filteredLogs = filteredLogs.filter((log) => {
          const logDate = new Date(log.date);
          if (logDate >= from && logDate <= to) {
            return true;
          } else {
            return false;
          }
        });
      }
      //console.log(filteredLogs);
      return filteredLogs;
    },
  },
  /*
  watch: {
    searchDep: {
      handler(newValue, oldValue) {
        console.log("searchDep changed:", newValue, oldValue);
        this.searchDepSet.clear();
        newValue.forEach(item => this.searchDepSet.add(item.deptname));

        console.log('searchDepSet (set):', this.searchDepSet);
      },
      deep: true,
    },
    searchEquip: {
      handler(newValue, oldValue) {
        console.log("searchDep changed:", newValue, oldValue);
        this.searchEquipSet.clear();
        newValue.forEach(item => this.searchEquipSet.add(item.equipmentmodel));

        console.log('searchEquipSet (set):', this.searchEquipSet);
      },
      deep: true,
    },
    searchGid: {
      handler(newValue, oldValue) {
        console.log("searchDep changed:", newValue, oldValue);
        this.searchGidSet.clear();
        newValue.forEach(item => this.searchGidSet.add(item.gid));

        console.log('searchGidSet (set):', this.searchGidSet);
      },
      deep: true,
    },
  },
  */
  mounted() {
    this.getLogData();
    this.getCompanyData();
    this.getDepartmentData();
  },

}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style soped>
.pdf-btn {
  width: 8vw;
  height: 2.5vw;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: brown;
  font-size: 1vw;
  cursor: pointer;
  font-weight: bold;
  margin-left: 81vw;
  margin-top: 1vw;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
}

.pdf-btn:hover {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
}

.calendar-picker {
  position: fixed;
  top: 7.05vw;
  left: 58vw;
  align-items: center;
}

.date-input-c{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.remove-date-btn{
  border: none;
  border-radius: 50%;
  width: 1.4vw;
  height: 1.4vw;
  margin: 0.3vw;
  background-color: red;
  font-size: 1vw;
  color: white;
  cursor: pointer;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
}
.date-input {
  min-height: 40px;
  display: block;
  padding: 0.68vw;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-size: 0.8vw;
}
</style>