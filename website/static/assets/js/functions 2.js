var predictData = [];
var StockInfoDate = [];
var StockInfoNums = [];
var StockInfoLow = [];
var StockInfoHigh = [];
$.getJSON("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=googl&outputsize=full&apikey=O91SB0IK1PJN0TXU", async function(data){
    console.log(data);

    var totaldata = (data["Time Series (Daily)"]);
    console.log(totaldata);

    for (var x in data["Time Series (Daily)"]){
        StockInfoDate.push(x);
    }

    for (i = 0; i < 300; i++){
        StockInfoNums.push(totaldata[StockInfoDate[i]]);
    }
    console.log(StockInfoNums);

    for(i = 0; i < 300; i++){
        StockInfoLow.push(StockInfoNums[i]["3. low"]);
        StockInfoHigh.push(StockInfoNums[i]["2. high"]);
    }
    console.log(StockInfoHigh);

    for(i = 0; i < 180; i++){
        predictData.push([StockInfoNums[i]["1. open"], StockInfoNums[i]["2. high"], StockInfoNums[i]["3. low"], StockInfoNums[i]["4. close"], StockInfoNums[i]["5. volume"]]);
    }
    console.log(predictData);
    var maxes = [0, 0, 0, 0, 0];
    var mins = [10000000, 10000000, 10000000, 10000000, 10000000];
    for(j = 0; j < 5; j++){
        for(i = 0; i < 180; i++){
            if (Number(predictData[i][j]) > maxes[j]){
                maxes[j] = Number(predictData[i][j]);
            }
            if (Number(predictData[i][j]) < mins[j]){
                mins[j] = Number(predictData[i][j]);
            }
        }
    }
    console.log(maxes);
    console.log(mins);
    
    for(j = 0; j < 5; j++){
        for(i = 0; i < 180; i++){
            predictData[i][j] = (Number(predictData[i][j])- mins[j]) / (maxes[j] - mins[j]);
        }
    }
    var predictedData = []
    const model = await tf.loadModel('https://storage.googleapis.com/bd-json-model/Stock%20JS%20model%205%20Outputs/model.json');
    console.log("model imported");
    for(i = 0; i < 90; i++){
        var tester = []
        for(j = 0; j < 90; j++){
            tester.push(predictData[i+j]);
        }
        predictedData.push(model.predict(tf.tensor(tester, [90,5]).expandDims(0)).dataSync());
    }
    for(i = 0; i < 90; i++){
        for(j = 1; j < 3; j++){
            predictedData[i][j] = predictedData[i][j]*(maxes[j] - mins[j]) + mins[j];
        }
    }
    
    console.log(predictedData);
    return "lol";
});

/*var jorge = fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=googl&outputsize=full&apikey=O91SB0IK1PJN0TXU")
    .then(resp => resp.json())
    .then(function(data){
        console.log(data);

        var totaldata = (data["Time Series (Daily)"]);
        console.log(totaldata);

        for (var x in data["Time Series (Daily)"]){
            StockInfoDate.push(x);
        }

        for (i = 0; i < 300; i++){
            StockInfoNums.push(totaldata[StockInfoDate[i]]);
        }
        console.log(StockInfoNums);

        for(i = 0; i < 300; i++){
            StockInfoLow.push(StockInfoNums[i]["3. low"]);
            StockInfoHigh.push(StockInfoNums[i]["2. high"]);
        }
        console.log(StockInfoHigh);

        for(i = 0; i < 90; i++){
            predictData.push([StockInfoNums[i]["1. open"], StockInfoNums[i]["2. high"], StockInfoNums[i]["3. low"], StockInfoNums[i]["4. close"], StockInfoNums[i]["5. volume"]]);
        }
        console.log(predictData);
    })
    .catch(function(error){
        console.log(error);
    });


async function loader(){
    console.log("loader reached");
    const model = await tf.loadModel('https://storage.googleapis.com/bd-json-model/Stock%20Predictor/Stock%20JS%20Model%202%20Outputs/model.json');
    console.log("model imported");
    model.predict(predictData).print();
    return model.predict(predictData);
}
var modeler = loader;

async function main(){
    await jorge()
        .then(conole.log("jorge"))
}
main();*/
//modeler.predict(predictData).print();