function PlotStock(StockCode, low, high, dates){

    var trace1 = {
        type: "scatter",
        mode: "lines",
        name: StockCode.toUpperCase() + ' High',
        x: dates,
        y: high,
        line: {color: '#17BECF'}
    };

    var trace2 = {
        type: "scatter",
        mode: "lines",
        name: StockCode.toUpperCase() + ' Low',
        x: dates,
        y: low,
        line: {color: 'aquamarine'}
    };

    var data = [trace1,trace2];

    var layout = {
        title: 'Predicted ' + StockCode.toUpperCase() + ' Price',
        autosize: true,
        plot_bgcolor: 'slategrey',
        paper_bgcolor: 'slategrey',
        showlegend: false,
        height: 500,
        xaxis: {
            linecolor: 'black',
            linewidth: 2,
            mirror: true,
            autorange: 'true'
        },
        yaxis: {
            linecolor: 'black',
            linewidth: 2,
            mirror: true,
            autorange: true
        },
        margin:{
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4
    }
    };

    var options ={
        showLink: false,
        displaylogo: false,
        modeBarButtonsToRemove: ['plotlyjsicon', 'select2d', 'sendDataToCloud', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian','toggleSpikelines']
    };

    Plotly.newPlot('StocksGraph', data, layout, options);

    window.onresize = function() {
        Plotly.relayout('StocksGraph', {
            'xaxis.autorange': true,
            'yaxis.autorange': true
        });
    }
}

$(document).ready(function(){
    $(".navbar-nav .scroll-link").on('click', function (event) {
        $(".navbar-collapse").collapse('hide');
    });
});

$(document).ready(function () {
    $('.scroll-link').on('click', function (event) {
        event.preventDefault();

        var sectionID = $(this).attr("href");

        scrollToID(sectionID);
  });
    function scrollToID(id) {
        var offSet = 50;
        var targetOffset = $(id).offset().top - offSet;
        $('html,body').animate({ scrollTop: targetOffset }, 1000);
    }
});


$(document).ready(function(){
    $('#StockInputForm').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!");
        $('#loader').css('display', 'block');
        var csrftoken = $.cookie('csrftoken');
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
        $.ajax({
            url : "/stockCode/", // the endpoint
            type : "POST", // http method
            data : { code : $('#StockCodeInput').val(), csrfmiddlewaretoken: csrftoken }, // data sent with the post request

            // handle a successful response
            success : function(json) {
                //$('#StockCodeInput').val(''); // remove the value from the input
                console.log(json); // log the returned json to the console
                $('#loader').hide();
                PlotStock($('#StockCodeInput').val(),json.low, json.high, json.dates);
            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    return false;
    });
});

$(document).ready(function(){
    (function() {

  'use strict';

  // define variables
  var items = document.querySelectorAll(".timeline li");

  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callbackFunc() {
    for (var i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
      }
    }
  }

  // listen for events
  window.addEventListener("load", callbackFunc);
  window.addEventListener("resize", callbackFunc);
  window.addEventListener("scroll", callbackFunc);

})();
});