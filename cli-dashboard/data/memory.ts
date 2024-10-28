// 导入系统信息和UI组件库
import si from 'systeminformation';
import contrib from 'blessed-contrib';

// 定义图表使用的颜色数组
const colors = ['magenta', 'cyan', 'blue', 'yellow', 'green', 'red'];

// 定义图表组件类型
type ChartType = contrib.Widgets.PictureElement;

// 定义内存数据结构接口
type MemData = {
  title: string; // 数据标题
  style: {
    line: string; // 线条颜色
  };
  x: number[]; // X轴数据点
  y: number[]; // Y轴数据点
};

class MemoryMonitor {
  lineChart: ChartType; // 折线图组件
  memDonut: ChartType; // 内存环形图组件
  swapDonut: ChartType; // 交换分区环形图组件

  interval: NodeJS.Timeout | null = null; // 定时器引用
  memData: MemData[] = []; // 内存数据数组

  constructor(line: ChartType, memDonut: ChartType, swapDonut: ChartType) {
    this.lineChart = line;
    this.memDonut = memDonut;
    this.swapDonut = swapDonut;
  }

  // 初始化监控器
  init() {
    // 获取初始内存数据
    si.mem((data) => {
      // 初始化数据结构，包含内存和交换分区两组数据
      this.memData = [
        {
          title: 'Memory',
          style: { line: colors[0] },
          // 创建60个点的X轴数据(60-1)
          x: Array(60)
            .fill(0)
            .map((_, i) => 60 - i),
          // 初始Y轴数据全部为0
          y: Array(60).fill(0)
        },
        {
          title: 'Swap',
          style: { line: colors[1] },
          x: Array(60)
            .fill(0)
            .map((_, i) => 60 - i),
          y: Array(60).fill(0)
        }
      ];

      this.updateData(data);

      // 设置1秒间隔的数据更新定时器
      this.interval = setInterval(() => {
        si.mem((data) => {
          this.updateData(data);
        });
      }, 1000);
    });
  }

  // 更新图表数据
  updateData(data: si.Systeminformation.MemData) {
    // 计算内存使用百分比
    let memPer = +(100 * (1 - data.available / data.total)).toFixed();
    // 计算交换分区使用百分比
    let swapPer = +(100 * (1 - data.swapfree / data.swaptotal)).toFixed();

    // 处理交换分区不存在的情况
    swapPer = isNaN(swapPer) ? 0 : swapPer;

    // 更新折线图数据
    // 移除最老的数据点并添加新数据点
    this.memData[0].y.shift();
    this.memData[0].y.push(memPer);

    this.memData[1].y.shift();
    this.memData[1].y.push(swapPer);

    // 更新折线图显示
    this.lineChart.setData(this.memData);

    // 更新内存环形图
    this.memDonut.setData([
      {
        percent: memPer / 100,
        label: '',
        color: colors[0]
      }
    ]);

    // 更新交换分区环形图
    this.swapDonut.setData([
      {
        percent: swapPer / 100,
        label: '',
        color: colors[1]
      }
    ]);

    // 重新渲染屏幕
    this.lineChart.screen.render();
  }

  clearTimer() {
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}

export default MemoryMonitor;
