export const option = {
  series: [
    {
      type: 'gauge',
      center: ['50%', '50%'],
      radius: '94%',
      startAngle: 270,
      endAngle: -90,
      itemStyle: {
        color: '#85CA21',
      },
      progress: {
        show: true,
        width: 20,
      },
      pointer: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          width: 20,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      detail: {
        valueAnimation: true,
        width: '60%',
        lineHeight: 40,
        borderRadius: 8,
        offsetCenter: [0, '5%'],
        fontWeight: 'bolder',
        formatter: ['{percent|{value}%}', '{number|312/600}'].join('\n'),
        rich: {
          percent: {
            color: 'inherit',
            fontSize: 40,
            lineHeight: 60,
          },
          number: {
            color: '#c7c7d9',
            fontSize: 24,
          },
        },
      },
      data: [
        {
          value: 52,
        },
      ],
    },
  ],
}
