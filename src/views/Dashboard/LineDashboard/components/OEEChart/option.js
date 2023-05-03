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
        offsetCenter: [0, 0],
        fontWeight: 'bolder',
        formatter: ['{title|OEE}', '{percent|{value}%}'].join('\n'),
        rich: {
          title: {
            color: '#c7c7d9',
            fontSize: 26,
            lineHeight: 72,
          },
          percent: {
            color: 'inherit',
            fontSize: 36,
          },
        },
      },
      data: [
        {
          value: 96,
        },
      ],
    },
  ],
}
