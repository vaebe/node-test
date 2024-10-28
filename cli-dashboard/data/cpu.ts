// 导入系统信息和终端UI组件库
import si from 'systeminformation';
import contrib from 'blessed-contrib';

// 定义CPU图表的颜色数组
const colors = ['magenta', 'cyan', 'blue', 'yellow', 'green', 'red'];

// 定义CPU数据的类型接口
type CpuData = {
  title: string; // CPU标题
  style: {
    line: string; // 线条颜色
  };
  x: number[]; // X轴数据点
  y: number[]; // Y轴数据点（CPU负载值）
};

class CpuMonitor {
  lineChart: contrib.Widgets.PictureElement; // 线图组件实例
  cpuData: CpuData[] = []; // 存储所有CPU的数据
  interval: NodeJS.Timeout | null = null; // 定时器引用

  constructor(line: contrib.Widgets.PictureElement) {
    this.lineChart = line;
  }

  // 初始化CPU监控
  init() {
    // 获取初始CPU数据
    si.currentLoad((data) => {
      // 为每个CPU核心创建数据结构
      this.cpuData = data.cpus.map((cpu, i) => {
        return {
          title: 'CPU' + (i + 1),
          style: {
            line: colors[i % colors.length] // 循环使用颜色
          },
          x: Array(60) // 创建60个时间点
            .fill(0)
            .map((_, i) => 60 - i),
          y: Array(60).fill(0) // 初始化负载数据为0
        };
      });

      this.updateData(data);

      // 每秒更新一次CPU数据
      this.interval = setInterval(() => {
        si.currentLoad((data) => {
          this.updateData(data);
        });
      }, 1000);
    });
  }

  // 更新CPU数据并重新渲染图表
  updateData(data: si.Systeminformation.CurrentLoadData) {
    data.cpus.forEach((cpu, i) => {
      // 格式化CPU负载显示字符串
      let loadString = cpu.load.toFixed(1).toString();

      // 补充空格使负载值对齐
      while (loadString.length < 6) {
        loadString = ' ' + loadString;
      }
      loadString = loadString + '%';

      // 更新标题和负载数据
      this.cpuData[i].title = 'CPU' + (i + 1) + loadString;
      this.cpuData[i].y.shift(); // 移除最旧的数据点
      this.cpuData[i].y.push(cpu.load); // 添加最新的数据点
    });

    // 更新图表并重新渲染
    this.lineChart.setData(this.cpuData);
    this.lineChart.screen.render();
  }

  clearTimer() {
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}

export default CpuMonitor;
