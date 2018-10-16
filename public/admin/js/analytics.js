var apiOptions = {
  keenAPIkey : '1B8293429B43B2D555991CFFB9B2E6B158C5A0EA5F00359D91B71F041381E5CB',
  keenProjectID : '5b573abcc9e77c000175c9eb'
}

var past_6_months;

$(document).ready(function(){
  past_6_months = getDates();
  getUniqueVisitors();
  getItemsSold();
  getProjectsCreated();
  getTotalEarnings();
});

// This function is used to collect the names of the previous 6 months of the year, this is then used for the graphs X columns
var getDates = function(){
  var dates = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var today = new Date();
  var current_month = today.getMonth() + 1;
  var first_month = current_month - 6;

  var past_6_months = dates.slice(first_month, current_month);

  return past_6_months;
}

var getUniqueVisitors = function() {
  // Call the KEENAPI for data on unique visitors
  $.ajax({
      url: 'https://api.keen.io/3.0/projects/' + apiOptions.keenProjectID + '/queries/count_unique?api_key=' + apiOptions.keenAPIkey + '&event_collection=pageviews&target_property=ip&interval=monthly&timezone=Europe%2FLondon&timeframe=this_6_months&filters=%5B%5D';
  }).done(function(response) {
      var visitors_by_month = [];

      for(var i = 0; i < response.result.length; i++){
          visitors_by_month[i] = response.result[i].value;
      }

      setUniqueVisitors(visitors_by_month);
  });
};

var setUniqueVisitors = function(visitors_by_month) {
    var label = $("#unique_visitors");
    label.html(visitors_by_month[visitors_by_month.length - 1]);

    var graph = document.getElementById("unique_visitors_chart");

    if (graph) {
      graph.height = 130;
      var myChart = new Chart(graph, {
        type: 'line',
        data: {
          labels: past_6_months,
          type: 'line',
          datasets: [{
            data: visitors_by_month,
            label: 'Visitors',
            backgroundColor: 'rgba(255,255,255,.1)',
            borderColor: 'rgba(255,255,255,.55)',
          },]
        },
        options: {
          maintainAspectRatio: true,
          legend: {
            display: false
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          responsive: true,
          scales: {
            xAxes: [{
              gridLines: {
                color: 'transparent',
                zeroLineColor: 'transparent'
              },
              ticks: {
                fontSize: 2,
                fontColor: 'transparent'
              }
            }],
            yAxes: [{
              display: false,
              ticks: {
                display: false,
              }
            }]
          },
          title: {
            display: false,
          },
          elements: {
            line: {
              borderWidth: 0
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4
            }
          }
        }
      });
    }
};

var getItemsSold = function() {
  // Call the KEENAPI for data on unique visitors
  $.ajax({
      url: 'https://api.keen.io/3.0/projects/' + apiOptions.keenProjectID + '/queries/count?api_key=' + apiOptions.keenAPIkey + '&event_collection=payments-finalised&interval=monthly&timezone=Europe%2FLondon&timeframe=this_6_months&filters=%5B%5D'
  }).done(function(response) {
      var orders_by_month = [];

      for(var i = 0; i < response.result.length; i++){
          orders_by_month[i] = response.result[i].value;
      }

      setItemsSold(orders_by_month);
  });
};

var setItemsSold = function(orders_by_month) {
    var label = $("#orders");
    label.html(orders_by_month[orders_by_month.length - 1]);

    var graph = document.getElementById("orders_per_month");

    if (graph) {
      graph.height = 130;
      var myChart = new Chart(graph, {
        type: 'line',
        data: {
          labels: past_6_months,
          type: 'line',
          datasets: [{
            data: orders_by_month,
            label: 'Orders',
            backgroundColor: 'transparent',
            borderColor: 'rgba(255,255,255,.55)',
          },]
        },
        options: {

          maintainAspectRatio: false,
          legend: {
            display: false
          },
          responsive: true,
          tooltips: {
            mode: 'index',
            titleFontSize: 12,
            titleFontColor: '#000',
            bodyFontColor: '#000',
            backgroundColor: '#fff',
            titleFontFamily: 'Montserrat',
            bodyFontFamily: 'Montserrat',
            cornerRadius: 3,
            intersect: false,
          },
          scales: {
            xAxes: [{
              gridLines: {
                color: 'transparent',
                zeroLineColor: 'transparent'
              },
              ticks: {
                fontSize: 2,
                fontColor: 'transparent'
              }
            }],
            yAxes: [{
              display: false,
              ticks: {
                display: false,
              }
            }]
          },
          title: {
            display: false,
          },
          elements: {
            line: {
              tension: 0.00001,
              borderWidth: 1
            },
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 4
            }
          }
        }
      });
    }
};

var getProjectsCreated = function() {
  // Call the KEENAPI for data on unique visitors
  $.ajax({
      url: 'https://api.keen.io/3.0/projects/' + apiOptions.keenProjectID + '/queries/count?api_key=' + apiOptions.keenAPIkey + '&event_collection=projects-created&interval=monthly&timezone=Europe%2FLondon&timeframe=this_6_months&filters=%5B%5D'
  }).done(function(response) {
      var projects_by_month = [];
      var projects_total = 0;

      for(var i = 0; i < response.result.length; i++){
          projects_by_month[i] = response.result[i].value;
          projects_total = projects_total + response.result[i].value;
      }

      setProjectsCreated(projects_by_month, projects_total);
  });
};

var setProjectsCreated = function(projects_by_month, projects_total) {
    var label = $("#projects");
    label.html(projects_total);

    var graph = document.getElementById("projects_by_month");

    if (graph) {
      graph.height = 130;
      var myChart = new Chart(graph, {
        type: 'line',
        data: {
          labels: past_6_months,
          type: 'line',
          datasets: [{
            data: projects_by_month,
            label: 'Projects',
            backgroundColor: 'transparent',
            borderColor: 'rgba(255,255,255,.55)',
          },]
        },
        options: {

          maintainAspectRatio: false,
          legend: {
            display: false
          },
          responsive: true,
          tooltips: {
            mode: 'index',
            titleFontSize: 12,
            titleFontColor: '#000',
            bodyFontColor: '#000',
            backgroundColor: '#fff',
            titleFontFamily: 'Montserrat',
            bodyFontFamily: 'Montserrat',
            cornerRadius: 3,
            intersect: false,
          },
          scales: {
            xAxes: [{
              gridLines: {
                color: 'transparent',
                zeroLineColor: 'transparent'
              },
              ticks: {
                fontSize: 2,
                fontColor: 'transparent'
              }
            }],
            yAxes: [{
              display: false,
              ticks: {
                display: false,
              }
            }]
          },
          title: {
            display: false,
          },
          elements: {
            line: {
              tension: 0.00001,
              borderWidth: 1
            },
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 4
            }
          }
        }
      });
    }
};

var getProjectsCreated = function() {
  // Call the KEENAPI for data on unique visitors
  $.ajax({
      url: 'https://api.keen.io/3.0/projects/' + apiOptions.keenProjectID + '/queries/count?api_key=' + apiOptions.keenAPIkey + '&event_collection=projects-created&interval=monthly&timezone=Europe%2FLondon&timeframe=this_6_months&filters=%5B%5D'
  }).done(function(response) {
      var projects_by_month = [];
      var projects_total = 0;

      for(var i = 0; i < response.result.length; i++){
          projects_by_month[i] = response.result[i].value;
          projects_total = projects_total + response.result[i].value;
      }

      setProjectsCreated(projects_by_month, projects_total);
  });
};

var setProjectsCreated = function(projects_by_month, projects_total) {
    var label = $("#projects");
    label.html(projects_total);

    var graph = document.getElementById("projects_by_month");

    if (graph) {
      graph.height = 130;
      var myChart = new Chart(graph, {
        type: 'line',
        data: {
          labels: past_6_months,
          type: 'line',
          datasets: [{
            data: projects_by_month,
            label: 'Revenue',
            backgroundColor: 'transparent',
            borderColor: 'rgba(255,255,255,.55)',
          },]
        },
        options: {

          maintainAspectRatio: false,
          legend: {
            display: false
          },
          responsive: true,
          tooltips: {
            mode: 'index',
            titleFontSize: 12,
            titleFontColor: '#000',
            bodyFontColor: '#000',
            backgroundColor: '#fff',
            titleFontFamily: 'Montserrat',
            bodyFontFamily: 'Montserrat',
            cornerRadius: 3,
            intersect: false,
          },
          scales: {
            xAxes: [{
              gridLines: {
                color: 'transparent',
                zeroLineColor: 'transparent'
              },
              ticks: {
                fontSize: 2,
                fontColor: 'transparent'
              }
            }],
            yAxes: [{
              display: false,
              ticks: {
                display: false,
              }
            }]
          },
          title: {
            display: false,
          },
          elements: {
            line: {
              borderWidth: 1
            },
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 4
            }
          }
        }
      });
    }
};

var getTotalEarnings = function() {
  // Call the KEENAPI for data on unique visitors
  $.ajax({
      url: 'https://api.keen.io/3.0/projects/' + apiOptions.keenProjectID + '/queries/sum?api_key=' + apiOptions.keenAPIkey + '&event_collection=payments-finalised&target_property=amount&group_by=currency&interval=monthly&timezone=Europe%2FLondon&timeframe=this_6_months&filters=%5B%5D'
  }).done(function(response) {
      var earnings_by_month = [];
      var earnings_in_eth = [0, 0, 0, 0, 0, 0];
      var earnings_in_btc = [0, 0, 0, 0, 0, 0];
      var earnings_total = 0;

      for(var i = 0; i < response.result.length; i++){
          if(response.result[i].value[0].currency == 'eth'){
            earnings_in_eth[i] = response.result[i].value[0].result;
          } else {
            earnings_in_btc[i] = response.result[i].value[0].result;
          }
      }

      // Get prices of crypto from cryptocompare
      $.ajax({
         url: 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,ETH'
      }).done(function(response) {
          // Convert price of ETH to $ such that 1 eth = $X
          var eth = response.ETH;
          eth = 1 / eth;
          // Convert price of BTC to $ such that 1 btc = $X
          var btc = response.BTC;
          btc = 1 / btc;

          // Loop through the earnings, converting to $ and adding up
          var earnings_by_month = [];
          var total_earnings = 0;

          for(var i = 0; i < earnings_in_eth.length; i++){
            earnings_by_month[i] = eth * earnings_in_eth[i];
            total_earnings = total_earnings + (eth * earnings_in_eth[i]);
          }

          for(var i = 0; i < earnings_in_btc.length; i++){
            earnings_by_month[i] = earnings_by_month[i] + (btc * earnings_in_btc[i]);
            total_earnings = total_earnings + (btc * earnings_in_btc[i]);
          }

          total_earnings = total_earnings.toFixed(2);

          setEarningsByPercentage(earnings_in_eth, earnings_in_btc);
          setTotalEarnings(earnings_by_month, total_earnings);
      });
  });
};

var setTotalEarnings = function(earnings_by_month, earnings_total) {
    var label = $("#earnings");
    label.html(earnings_total);

    var graph = document.getElementById("earnings_by_month");

    if (graph) {
      graph.height = 115;
      var myChart = new Chart(graph, {
        type: 'bar',
        data: {
          labels: past_6_months,
          datasets: [
            {
              label: "Revenue",
              data: earnings_by_month,
              borderColor: "transparent",
              borderWidth: "0",
              backgroundColor: "rgba(255,255,255,.3)"
            }
          ]
        },
        options: {
          maintainAspectRatio: true,
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: false,
              categoryPercentage: 1,
              barPercentage: 0.65
            }],
            yAxes: [{
              display: false
            }]
          }
        }
      });
    }
};

var setEarningsByPercentage = function(earnings_in_eth, earnings_in_btc) {

    var btc_total = 0;
    var eth_total = 0;

    for(var i = 0; i < earnings_in_eth.length; i++){
      eth_total = eth_total + earnings_in_eth[i];
      btc_total = btc_total + earnings_in_btc[i];
    }

    var percent_total = btc_total + eth_total;
    var eth_percent = percent_total / eth_total * 100;
    var btc_percent = 100 - eth_percent;

    var earnings_by_percent = [eth_percent, btc_percent];

    var graph = document.getElementById("earnings_by_currency");

    if (graph) {
      graph.height = 280;
      var myChart = new Chart(graph, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              label: "Percent",
              data: earnings_by_percent,
              backgroundColor: [
                '#00b5e9',
                '#fa4251'
              ],
              hoverBackgroundColor: [
                '#00b5e9',
                '#fa4251'
              ],
              borderWidth: [
                0, 0
              ],
              hoverBorderColor: [
                'transparent',
                'transparent'
              ]
            }
          ],
          labels: [
            'ETH',
            'BTC'
          ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          cutoutPercentage: 55,
          animation: {
            animateScale: true,
            animateRotate: true
          },
          legend: {
            display: false
          },
          tooltips: {
            titleFontFamily: "Poppins",
            xPadding: 15,
            yPadding: 10,
            caretPadding: 0,
            bodyFontSize: 16
          }
        }
      });
    }
};