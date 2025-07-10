import React from "react";
import ReactApexChart from "react-apexcharts";
import { connect } from "react-redux";

class TempStudentsChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: props.series || [], 
      options: {
        chart: {
          width: 370,
          type: 'donut',
        },
        labels: props.labels || [], 
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
          },
        },
        dataLabels: {
          enabled: true,
          // formatter: function (val, opts) {
          //   return opts.w.globals.series[opts.seriesIndex];
          // },
        },
        fill: {
          type: 'gradient',
        },
        legend: {
          formatter: function (val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="donut" width={370} />
      </div>
    );
  }
}

export default connect()(TempStudentsChart);
