async function main() {
    const response = await fetch('https://api.twelvedata.com/time_series?apikey=3bd59f19f202414b9a96ba143a8a2b49&interval=1day&symbol=BNTX,GME,MSFT,DIS&outputsize=30')
    const data = await response.json()
    const {BNTX, GME, MSFT, DIS} = data
    const stocks = [BNTX, GME, MSFT, DIS]
    stocks.forEach(stock => stock.values.reverse())
    
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    //Time Chart
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map(stock => ({
                label: stock.meta.symbol,
                backgroundColor: assignColor(stock.meta.symbol),
                borderColor: assignColor(stock.meta.symbol),
                data: stock.values.map(value => parseFloat(value.high))
            }))
        }
    })

     // High Chart
     new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Highest price for last 30 trading days.', 
                backgroundColor: stocks.map(stock => (
                    assignColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    assignColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    findHighest(stock.values)
                ))
            }]
        }
    })

    // Average Chart
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Average',
                backgroundColor: stocks.map(stock => (
                    assignColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    assignColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    calculateAverage(stock.values)
                ))
            }]
        }
    });
}

//Assigning Colors
let assignColor = (stock) => {
    if(stock === 'BNTX') {
        return 'rgba(61, 161, 61, 1)'
    }
    if(stock === 'GME') {
        return 'rgba(209, 4, 25, 1)'
    }
    if(stock === 'MSFT') {
        return 'rgba(18, 4, 209, 1)'
    }
    if(stock === 'DIS') {
        return 'rgba(166, 43, 158, 1)'
    }
}

//Math Functions
let findHighest = (values) => {
    let highest = 0;
    values.forEach(value => {
        if (parseFloat(value.high) > highest) {
            highest = value.high
        }
    })
    return highest
}

let calculateAverage = (values) => {
    let total = 0;
    values.forEach(value => {
        total += parseFloat(value.high)
    })
    return total / values.length
}

main()