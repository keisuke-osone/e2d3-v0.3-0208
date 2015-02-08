/**
サンプル用main.js
Window幅は、グローバル変数 windowSize を使用することができます
*/
var xMetrics = 'sunshine_duration';
var yMetrics = 'wind_speed';
var zMetrics = 'temperature';

// サイズの定義
var maxHeight = 400;
var maxWidth = windowSize;
var leftMargin = 50;
var topMargin = 50;
var bottomMargin = 50;
    
// 描画領域のサイズを設定
var height = maxHeight - topMargin - bottomMargin;
var width = maxWidth - leftMargin;
var r = 20;
    
// svgを追加
drawArea = d3.select('#e2d3-chart-area').append('svg')
    .attr('width', maxWidth)
    .attr('height', maxHeight)
    .append('g')
    .attr('transform', 'translate(' + leftMargin + ',' + topMargin + ')')


//Excelにデータがセットされた後、最初に呼ばれるメソッド（必須）
function e2d3Show(isUpdate) {

    //Excel上でのデータ変更イベントを補足（この場合はe2d3Updateメソッドをコールバックに指定）
    //"e2d3BindId"はグローバルな変数です
    if (isUpdate) {
        e2d3.bind2Json(e2d3BindId, { dimension: '2d' }, show);
    }else{              
        e2d3.addChangeEvent(e2d3BindId, e2d3Update, function () {
            //Excel上のバインド範囲のデータをjsonに変換（必須）。(この場合コールバックにshowメソッドを指定)
            e2d3.bind2Json(e2d3BindId, { dimension: '2d' }, show);
        });
    }
}
//データ変更時のコールバック用メソッド（必須）
function e2d3Update(responce) {
    console.log("e2d3Update :" + responce);
    e2d3Show(true);
}



//変換されたjsonデータを使ってグラフ描画
function show(data) {
    
    //dataは、bind2jsonで渡すdimensionオプションによって、整形されたJsonオブジェクトです。
    //描画は、#e2d3-chart-area 内にしてください。
        
    // UIからdata1とdata2の列名を取得する。
    
    // for debug
    //var currentData1Name = "sunshine_duration"
    //var currentData2Name = "wind_speed"
    var currentData1Name = "Fish_shellfish "
    var currentData2Name = "Meals_outside"
    var currentData3Name = "Electricity"
    
    xMetrics = currentData1Name;
    yMetrics = currentData2Name;
    zMetrics = currentData3Name;

    
    // UIからスライダーの位置を取得する。
    var currentIndex = 20;
    
        
        
    // 最大値の取得
    var xMax = d3.max(data, function (d) { return parseInt(d[xMetrics], 10) + 1})
    // 最小値の取得
    var xMin = d3.min(data, function (d) { return parseInt(d[xMetrics], 10)})

    // 最大値の取得
    var yMax = d3.max(data, function (d) { return parseInt(d[yMetrics], 10) + 1})
    // 最小値の取得
    var yMin = d3.min(data, function (d) { return d[yMetrics]})

    // 最大値の取得
    var zMax = d3.max(data, function (d) { return parseInt(d[zMetrics], 10) + 1})
    // 最小値の取得
    var zMin = d3.min(data, function (d) { return d[zMetrics]})

    

    // xのスケールの設定
    var xScale = d3.scale.linear()
                    .domain([xMin, xMax])
                    .range([0, width]);

    // yのスケールの設定
    var yScale = d3.scale.linear()
                    .domain([yMin, yMax])
                    .range([height, 0]);

    // yのスケールの設定
    var zScale = d3.scale.linear()
                    .domain([zMin, zMax])
                    .range([0, r]);

    // xの軸の設定
    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

    // yの軸の設定
    var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left');

    
    // x軸をsvgに表示
    drawArea
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - 1)+ ")")
        .call(xAxis);

    // y軸をsvgに表示
    drawArea
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis);
        
        
        
    // 散布図の描画
    drawArea
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .on('click', function (d) {
            alert(yMetrics + d[yMetrics])
        })
        //.on('mouseover', function (d) {
        //    d3.select(this)
        //        .attr('fill', 'orange')
        //})
        //.on('mouseout', function (d) {
        //    d3.select(this)
        //        .attr('fill', 'red');
        //})
        .attr('fill', '#f00')
        .attr('r', function (d, i) {
            if (i === currentIndex) {
                d3.select(this).attr('fill', 'orange'); 
                return 10;
            } else {
                return 5;
            }
        })
        .attr('cx', function (d) {
            return xScale(d[xMetrics]);
        })        
        .attr('cy', function (d) {
            return yScale(d[yMetrics])
        })
        .transition()
        .duration(1000)
        .delay(function(d, i) {
            return  i * 20;
        })
        .ease('bounce')
        //.attr('r', function(d, i) {
        //    return zScale(d[zMetrics])
        //});
        
    

    // 選択された行のデータを描画
    /*
    drawArea
        .selectAll('circle')
        .data([{
            'x': data[1][5],
            'y': data[2][5]
            }])
        .enter()
        .append('circle')
        .on('click', function (d) {
            alert(yMetrics + d[yMetrics])
        })
        .on('mouseover', function (d) {
            d3.select(this)
                .attr('fill', 'orange')
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .attr('fill', 'red');
        })
        .attr('fill', '#f00')
        .attr('r', 0)
        .attr('cx', function (d) {
            return xScale(x);
        })        
        .attr('cy', function (d) {
            return yScale(y)
        })
        .transition()
        .duration(1000)
        .delay(function(d, i) {
            return  i * 20;
        })
        .ease('bounce')
        .attr('r', function(d, i) {
            return zScale(d[zMetrics])
        });
        */

        
}


