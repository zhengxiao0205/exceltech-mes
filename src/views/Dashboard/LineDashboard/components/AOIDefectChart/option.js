export const option = {
  color: ['#00A5BB', '#12DA8A', '#13B0EE', '#FF7026 '],
  series: [
    {
      type: 'pie',
      radius: [72, 94],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 2,
      },
      label: {
        color: 'inherit',
        fontSize: 14,
        formatter: '{b}: {c}%',
        fontWeight: 'bold',
      },
      data: [
        { value: 9, name: '缺件' },
        { value: 29, name: '文字错误' },
        { value: 22, name: '上锡不良' },
        { value: 40, name: '偏位' },
      ],
    },
  ],
}
