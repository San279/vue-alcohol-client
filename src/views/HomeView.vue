<script setup>
</script>

<template>
  <div class="home-view">
    <h1>Logs</h1>
    <div class="search-con">
      <!--
      <multiselect class="search-input" id="companyTag" v-model="searchCompany" tag-placeholder="Add this as new tag"
        placeholder="Filter Companies" label="companyName" track-by="companyName" :options="companyIndex"
        :multiple="true" :taggable="true" @tag="addCompany"></multiselect> -->

      <multiselect class="search-input" id="departTag" v-model="searchDep" tag-placeholder="Add this as new tag"
        placeholder="Filter Departments" label="deptname" track-by="deptname" :options="depIndex" :multiple="true"
        :taggable="true" @tag="addDepartment"></multiselect>
      <multiselect class="search-input" id="equipTag" v-model="searchEquip" tag-placeholder="Add this as new tag"
        placeholder="Filter Equipments" label="equipmentmodel" track-by="equipmentmodel" :options="equipIndex"
        :multiple="true" :taggable="true" @tag="addEquip"></multiselect>

      <multiselect class="search-input" id="gidTag" v-model="searchGid" tag-placeholder="Add this as new tag"
        placeholder="Filter ID's" label="" track-by="gid" :options="gidIndex" :multiple="true" :taggable="true"
        @tag="addGid"></multiselect>
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
        <tbody id = "table_log">
          <tr v-for="item in tableData" :key="item.checkserialnumber">
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
      <button class= "pdf-btn" @click="generatePDF">Generate PDF</button>
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
const apiReq = new api();
export default {
  components: { Multiselect },
  data() {
    return {
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
      equipIndex: ref([
        {
          equipmentmodel: "e4"
        },
        {
          equipmentmodel: "zx10r"
        }
      ]),
      searchEquipSet: new Set(),

      searchGid: ref([]),
      gidIndex: ref([]),
      searchGidSet: new Set(),

      searchDep: reactive([]),
      searchDepSet: new Set(),
      depIndex: ref([
        {
          deptname: "chor"
        },
        {
          deptname: "sor"
        }
      ]),
      tableData: ([]),
    }
  }, methods: {
    addCompany(newTag) {
      this.companyIndex.push(newTag)
      this.searchCompany.add(newTag);
    },
    addDepartment(newTag) {
      this.depIndex.push(newTag);
      //this.searchDepSet.add(newTag)
      this.searchDep.push(newTag)
    },
    addEquip(newTag) {
      this.equipIndex.push(newTag)
      this.searchEquip.push(newTag)
    },
    addGid(newTag) {
      this.gidIndex.push(newTag)
      this.searchGid.push(newTag)
    },
    filterTable() {
      $(".table_log").children().each(function () {
        console.log($(this).text());
        /*
        let equipmentNo = $(this).attr('data-target');
        if (equipmentNo.includes(search_equip)) {
          $(this).show()
        } else {
          $(this).hide()
        }
          */
      })
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
    generatePDF() {
      const element = document.querySelector('table'); // Get the table element

      const opt = {
        margin: 10, // Margin in mm
        filename: 'my-table.pdf', // Name of the PDF file
        image: { type: 'jpeg', quality: 0.98 }, // Image settings
        html2canvas: { scale: 2 }, // Increase scale for better resolution
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // PDF settings
      };

      // New Promise-based usage:
      html2pdf().from(element).set(opt).save();


      // Old callback-based usage (still supported):
      // html2pdf(element, opt);
    },
  },
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
  mounted() {
    this.getLogData();
  },

}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style soped>
.home-view {
  width: 100vw;
  height: 100%;
  padding-right: 8vw;
  padding-top: 2vw;
}

.pdf-btn{
  width: 6vw;
  height: 2vw;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: brown;
  font-size: 0.8vw;
  cursor: pointer;
  font-weight: bold;
}

</style>