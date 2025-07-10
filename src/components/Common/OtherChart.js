import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { connect } from "react-redux";

class OtherChart extends Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: props.series || [], 
        options: {
          chart: {
            width: 300,
            type: 'pie',
          },
          labels: props.labels || [], 
          legend: {
            formatter: function(val, opts) {
              return val + " - " + opts.w.globals.series[opts.seriesIndex]
            }
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              
              legend: {
                position: 'bottom'
                
              }
            }
          }],
          dataLabels: {
            enabled: true,
           
            
          },
        },
      
      
      };
    }

  

    render() {
      return (
        

  <div id="chart">
<ReactApexChart options={this.state.options} series={this.state.series} type="pie" width={300} />
</div>

)}}


export default connect()(OtherChart);
