<template>
  <div class="bk-report-list">
    <div class="bk-report-area">
      <div class="bk-report-area-header">
        <div class="bk-report-area-title">
          <div class="main-title">DOANH THU THEO THỜI GIAN</div>
          <div class="subtitle">{{selectedBranch.text}} - {{selectedYear}}</div>
        </div>
        <div class="bk-report-area-filter">
          <v-select
            v-model="selectedBranch"
            :items="listBranch"
            variant="underlined"
            @change="chooseBranch($event)"
            item-text="text"
            item-value="id"
            return-object
            width="300px"
            class="mr-4"
            label="Chi nhánh"
          ></v-select>
          <v-select
            v-model="selectedYear"
            :items="listYear"
            variant="underlined"
            @change="chooseYear($event)"
            item-text="text"
            item-value="id"
            return-object
            width="300px"
            label="Năm"
          ></v-select>

        </div>
      </div>
      <div class="bk-report-area-chart">
        <apexchart
          :options="chartOptions1"
          :series="series1"
          class="barchart1"
          width="80%"
          height="600"
          :key="chart1ForceUpdate"
        ></apexchart>
      </div>
    </div>

    <div class="bk-report-area-group">
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <div
            class="bk-report-area"
            id="chart-pie-2-area"
          >
            <div class="bk-report-area-header">
              <div class="bk-report-area-title">
                <div class="main-title">DOANH THU THEO CHI NHÁNH THÁNG NÀY</div>
                <div class="subtitle">{{totalChart2}} triệu đồng</div>
              </div>
              <div class="bk-report-area-filter"> <v-select
                  v-model="selectedTime2"
                  :items="listTime"
                  variant="underlined"
                  @change="chooseTime2($event)"
                  item-text="text"
                  item-value="id"
                  return-object
                  width="400px"
                ></v-select></div>
            </div>
            <div
              class="bk-report-area-chart"
              id="chart-pie-2"
            >
              <apexchart
                type="pie"
                width="450"
                :options="chartOptions2"
                :series="series2"
                :key="chart2ForceUpdate"
              ></apexchart>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <div class="bk-report-area">
            <div class="bk-report-area-header">
              <div class="bk-report-area-title">
                <div class="main-title">TOP 10 SẢN PHẨM ĐƯỢC MUA NHIỀU NHẤT</div>
              </div>
              <div class="bk-report-area-filter">
                <v-select
                  v-model="selectedTime3"
                  :items="listTime"
                  variant="underlined"
                  @change="chooseTime3($event)"
                  item-text="text"
                  item-value="id"
                  return-object
                  width="300px"
                ></v-select>
              </div>
            </div>
            <div class="bk-report-area-chart">
              <apexchart
                type="bar"
                height="350"
                :options="chartOptions3"
                :series="series3"
                :key="chart3ForceUpdate"
              ></apexchart>
            </div>
          </div>
        </v-col>
      </v-row>

    </div>
  </div>
</template>
  <script>
import { FactoryService } from "../../../service/factory/factory.service";
import VueApexCharts from "vue-apexcharts";
const BranchService = FactoryService.get("branchService");
const OrderService = FactoryService.get("orderService");
export default {
  name: "ReportList",
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      listYear: [],
      selectedBranch: {
        id: 99999,
        text: "Tất cả chi nhánh",
      },
      listBranch: [
        {
          id: 99999,
          text: "Tất cả chi nhánh",
        },
      ],
      chart1ForceUpdate: false,
      chart2ForceUpdate: false,
      chart3ForceUpdate: false,
      series1: [
        {
          name: "Doanh thu",
          // data: [
          //   400, 430, 448, 470, 540, 580, 690.6, 1100, 1200, 1380, 8999, 30000,
          // ],
        },
      ],
      chartOptions1: {
        chart: {
          type: "bar",
          fontFamily: "Times New Roman, Serif",
          height: 600,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " triệu đồng";
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: "rounded",
            // columnWidth: "55%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ],
        },
        yaxis: {
          title: {
            text: "VNĐ (triệu đồng)",
          },
        },
        title: {
          text: `Tất cả chi nhánh - ${new Date().getFullYear()}`,
          floating: true,
          align: "center",
          style: {
            color: "#444",
          },
        },
      },

      /**chart 2 */
      series2: [],
      chartOptions2: {
        chart: {
          width: 400,
          type: "pie",
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " triệu đồng";
            },
          },
        },
      },

      /** CHART 3 */
      series3: [
        {
          name: "Số lượng",
          data: [],
        },
      ],
      chartOptions3: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [],
          title: {
            text: "Số lượng (chiếc)",
          },
          fontFamily: "Times New Roman, Serif",
        },
      },
      listTime: [
        {
          id: 1,
          text: "Hôm nay",
        },
        {
          id: 2,
          text: "Tuần này",
        },
        {
          id: 3,
          text: "Tuần trước",
        },
        {
          id: 4,
          text: "Tháng này",
        },
        {
          id: 5,
          text: "Tháng trước",
        },
        {
          id: 6,
          text: "Năm nay",
        },
        {
          id: 7,
          text: "Năm ngoái",
        },
      ],
      selectedTime2: {
        id: 2,
        text: "Tuần này",
      },
      selectedTime3: {
        id: 2,
        text: "Tuần này",
      },
    };
  },
  components: {
    apexchart: VueApexCharts,
  },
  created() {
    this.listYear = Array.from(
      { length: 5 },
      (_, i) => new Date().getFullYear() - i
    );
    this.getAllBranch();
    this.getReportRevenueByYear();
    this.getReportRevenueByBranch();
    this.getReportProductBestSell();
  },
  methods: {
    getReportProductBestSell() {
      const me = this;
      let dateParam = this.getTimeByType(this.selectedTime2.id);
      let param = {
        startDate: dateParam.startDate,
        endDate: dateParam.endDate,
      };
      OrderService.getReportProductBestSell(param).then((result) => {
        if (result && result.data) {
          me.series3[0].data = result.data.data.map((x) => x.quantity);
          me.chartOptions3.xaxis.categories = result.data.data.map(
            (x) => x.productname
          );
          me.chart3ForceUpdate = !me.chart3ForceUpdate;
        }
      });
    },
    getReportRevenueByBranch() {
      const me = this;
      let dateParam = this.getTimeByType(this.selectedTime2.id);
      let param = {
        startDate: dateParam.startDate,
        endDate: dateParam.endDate,
      };
      OrderService.getReportRevenueByBranch(param).then((result) => {
        if (result && result.data) {
          me.series2 = result.data.data;
          me.chart2ForceUpdate = !me.chart2ForceUpdate;
        }
      });
    },
    /**
     * lấy báo cáo doanh thu chi nhánh theo năm
     */
    getReportRevenueByYear() {
      const me = this;
      let param = {
        branchid: this.selectedBranch.id,
        year: this.selectedYear,
      };
      OrderService.getReportRevenueByYear(param).then((result) => {
        if (result && result.data) {
          me.series1[0].data = result.data.data;
          me.chart1ForceUpdate = !me.chart1ForceUpdate;
        }
      });
    },
    /**
     * Lấy danh sách toàn bộ nhân viên
     */
    getAllBranch() {
      const me = this;
      BranchService.getAllData()
        .then((result) => {
          if (result && result.data) {
            me.listBranch = result.data.data.map((x) => ({
              id: x.idbranch,
              text: x.branchname,
            }));
            me.chartOptions2.labels = me.listBranch.map((x) => x.text);
            me.listBranch.unshift({
              id: 99999,
              text: "Tất cả chi nhánh",
            });
            me.selectedBranch = {
              id: 99999,
              text: "Tất cả chi nhánh",
            };
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * chọn chi nhánh
     */
    chooseBranch(branch) {
      this.selectedBranch = branch;
      this.chartOptions1.title.text = `${this.selectedBranch.text} - ${this.selectedYear}`;
      this.getReportRevenueByYear();
    },
    /**
     * chọn năm
     */
    chooseYear(year) {
      this.selectedYear = year;
      this.chartOptions1.title.text = `${this.selectedBranch.text} - ${this.selectedYear}`;
      this.getReportRevenueByYear();
    },

    /**
     * chọn mốc thời gian
     */
    chooseTime3(time) {
      this.selectedTime3 = time;
      this.getReportProductBestSell();
    },

    /**
     * chọn mốc thời gian
     */
    chooseTime2(time) {
      this.selectedTime2 = time;
      this.getReportRevenueByBranch();
    },

    getTimeByType(type) {
      switch (type) {
        case 1:
          return this.getToday();
        case 2:
          return this.getStartAndEndOfWeek();
        case 3:
          return this.getLastWeekDates();
        case 4:
          return this.getThisMonthDates();
        case 5:
          return this.getLastMonthDates();
        case 6:
          return this.getThisYearDates();
        case 7:
          return this.getLastYearDates();

        default:
          return this.getToday();
      }
    },
    /**
     * Lấy ngày bắt đầu và kết thúc của tuần hiện tại
     */
    getStartAndEndOfWeek() {
      const today = new Date();
      const day = today.getDay();
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - day
      );
      const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - day)
      );
      return {
        startDate: startDate,
        endDate: endDate,
      };
    },

    /**
     * tuần trước
     */
    getLastWeekDates() {
      var today = new Date();
      var dayOfWeek = today.getDay();
      var startDate = new Date();
      startDate.setDate(today.getDate() - dayOfWeek - 6);
      var endDate = new Date();
      endDate.setDate(startDate.getDate() + 6);
      return {
        startDate: startDate,
        endDate: endDate,
      };
    },
    /**
     * tháng này
     */
    getThisMonthDates() {
      var today = new Date();
      var startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      var endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        startDate: startDate,
        endDate: endDate,
      };
    },
    /**
     * tháng trước
     */
    getLastMonthDates() {
      var today = new Date();
      var lastMonthEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
      var lastMonthStartDate = new Date(
        lastMonthEndDate.getFullYear(),
        lastMonthEndDate.getMonth(),
        1
      );
      return {
        startDate: lastMonthStartDate,
        endDate: lastMonthEndDate,
      };
    },
    /**
     * Hôm qua
     */
    getYesterday() {
      var today = new Date();
      var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return {
        startDate: yesterday,
        endDate: yesterday,
      };
    },
    /**
     * Hôm nay
     */
    getToday() {
      var today = new Date();
      return {
        startDate: today,
        endDate: today,
      };
    },
    /**
     * năm nay
     */
    getThisYearDates() {
      var today = new Date();
      var thisYearStartDate = new Date(today.getFullYear(), 0, 1);
      var thisYearEndDate = new Date(today.getFullYear(), 11, 31);
      return {
        startDate: thisYearStartDate,
        endDate: thisYearEndDate,
      };
    },
    /**
     * năm ngoái
     */
    getLastYearDates() {
      var today = new Date();
      var lastYearEndDate = new Date(today.getFullYear() - 1, 11, 31);
      var lastYearStartDate = new Date(today.getFullYear() - 1, 0, 1);
      return {
        startDate: lastYearStartDate,
        endDate: lastYearEndDate,
      };
    },
  },
  computed: {
    totalChart2() {
      if (this.series2 && this.series2.length > 0) {
        return this.series2.reduce(function (total, num) {
          return total + num;
        }, 0);
      }
      return 0;
    },
  },
};
</script>
<style lang="css" scoped>
@import url("../../../css/management/m-reportlist.css");
</style>
  
  