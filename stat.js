/* eslint-disable prefer-const, jsdoc/require-description */
// import * as Dashboards from '@highcharts/dashboards';
// left arrow
Highcharts.SVGRenderer.prototype.symbols.leftarrow = (x, y, w, h) => [
    'M', x + w / 2 - 1, y,
    'L', x + w / 2 - 1, y + h,
    x - w / 2 - 1, y + h / 2,
    'Z'
];
// right arrow
Highcharts.SVGRenderer.prototype.symbols.rightarrow = (x, y, w, h) => [
    'M', x + w / 2 + 1, y,
    'L', x + w / 2 + 1, y + h,
    x + w + w / 2 + 1, y + h / 2,
    'Z'
];

// const MathModifier = Dashboards.DataModifier.types.Math;

// const colorStopsDays = [
//     [0.0, '#C2CAEB'],
//     [1.0, '#162870']
// ];
const colorStopsTemperature = [
    [0.0, '#4CAFFE'],
    [0.3, '#53BB6C'],
    [0.5, '#DDCE16'],
    [0.6, '#DF7642'],
    [0.7, '#DD2323']
];

setupBoard();

async function setupBoard() {
    let activeCity = 'Inyo',
        activeColumn = 'O3',
        activeTimeRange = [Date.UTC(2022, 1, 1), Date.UTC(2022, 1, 31)],
        selectionTimeout = -1;

    // Initialize board with most basic data
    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'Range Selection',
                type: 'CSV',
                options: {
                    dataModifier: {
                        type: 'Range'
                    }
                }
            }, {
                id: 'county',
                type: 'CSV',
                options: {
                    csvURL: (
                        './chemical/ChemicalData.csv'
                    )
                }
            }]
        },
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                icon: (
                    'https://code.highcharts.com/gfx/dashboards-icons/menu.svg'
                ),
                items: [
                    'editMode',
                    {
                        id: 'dark-mode',
                        type: 'toggle',
                        text: 'Dark mode',
                        events: {
                            click: function () {
                                this.menu.editMode.board.container
                                    .classList.toggle('highcharts-dark');
                            }
                        }
                    }
                ]
            }
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'time-range-selector'
                    }]
                }, {
                    cells: [{
                        id: 'world-map'
                    }, {
                        id: 'kpi-layout',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'kpi-data',
                                    width: '2/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-SO2',
                                    width: '1/3',
                                    height: '204px'
                                }]
                            }, {
                                cells: [{
                                    id: 'kpi-O3',
                                    width: '1/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-NO2',
                                    width: '1/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-CO',
                                    width: '1/3',
                                    height: '204px'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        id: 'selection-grid'
                    }, {
                        id: 'city-chart'
                    }]
                }]
            }]
        },
        components: [{
            cell: 'time-range-selector',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    height: '80px',
                    type: 'spline'
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                tooltip: {
                    enabled: false
                },
                series: [{
                    name: 'Timeline',
                    data: [
                        [Date.UTC(2022, 1, 1), 0],
                        [Date.UTC(2022, 1, 31), 0]
                    ],
                    marker: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }],
                navigator: {
                    enabled: true,
                    handles: {
                        symbols: ['leftarrow', 'rightarrow'],
                        lineWidth: 0,
                        width: 8,
                        height: 14
                    },
                    series: [{
                        name: activeCity,
                        data: [],
                        animation: false,
                        animationLimit: 0
                    }],
                    xAxis: {
                        endOnTick: true,
                        gridZIndex: 4,
                        labels: {
                            x: 1,
                            y: 22
                        },
                        opposite: true,
                        showFirstLabel: true,
                        showLastLabel: true,
                        startOnTick: true,
                        tickPosition: 'inside'
                    },
                    yAxis: {
                        maxPadding: 0.5
                    }
                },
                scrollbar: {
                    enabled: true,
                    barBorderRadius: 0,
                    barBorderWidth: 0,
                    buttonBorderWidth: 0,
                    buttonBorderRadius: 0,
                    height: 14,
                    trackBorderWidth: 0,
                    trackBorderRadius: 0
                },
                xAxis: {
                    visible: false,
                    min: activeTimeRange[0],
                    max: activeTimeRange[1],
                    minRange: 10 * 24 * 3600 * 1000, // 10 days
                    maxRange: 365 * 24 * 3600 * 1000, // 1 years
                    events: {
                        afterSetExtremes: function (e) {
                            window.clearTimeout(selectionTimeout);
                            selectionTimeout = window.setTimeout(async () => {
                                if (
                                    activeTimeRange[0] !== e.min ||
                                    activeTimeRange[1] !== e.max
                                ) {
                                    activeTimeRange = [e.min, e.max];
                                    await updateBoard(
                                        board,
                                        activeCity,
                                        activeColumn
                                        , true
                                    );
                                }
                            }, 50);
                        }
                    }
                },
                yAxis: {
                    visible: false
                }
            }
        }, {
            cell: 'world-map',
            type: 'Highcharts',
            chartConstructor: 'mapChart',
            chartOptions: {
                chart: {
                    map: await fetch(
                        'California_county_Boundaries.geojson'
                    ).then(response => response.json()),
                    styledMode: true
                },
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: 1,
                    min: 0,
                    stops: colorStopsTemperature
                },
                legend: {
                    enabled: false
                },
                mapNavigation: {
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    },
                    enabled: true,
                    enableMouseWheelZoom: false
                },
                mapView: {
                    maxZoom: 15
                },
                series: [{
                    type: 'map',
                    name: 'World Map'
                }, {
                    type: 'mappoint',
                    name: 'county',
                    data: [],
                    animation: false,
                    animationLimit: 0,
                    allowPointSelect: true,
                    dataLabels: [{
                        align: 'left',
                        animation: false,
                        crop: false,
                        enabled: true,
                        format: '{point.name}',
                        padding: 0,
                        verticalAlign: 'top',
                        x: -2,
                        y: 2
                    }],
                    events: {
                        click: function (e) {
                            activeCity = e.point.name;
                            updateBoard(
                                board,
                                activeCity,
                                activeColumn
                                ,
                                true
                            );
                        }
                    },
                    marker: {
                        enabled: true,
                        lineWidth: 2,
                        radius: 12,
                        states: {
                            hover: {
                                lineWidthPlus: 4,
                                radiusPlus: 0
                            },
                            select: {
                                lineWidthPlus: 4,
                                radiusPlus: 0
                            }
                        },
                        symbol: 'mapmarker'
                    },
                    tooltip: {
                        footerFormat: '',
                        headerFormat: '',
                        pointFormat: (
                            '<b>{point.name}</b><br>'  +
                            '{point.y:.4f} ppm'
                        )
                    }
                }],
                title: {
                    text: void 0
                },
                tooltip: {
                    shape: 'rect',
                    distance: -60,
                    useHTML: true
                }
            }
        }, {
            cell: 'kpi-data',
            type: 'KPI',
            title: activeCity,
            value: null
        }, {
            cell: 'kpi-SO2',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.4f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'SO2',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 1,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 0.001,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'SO2';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn
                        ,
                        true
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-O3',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.4f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'O3',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 1,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 0.001,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'O3';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn
                        ,
                        true
                    );
                },
                afterLoad: function () {
                    this.cell.setActiveState();
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-NO2',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.4f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'NO2',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 1,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 0.001,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'NO2';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn
                        , true
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-CO',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.4f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'CO',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 1,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 0.001,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'CO';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn
                        ,
                        true
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'selection-grid',
            type: 'DataGrid',
            connector: {
                id: 'Range Selection'
            },
            sync: {
                highlight: true
            },
            dataGridOptions: {
                cellHeight: 38,
                editable: false,
                columns: {
                    time: {
                        show: false
                    },
                    SO2: {
                        headerFormat: 'SO2'
                    },
                    O3: {
                        headerFormat: 'O3'
                    },
                    NO2: {
                        headerFormat: 'NO2'
                    },
                    CO: {
                        headerFormat: 'CO'
                    }
                }
            },
            editable: true
        }, {
            cell: 'city-chart',
            type: 'Highcharts',
            connector: {
                id: 'Range Selection'
            },
            columnAssignment: {},
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    spacing: [40, 40, 40, 10],
                    styledMode: true,
                    type: 'spline',
                    animation: false,
                    animationLimit: 0
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: 50,
                    min: 0,
                    stops: colorStopsTemperature
                },
                series: [{
                    name: activeCity,
                    animation: false,
                    animationLimit: 0,
                    marker: {
                        enabledThreshold: 0.5
                    }
                }],
                title: {
                    margin: 20,
                    text: '',
                    x: 15,
                    y: 5
                },
                tooltip: {
                    enabled: true
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%e. %b'
                    }
                },
                yAxis: {
                    title: {
                        text: 'ppm'
                    }
                }
            }
        }]
    }, true);
    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('county');

    // Add city sources
    for (const row of citiesTable.getRowObjects()) {
        dataPool.setConnectorOptions({
            id: row.county,
            type: 'CSV',
            options: {
                csvURL: row.csv
            }
        });
    }

    // Load initial city
    await setupCity(board, activeCity, activeColumn );
    await updateBoard(board, activeCity, activeColumn , true);

    // Load additional cities
    for (const row of citiesTable.getRowObjects()) {
        if (row.county !== activeCity) {
            await setupCity(board, row.county, activeColumn );
        }
    }

    // Done
    console.log(board);
}

async function setupCity(board, city, column) {
    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('county');
    const cityTable = await dataPool.getConnectorTable(city);
    const time = board.mountedComponents[0].component.chart.axes[0].min;
    const worldMap = board.mountedComponents[1].component.chart.series[1];

    // column = (column[0] === 'T' ? column  : column);

    // Extend city table
    await cityTable.setModifier(new MathModifier({
        modifier: 'Math',
        columnFormulas: [{
            column: 'TNC',
            formula: 'E1-273.15' // E1 is the TN column with Kelvin values
        }, {
            column: 'TNF',
            formula: 'E1*1.8-459.67'
        }, {
            column: 'TXC',
            formula: 'F1-273.15' // F1 is the TX column with Kelvin values
        }, {
            column: 'TXF',
            formula: 'F1*1.8-459.67'
        }]
    }));
    cityTable.modified.setColumn(
        'Date',
        (cityTable.getColumn('time') || []).map(
            timestamp => new Date(timestamp)
                .toISOString()
                .substring(0, 10)
        )
    );

    const cityInfo = citiesTable.getRowObject(
        citiesTable.getRowIndexBy('county', city)
    );

    // Add city to world map
    worldMap.addPoint({
        lat: cityInfo.lat,
        lon: cityInfo.lon,
        name: city,
        y: cityTable.modified.getCellAsNumber(
            column,
            cityTable.getRowIndexBy('time', time)
        ) || Math.round((90 - Math.abs(cityInfo.lat)) / 3)
    });

}

async function updateBoard(board, city, column, newData) {
    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('county');
    const colorMin = 0;
    const colorMax = 1;
    const colorStops = (
            colorStopsTemperature 
    );
    const selectionTable = await dataPool.getConnectorTable('Range Selection');
    const [
        timeRangeSelector,
        worldMap,
        kpiData,
        kpiSO2,
        kpiO3,
        kpiNO2,
        kpiCO,
        selectionGrid,
        cityChart
    ] = board.mountedComponents.map(c => c.component);

    column = column ;

    let cityTable = await dataPool.getConnectorTable(city);

    if (newData) {
        // Update time range selector
        timeRangeSelector.chart.series[0].update({
            type: column[0] === 'T' ? 'spline' : 'column',
            data: cityTable.modified
                .getRows(void 0, void 0, ['time', column])
        });

        selectionTable.setColumns(cityTable.modified.getColumns(), 0);
    }

    // Update range selection
    const timeRangeMax = timeRangeSelector.chart.axes[0].max;
    const timeRangeMin = timeRangeSelector.chart.axes[0].min;
    const selectionModifier = selectionTable.getModifier();

    if (
        !selectionModifier.options.ranges[0] ||
        selectionModifier.options.ranges[0].maxValue !== timeRangeMax ||
        selectionModifier.options.ranges[0].minValue !== timeRangeMin
    ) {
        selectionModifier.options.ranges = [{
            column: 'time',
            maxValue: timeRangeMax,
            minValue: timeRangeMin
        }];
        await selectionTable.setModifier(selectionModifier);
    } else if (newData) {
        await selectionTable.setModifier(selectionTable.getModifier());
    }

    const rangeTable = selectionTable.modified;

    // Update world map
    worldMap.chart.update({
        colorAxis: {
            min: colorMin,
            max: colorMax,
            stops: colorStops
        }
    });
    (async () => {
        const dataPoints = worldMap.chart.series[1].data;
        const lastTime = rangeTable
            .getCellAsNumber('time', rangeTable.getRowCount() - 1);

        for (const point of dataPoints) {
            const pointTable = await dataPool.getConnectorTable(point.name);

            point.update({
                y: pointTable.modified.getCellAsNumber(
                    column,
                    pointTable.getRowIndexBy('time', lastTime)
                )
            });
        }
    })();

    // Update KPIs
    await kpiData.update({
        title: city
        
    });
    kpiSO2.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('SO2' , 0) || 0,
        true,
        true
    );
    kpiO3.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('O3' , 0) || 0,
        true,
        true
    );
    kpiNO2.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('NO2', 0) || 0,
        true,
        true
    );
    kpiCO.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('CO', 0) || 0,
        true,
        true
    );
   

    // Update city grid selection
    // const showCelsius = scale === 'C';
    // if (newData) {
    //     await selectionGrid.update({
    //         dataGridOptions: {
    //             columns: {
    //                 TNC: {
    //                     show: showCelsius
    //                 },
    //                 TNF: {
    //                     show: !showCelsius
    //                 },
    //                 TXC: {
    //                     show: showCelsius
    //                 },
    //                 TXF: {
    //                     show: !showCelsius
    //                 }
    //             }
    //         },
    //         columnAssignment: {
    //             time: 'x',
    //             FD: column === 'FD' ? 'y' : null,
    //             ID: column === 'CO' ? 'y' : null,
    //             RR1: column === 'NO2' ? 'y' : null,
    //             TN: null,
    //             TNC: column === 'TNC' ? 'y' : null,
    //             TNF: column === 'TNF' ? 'y' : null,
    //             TX: null,
    //             TXC: column === 'TXC' ? 'y' : null,
    //             TXF: column === 'TXF' ? 'y' : null,
    //             Date: null
    //         }
    //     });
    // }

    selectionGrid.dataGrid.scrollToRow(
        selectionTable.getRowIndexBy('time', rangeTable.getCell('time', 0))
    );

    // Update city chart selection
    await cityChart.update({
        columnAssignment: {
            time: 'x',
            SO2: column === 'SO2' ? 'y' : null,
            O3: column === 'O3' ? 'y' : null,
            NO2: column === 'NO2' ? 'y' : null,
            CO: column === 'CO' ? 'y' : null,
            Date: null
        },
        chartOptions: {
            chart: {
                type: column[0] === 'T' ? 'spline' : 'column'
            },
            colorAxis: {
                min: colorMin,
                max: colorMax,
                stops: colorStops
            }
        }
    });
}
/* eslint-disable prefer-const, jsdoc/require-description */

// left arrow
Highcharts.SVGRenderer.prototype.symbols.leftarrow = (x, y, w, h) => [
    'M', x + w / 2 - 1, y,
    'L', x + w / 2 - 1, y + h,
    x - w / 2 - 1, y + h / 2,
    'Z'
];
// right arrow
Highcharts.SVGRenderer.prototype.symbols.rightarrow = (x, y, w, h) => [
    'M', x + w / 2 + 1, y,
    'L', x + w / 2 + 1, y + h,
    x + w + w / 2 + 1, y + h / 2,
    'Z'
];

const MathModifier = Dashboards.DataModifier.types.Math;

const colorStopsDays = [
    [0.0, '#C2CAEB'],
    [1.0, '#162870']
];

// const colorStopsTemperature = [
//     [0.0, '#4CAFFE'],
//     [0.3, '#53BB6C'],
//     [0.5, '#DDCE16'],
//     [0.6, '#DF7642'],
//     [0.7, '#DD2323']
// ];

setupBoard();

async function setupBoard() {
    let activeCity = 'Inyo',
        activeColumn = 'O3',
        activeTimeRange = [Date.UTC(2022, 1, 1), Date.UTC(2022, 1, 31)],
        selectionTimeout = -1;

    // Initialize board with most basic data
    const board = await Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'Range Selection',
                type: 'CSV',
                options: {
                    dataModifier: {
                        type: 'Range'
                    }
                }
            }, {
                id: 'county',
                type: 'CSV',
                options: {
                    csvURL: (
                        'chemical/ChemicalData.csv'
                    )
                }
            }]
        },
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                icon: (
                    'https://code.highcharts.com/gfx/dashboards-icons/menu.svg'
                ),
                items: [
                    'editMode',
                    {
                        id: 'dark-mode',
                        type: 'toggle',
                        text: 'Dark mode',
                        events: {
                            click: function () {
                                this.menu.editMode.board.container
                                    .classList.toggle('highcharts-dark');
                            }
                        }
                    }
                ]
            }
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'time-range-selector'
                    }]
                }, {
                    cells: [{
                        id: 'world-map'
                    }, {
                        id: 'kpi-layout',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'kpi-data',
                                    width: '2/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-SO2',
                                    width: '1/3',
                                    height: '204px'
                                }]
                            }, {
                                cells: [{
                                    id: 'kpi-O3',
                                    width: '1/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-NO2',
                                    width: '1/3',
                                    height: '204px'
                                }, {
                                    id: 'kpi-CO',
                                    width: '1/3',
                                    height: '204px'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        id: 'selection-grid'
                    }, {
                        id: 'city-chart'
                    }]
                }]
            }]
        },
        components: [{
            cell: 'time-range-selector',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    height: '80px',
                    type: 'spline'
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                tooltip: {
                    enabled: false
                },
                series: [{
                    name: 'Timeline',
                    data: [
                        [Date.UTC(2022, 1, 1), 0],
                        [Date.UTC(2022, 12, 31), 0]
                    ],
                    marker: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }],
                navigator: {
                    enabled: true,
                    handles: {
                        symbols: ['leftarrow', 'rightarrow'],
                        lineWidth: 0,
                        width: 8,
                        height: 14
                    },
                    series: [{
                        name: activeCity,
                        data: [],
                        animation: false,
                        animationLimit: 0
                    }],
                    xAxis: {
                        endOnTick: true,
                        gridZIndex: 4,
                        labels: {
                            x: 1,
                            y: 22
                        },
                        opposite: true,
                        showFirstLabel: true,
                        showLastLabel: true,
                        startOnTick: true,
                        tickPosition: 'inside'
                    },
                    yAxis: {
                        maxPadding: 0.5
                    }
                },
                scrollbar: {
                    enabled: true,
                    barBorderRadius: 0,
                    barBorderWidth: 0,
                    buttonBorderWidth: 0,
                    buttonBorderRadius: 0,
                    height: 14,
                    trackBorderWidth: 0,
                    trackBorderRadius: 0
                },
                xAxis: {
                    visible: false,
                    min: activeTimeRange[0],
                    max: activeTimeRange[1],
                    minRange: 10 * 24 * 3600 * 1000, // 30 days
                    maxRange:  365 * 24 * 3600 * 1000, // 2 years
                    events: {
                        afterSetExtremes: function (e) {
                            window.clearTimeout(selectionTimeout);
                            selectionTimeout = window.setTimeout(async () => {
                                if (
                                    activeTimeRange[0] !== e.min ||
                                    activeTimeRange[1] !== e.max
                                ) {
                                    activeTimeRange = [e.min, e.max];
                                    await updateBoard(
                                        board,
                                        activeCity,
                                        activeColumn
                                        ,true
                                    );
                                }
                            }, 50);
                        }
                    }
                },
                yAxis: {
                    visible: false
                }
            }
        }, {
            cell: 'world-map',
            type: 'Highcharts',
            chartConstructor: 'mapChart',
            chartOptions: {
                chart: {
                    map: await fetch(
                        'California_county_Boundaries.geojson'
                    ).then(response => response.json()),
                    styledMode: true
                },
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: 50,
                    min: 0,
                    stops: colorStopsTemperature
                },
                legend: {
                    enabled: false
                },
                mapNavigation: {
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    },
                    enabled: true,
                    enableMouseWheelZoom: false
                },
                mapView: {
                    maxZoom: 15
                },
                series: [{
                    type: 'map',
                    name: 'World Map'
                }, {
                    type: 'mappoint',
                    name: 'county',
                    data: [],
                    animation: false,
                    animationLimit: 0,
                    allowPointSelect: true,
                    dataLabels: [{
                        align: 'left',
                        animation: false,
                        crop: false,
                        enabled: true,
                        format: '{point.name}',
                        padding: 0,
                        verticalAlign: 'top',
                        x: -2,
                        y: 2
                    }, {
                        animation: false,
                        crop: false,
                        enabled: true,
                        format: '{point.y:.4f}',
                        inside: true,
                        padding: 0,
                        verticalAlign: 'bottom',
                        y: -16
                    }],
                    events: {
                        click: function (e) {
                            activeCity = e.point.name;
                            updateBoard(
                                board,
                                activeCity,
                                activeColumn
                                ,
                                true
                            );
                        }
                    },
                    marker: {
                        enabled: true,
                        lineWidth: 2,
                        radius: 12,
                        states: {
                            hover: {
                                lineWidthPlus: 4,
                                radiusPlus: 0
                            },
                            select: {
                                lineWidthPlus: 4,
                                radiusPlus: 0
                            }
                        },
                        symbol: 'mapmarker'
                    },
                    tooltip: {
                        footerFormat: '',
                        headerFormat: '',
                        pointFormat: (
                            '<b>{point.name}</b><br>' +
                            '{point.y:.4f} ppm'
                        )
                    }
                }],
                title: {
                    text: void 0
                },
                tooltip: {
                    shape: 'rect',
                    distance: -60,
                    useHTML: true
                }
            }
        }, {
            cell: 'kpi-data',
            type: 'KPI',
            title: activeCity
        }, {
            cell: 'kpi-SO2',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.4f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'SO2',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 1,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 0.001,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'SO2';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn
                        ,
                        true
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-O3',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.4f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'O3',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 1,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 0.001,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'O3';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn
                        ,
                        true
                    );
                },
                afterLoad: function () {
                    this.cell.setActiveState();
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-NO2',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.4f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'NO2',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 1,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 0.001,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'NO2';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn,
                        true
                        
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-CO',
            type: 'KPI',
            chartOptions: {
                chart: {
                    height: 166,
                    margin: [8, 8, 16, 8],
                    spacing: [8, 8, 8, 8],
                    styledMode: true,
                    type: 'solidgauge'
                },
                pane: {
                    background: {
                        innerRadius: '90%',
                        outerRadius: '120%',
                        shape: 'arc'
                    },
                    center: ['50%', '70%'],
                    endAngle: 90,
                    startAngle: -90
                },
                series: [{
                    data: [0],
                    dataLabels: {
                        format: '{y:.4f}',
                        y: -34
                    },
                    animation: false,
                    animationLimit: 0,
                    enableMouseTracking: false,
                    innerRadius: '90%',
                    radius: '120%'
                }],
                title: {
                    margin: 0,
                    text: 'CO',
                    verticalAlign: 'bottom',
                    widthAdjust: 0
                },
                yAxis: {
                    labels: {
                        distance: 4,
                        y: 12
                    },
                    max: 1,
                    min: 0,
                    minorTickInterval: null,
                    stops: colorStopsDays,
                    tickAmount: 0.001,
                    visible: true
                }
            },
            events: {
                click: function () {
                    activeColumn = 'CO';
                    updateBoard(
                        board,
                        activeCity,
                        activeColumn
                        ,
                        true
                    );
                }
            },
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'selection-grid',
            type: 'DataGrid',
            connector: {
                id: 'Range Selection'
            },
            sync: {
                highlight: true
            },
            dataGridOptions: {
                cellHeight: 38,
                editable: false,
                columns: {
                    time: {
                        show: false
                    },
                    SO2: {
                        headerFormat: 'SO2'
                    },
                    O3: {
                        headerFormat: 'O3'
                    },
                    NO2: {
                        headerFormat: 'NO2'
                    },
                    CO: {
                        headerFormat: 'CO'
                    }
                }
            },
            editable: true
        }, {
            cell: 'city-chart',
            type: 'Highcharts',
            connector: {
                id: 'Range Selection'
            },
            columnAssignment: {},
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    spacing: [40, 40, 40, 10],
                    styledMode: true,
                    type: 'spline',
                    animation: false,
                    animationLimit: 0
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: 50,
                    min: 0,
                    stops: colorStopsTemperature
                },
                series: [{
                    name: activeCity,
                    animation: false,
                    animationLimit: 0,
                    marker: {
                        enabledThreshold: 0.5
                    }
                }],
                title: {
                    margin: 20,
                    text: '',
                    x: 15,
                    y: 5
                },
                tooltip: {
                    enabled: true
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%e. %b'
                    }
                },
                yAxis: {
                    title: {
                        text: 'ppm'
                    }
                }
            }
        }]
    }, true);
    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('county');

    // Add city sources
    for (const row of citiesTable.getRowObjects()) {
        dataPool.setConnectorOptions({
            id: row.county,
            type: 'CSV',
            options: {
                csvURL: row.csv
            }
        });
    }

    // Load initial city
    await setupCity(board, activeCity, activeColumn );
    await updateBoard(board, activeCity, activeColumn , true);

    // Load additional cities
    for (const row of citiesTable.getRowObjects()) {
        if (row.county !== activeCity) {
            await setupCity(board, row.county, activeColumn );
        }
    }

    // Done
    console.log(board);
}

async function setupCity(board, city, column) {
    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('county');
    const cityTable = await dataPool.getConnectorTable(city);
    const time = board.mountedComponents[0].component.chart.axes[0].min;
    const worldMap = board.mountedComponents[1].component.chart.series[1];

    // column = (column[0] === 'T' ? column  : column);

    // Extend city table
    // await cityTable.setModifier(new MathModifier({
    //     modifier: 'Math',
    //     columnFormulas: [{
    //         column: 'TNC',
    //         formula: 'E1-273.15' // E1 is the TN column with Kelvin values
    //     }, {
    //         column: 'TNF',
    //         formula: 'E1*1.8-459.67'
    //     }, {
    //         column: 'TXC',
    //         formula: 'F1-273.15' // F1 is the TX column with Kelvin values
    //     }, {
    //         column: 'TXF',
    //         formula: 'F1*1.8-459.67'
    //     }]
    // }));
    cityTable.modified.setColumn(
        'Date',
        (cityTable.getColumn('time') || []).map(
            timestamp => new Date(timestamp)
                .toISOString()
                .substring(0, 10)
        )
    );

    const cityInfo = citiesTable.getRowObject(
        citiesTable.getRowIndexBy('county', city)
    );

    // Add city to world map
    worldMap.addPoint({
        lat: cityInfo.lat,
        lon: cityInfo.lon,
        name: city,
        y: cityTable.modified.getCellAsNumber(
            column,
            cityTable.getRowIndexBy('time', time)
        ) || null
        //  Math.round((90 - Math.abs(cityInfo.lat)) / 3)
    });

}

async function updateBoard(board, city, column, newData) {
    const dataPool = board.dataPool;
    const citiesTable = await dataPool.getConnectorTable('county');
    const colorMin = 0;
    const colorMax = 1;
    const colorStops = (
            colorStopsTemperature 
    );
    const selectionTable = await dataPool.getConnectorTable('Range Selection');
    const [
        timeRangeSelector,
        worldMap,
        kpiData,
        kpiSO2,
        kpiO3,
        kpiNO2,
        kpiCO,
        selectionGrid,
        cityChart
    ] = board.mountedComponents.map(c => c.component);

    // column = (column[0] === 'T' ? column + scale : column);

    let cityTable = await dataPool.getConnectorTable(city);

    if (newData) {
        // Update time range selector
        timeRangeSelector.chart.series[0].update({
            type: column[0] === 'T' ? 'spline' : 'column',
            data: cityTable.modified
                .getRows(void 0, void 0, ['time', column])
        });

        selectionTable.setColumns(cityTable.modified.getColumns(), 0);
    }

    // Update range selection
    const timeRangeMax = timeRangeSelector.chart.axes[0].max;
    const timeRangeMin = timeRangeSelector.chart.axes[0].min;
    const selectionModifier = selectionTable.getModifier();

    if (
        !selectionModifier.options.ranges[0] ||
        selectionModifier.options.ranges[0].maxValue !== timeRangeMax ||
        selectionModifier.options.ranges[0].minValue !== timeRangeMin
    ) {
        selectionModifier.options.ranges = [{
            column: 'time',
            maxValue: timeRangeMax,
            minValue: timeRangeMin
        }];
        await selectionTable.setModifier(selectionModifier);
    } else if (newData) {
        await selectionTable.setModifier(selectionTable.getModifier());
    }

    const rangeTable = selectionTable.modified;

    // Update world map
    worldMap.chart.update({
        colorAxis: {
            min: colorMin,
            max: colorMax,
            stops: colorStops
        }
    });
    (async () => {
        const dataPoints = worldMap.chart.series[1].data;
        // console.log(worldMap.chart)
        const lastTime = rangeTable
            .getCellAsNumber('time', rangeTable.getRowCount() - 1);

        for (const point of dataPoints) {
            // console.log(point)
            const pointTable = await dataPool.getConnectorTable(point.name);

            point.update({
                y: pointTable.modified.getCellAsNumber(
                    column,
                    pointTable.getRowIndexBy('time', lastTime)
                )
            });
        }
    })();

    // Update KPIs
    await kpiData.update({
        title: city
        
    });
    kpiSO2.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('SO2' , 0) || 0,
        true,
        true
    );
    kpiO3.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('O3' , 0) || 0,
        true,
        true
    );
    kpiNO2.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('NO2', 0) || 0,
        true,
        true
    );
    kpiCO.chart.series[0].points[0].update(
        rangeTable.getCellAsNumber('CO', 0) || 0,
        true,
        true
    );

    // Update city grid selection
    // const showCelsius = scale === 'C';
    // if (newData) {
    //     await selectionGrid.update({
    //         dataGridOptions: {
    //             columns: {
    //                 TNC: {
    //                     show: showCelsius
    //                 },
    //                 TNF: {
    //                     show: !showCelsius
    //                 },
    //                 TXC: {
    //                     show: showCelsius
    //                 },
    //                 TXF: {
    //                     show: !showCelsius
    //                 }
    //             }
    //         },
    //         columnAssignment: {
    //             time: 'x',
    //             FD: column === 'FD' ? 'y' : null,
    //             ID: column === 'CO' ? 'y' : null,
    //             RR1: column === 'NO2' ? 'y' : null,
    //             TN: null,
    //             TNC: column === 'TNC' ? 'y' : null,
    //             TNF: column === 'TNF' ? 'y' : null,
    //             TX: null,
    //             TXC: column === 'TXC' ? 'y' : null,
    //             TXF: column === 'TXF' ? 'y' : null,
    //             Date: null
    //         }
    //     });
    // }

    selectionGrid.dataGrid.scrollToRow(
        selectionTable.getRowIndexBy('time', rangeTable.getCell('time', 0))
    );

    // Update city chart selection
    await cityChart.update({
        columnAssignment: {
            time: 'x',
            SO2: column === 'SO2' ? 'y' : null,
            O3: column === 'O3' ? 'y' : null,
            NO2: column === 'NO2' ? 'y' : null,
            CO: column === 'CO' ? 'y' : null,
            Date: null
        },
        chartOptions: {
            chart: {
                type: column[0] === 'T' ? 'spline' : 'column'
            },
            colorAxis: {
                min: colorMin,
                max: colorMax,
                stops: colorStops
            }
        }
    });
}
