import si from 'systeminformation';
import contrib from 'blessed-contrib';
import { formatBytesToReadable } from './../../utils/tool.js';

// 定义图表组件类型
type ChartType = contrib.Widgets.PictureElement;

/**
 * 网络监控类
 * 用于实时监控网络接收数据并以图表形式显示
 */
class NetMonitor {
  // 声明图表组件实例
  sparkline: ChartType;

  // 定时器引用，用于清理定时任务
  interval: NodeJS.Timeout | null = null;
  // 存储网络数据的数组，保存最近60秒的数据
  netData: number[] = [];

  constructor(line: ChartType) {
    this.sparkline = line;
  }

  /**
   * 初始化网络监控
   * 创建初始数据并启动定时监控任务
   */
  init() {
    // 初始化60个数据点，全部填充为0
    this.netData = Array(60).fill(0);

    // 获取默认网络接口
    si.networkInterfaceDefault((iface) => {
      // 定义更新函数
      const updater = () => {
        // 获取指定网络接口的统计数据
        si.networkStats(iface, (data) => {
          this.updateData(data[0]);
        });
      };

      // 立即执行一次更新
      updater();

      // 设置1秒间隔的定时更新
      this.interval = setInterval(updater, 1000);
    });
  }

  /**
   * 更新网络数据并刷新显示
   * @param data 网络统计数据对象
   */
  updateData(data: si.Systeminformation.NetworkStatsData) {
    // 获取每秒接收的字节数，确保不为负数
    const rx_sec = Math.max(0, data['rx_sec']);

    // 移除最旧的数据点并添加新数据点
    this.netData.shift();
    this.netData.push(rx_sec);

    // 构建显示标签，包含当前接收速率和总接收量
    const rx_label = `Receiving:      ${formatBytesToReadable(rx_sec)}\nTotal received: ${formatBytesToReadable(data['rx_bytes'])}`;

    // 更新图表数据
    this.sparkline.setData([rx_label], [this.netData]);
    // 重新渲染屏幕
    this.sparkline.screen.render();
  }
}

export default NetMonitor;
