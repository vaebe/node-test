import si from 'systeminformation';
import contrib from 'blessed-contrib';

// 定义排序字段映射关系
// p: 按进程ID排序
// c: 按CPU使用率排序
// m: 按内存使用率排序
const parts: Record<string, any> = {
  p: 'pid',
  c: 'cpu',
  m: 'mem'
};

/**
 * 进程监控类
 * 用于实时监控并显示系统进程信息
 */
class ProcessMonitor {
  // blessed-contrib 表格组件实例
  table: contrib.Widgets.TableElement;

  // 定时器引用,用于清除定时刷新
  interval: NodeJS.Timeout | null = null;

  // 当前排序字段,默认按CPU使用率排序
  pSort: string = parts.c;
  // 是否需要重置表格选中行
  reIndex: boolean = false;
  // 排序方向(true为升序,false为降序)
  reverse: boolean = false;

  constructor(table: contrib.widget.Table) {
    this.table = table;
  }

  /**
   * 初始化监控
   * 设置定时刷新和键盘事件监听
   */
  init() {
    const updater = () => {
      // 获取系统进程信息
      si.processes((data) => {
        this.updateData(data);
      });
    };

    // 立即执行一次更新
    updater();

    // 设置3秒定时刷新
    this.interval = setInterval(updater, 3000);

    // 监听键盘事件,处理排序变更
    // m: 按内存排序
    // c: 按CPU排序
    // p: 按PID排序
    this.table.screen.key(['m', 'c', 'p'], (ch) => {
      // 如果点击当前排序字段,则切换排序方向
      if (parts[ch] == this.pSort) {
        this.reverse = !this.reverse;
      } else {
        // 否则切换排序字段
        this.pSort = parts[ch] || this.pSort;
      }

      // 标记需要重置选中行
      this.reIndex = true;
      updater();
    });
  }

  /**
   * 更新进程数据显示
   * @param data 系统进程信息
   */
  updateData(data: si.Systeminformation.ProcessesData) {
    const part = this.pSort;

    // 对进程列表进行排序和格式化
    const list = data.list
      .sort(function (a: any, b: any) {
        return b[part] - a[part];
      })
      .map((p) => {
        return [
          p.pid + '', // 进程ID
          p.command, // 进程命令
          ' ' + p.cpu.toFixed(1), // CPU使用率(保留1位小数)
          p.mem.toFixed(1) // 内存使用率(保留1位小数)
        ];
      });

    // 表格标题
    var headers = ['PID', 'Command', '%CPU', '%MEM'];

    // 获取当前排序字段对应的列索引
    const position = {
      pid: 0,
      cpu: 2,
      mem: 3
    }[this.pSort]!;

    // 在排序列标题添加排序方向指示器
    headers[position] += this.reverse ? '▲' : '▼';

    // 更新表格数据
    this.table.setData({
      headers: headers,
      data: this.reverse ? list.reverse() : list
    });

    // 如果需要重置选中行,则选中第一行
    if (this.reIndex) {
      (this.table as any).rows.select(0);
      this.reIndex = false;
    }

    // 重新渲染屏幕
    this.table.screen.render();
  }
}

export default ProcessMonitor;
