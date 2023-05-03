import { chartPrimaryColor, chartWarningColor } from '@/constant/color'

export const smtOption = {
  animationDuration: 500,
  min: 0,
  max: 80,
  xAxis: {
    data: ['Line1', 'Line2', 'Line3', 'Line4', 'Line5'],
    axisTick: { show: false },
    axisLabel: {
      color: '#fff',
    },
  },
  yAxis: {
    axisLine: { show: true },
    splitLine: false,
    axisLabel: {
      color: '#fff',
    },
  },
  grid: {
    bottom: 28,
    left: 68,
    top: 20,
  },
  series: [
    {
      name: '产品不良PPM',
      type: 'bar',
      color: '#0780cf',
      data: [63, 31, 72, 58, 40],
      barWidth: '36',
      itemStyle: {
        color: ({ data }) => {
          if (data > 70) {
            // 警告配色
            return chartWarningColor
          } else {
            // 安全配色
            return chartPrimaryColor
          }
        },
        borderRadius: 4,
      },
      label: {
        show: true, //开启显示
        fontSize: 16,
        color: '#fff',
      },
    },
  ],
}

export const lineOption = {
  animationDuration: 500,
  series: [
    {
      type: 'gauge',
      radius: '132%',
      center: ['50%', '84%'],
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 80,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 8,
          color: [
            [0.875, '#41D9E7'],
            [1, '#fd666d'],
          ],
        },
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '24%',
        width: 18,
        offsetCenter: [0, '-56%'],
        itemStyle: {
          color: 'inherit',
        },
      },
      axisTick: {
        distance: 5,
        length: 8,
        lineStyle: {
          color: '#fff',
          width: 2,
        },
      },
      splitLine: {
        distance: 5,
        length: 16,
        lineStyle: {
          color: '#fff',
          width: 4,
        },
      },
      axisLabel: {
        color: '#fff',
        distance: -60,
        fontSize: 16,
      },
      detail: {
        valueAnimation: true,
        color: 'inherit',
        offsetCenter: [0, '-10%'],
        fontSize: 36,
      },
      data: [53],
    },
  ],
}
