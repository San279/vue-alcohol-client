<script setup>
const user = JSON.parse(localStorage.getItem("cur_user"));
</script>

<template>
  <div class="page-content">
    <NewLog v-if="newLogLogoVisible" />
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
            :placeholder="this.selectedDate.start && this.selectedDate.end ? 
            this.selectedDate.start.toLocaleDateString() + ' - ' + this.selectedDate.end.toLocaleDateString() : 'Select Date'">
          </input>
          <button v-if="showCalendar || fromDate || toDate" class="remove-date-btn" @click="removeDate()"> x </button>
        </div>
        <!--
        <v-calendar class="v-calen" mode="dateTime" v-if="showCalendar" :attributes="attributes"
          @dayclick="onDayClick" />
        <p v-if="fromDate && toDate">
                  </p>
        -->
          <v-date-picker class = "v-calen"  v-if="showCalendar" 
          mode="dateTime" v-model = "selectedDate" is-range is24hr/>
      </div>
    </div>
    <div class=log-table>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Check No.</th>
            <th>Name</th>
            <th>Alcohol Strength</th>
            <th>Department</th>
            <th>Equipment Model</th>
            <th>Id</th>
          </tr>
        </thead>
        <tbody id="table_log">
          <tr v-for="item in filteredData" :key="item.checkserialnumber" :class = "getRowColorClass(item)">
            <td class="table-ele">{{ item.date }}</td>
            <td class="table-ele">{{ item.time }}</td>
            <td class="table-ele">{{ item.checkserialnumber }}</td>
            <td class="table-ele">{{ item.name }}</td>
            <td class="table-ele">{{ item.alcoholstrength }} mg/100ml</td>
            <td class="table-ele">{{ item.deptname }}</td>
            <td class="table-ele">{{ item.equipmentmodel }}</td>
            <td class="table-ele">{{ item.gid }}</td>
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
import NewLog from '@/components/NewLog.vue';
const apiReq = new api();
export default {
  components: { Multiselect },
  data() {
    return {
      showCalendar: ref(false),
      selectedDate: ref({
        start: null,
        end: null
      }),
      lastLog: ref(null),
      intervalId: null,
      newLogLogoVisible: ref(false),
      newLogTimeoutId: ref(null),
      attributes: ref([
        {
          highlight: {
            start: { fillMode: 'outline' },
            base: { fillMode: 'light' },
            end: { fillMode: 'outline' },
          },
        },
      ]),
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
    removeDate() {
      this.showCalendar = false;
      this.selectedDate.start = null;
      this.selectedDate.end = null;
    },
    getLogData() {
      apiReq.get("log/getAllLogs").then(data => {
        this.tableData = data;
        this.lastLog = data[data.length - 1].loguuid
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
    getLastLog() {
      this.intervalId = setInterval(() => {
        apiReq.get("log/getRecentLog").then(data => {
          if (this.lastLog && this.lastLog !== data[0].loguuid) {
            this.lastLog = data[0].loguuid;
            this.getLogData();
            this.newLogLogoVisible = true;
            clearTimeout(this.newLogTimeoutId);
            this.newLogTimeoutId = setTimeout(() => {
              this.newLogLogoVisible = false;
            }, 2700);
          }
          console.log(this.lastLog);
        }).catch(err => {
          console.log(err);
        })
      }, 1500)
    },
    stopInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
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
    getRowColorClass(item) {
          const alcoholStr = parseInt(item.alcoholstrength, 10)
          console.log(alcoholStr);
            if (item.lowalclvl && item.medalclvl && item.highalclvl) {
                return {
                    'low-alc': alcoholStr >= item.lowalclvl && alcoholStr < item.medalclvl,
                    'medium-alc': alcoholStr >= item.medalclvl && alcoholStr < item.highalclvl,
                    'high-alc': alcoholStr >= item.highalclvl,
                };
            }
            return {};
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

      if (this.selectedDate.start && this.selectedDate.end) {
        this.showCalendar = false;
        const from = new Date(this.selectedDate.start);
        const to = new Date(this.selectedDate.end);

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
  },
  */
  mounted() {
    this.getLogData();
    this.getCompanyData();
    this.getDepartmentData();
    this.getLastLog();
  },
  beforeUnmount() {
    this.stopInterval(); // Clear the interval when the component is unmounted
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
  position: relative;
  left: 3vw;
  align-items: center;
}

.date-input-c {
  display: flex;
  align-items: center;
}

.v-calen {
  position: absolute;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  /* Ensures it appears above other elements */
  width: max-content;
}

.vc-time-select-group select {
    background: transparent;
    padding: 3px 45px;
    text-align: center;
    border: none;
}

.vc-base-select select.vc-align-right {
    text-align: center;
}

.vc-pane {
    min-width: 250px;
}

.remove-date-btn {
  border: none;
  border-radius: 50%;
  position: absolute;
  right: 0vw;
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
  width: 13.5vw;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  background: #fff;
  color: black;
  font-size: 0.8vw;
}

.low-alc {
    background-color: rgb(239, 227, 57);
}

.medium-alc {
    background-color: rgb(233, 169, 143);
}

.high-alc {
    background-color: rgb(235, 103, 103);
}


</style>