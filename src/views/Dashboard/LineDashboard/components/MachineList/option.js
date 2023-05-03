export const option = {
  title: {
    text: 'SPI Pass Rate',
    left: 'center',
    top: 12,
    textStyle: {
      fontSize: 24,
      color: '#c7c7d9',
    },
  },
  grid: {
    bottom: 48,
    left: 68,
    top: 60,
    right: 16,
  },
  xAxis: {
    type: 'time',
    axisLabel: {
      fontSize: 18,
      color: '#c7c7d9',
    },
    axisLine: {
      lineStyle: {
        color: '#c7c7d9',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        opacity: 0.4,
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} %',
      fontSize: 18,
      color: '#c7c7d9',
    },
    splitLine: {
      show: true,
      lineStyle: {
        opacity: 0.4,
      },
    },
  },
  series: [
    {
      type: 'line',
      data: [],
      color: '#00F88D',
      showSymbol: false,
    },
  ],
}
