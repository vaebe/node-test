import ansiEscapes from 'ansi-escapes';
import { EOL } from 'os';

// 获取标准输出的写入方法
const write = process.stdout.write.bind(process.stdout);

/**
 * ProgressBar 类用于在命令行界面中创建和管理进度条
 */
export class ProgressBar {
  total: number = 0; // 进度条的总值
  value: number = 0; // 当前进度值

  constructor() {}

  /**
   * 启动进度条
   * @param total 进度条的总值
   * @param initValue 初始进度值
   */
  start(total: number, initValue: number) {
    this.total = total;
    this.value = initValue;

    // 隐藏光标并保存当前光标位置
    write(ansiEscapes.cursorHide);
    write(ansiEscapes.cursorSavePosition);

    this.render();
  }

  /**
   * 渲染进度条
   */
  render() {
    // 计算进度比例
    let progress = this.value / this.total;

    // 确保进度在 0 到 1 之间
    if (progress < 0) {
      progress = 0;
    } else if (progress > 1) {
      progress = 1;
      this.value = this.total;
    }

    const barSize = 40; // 进度条的总长度

    // 计算已完成和未完成部分的长度
    const completeSize = Math.floor(progress * barSize);
    const incompleteSize = barSize - completeSize;

    // 恢复光标位置
    write(ansiEscapes.cursorRestorePosition);

    // 绘制进度条
    write('█'.repeat(completeSize)); // 已完成部分
    write('░'.repeat(incompleteSize)); // 未完成部分
    write(` ${this.value} / ${this.total}`); // 显示具体数值
  }

  /**
   * 更新进度条的当前值
   * @param value 新的进度值
   */
  update(value: number) {
    this.value = value;
    this.render();
  }

  /**
   * 获取进度条的总值
   * @returns 进度条的总值
   */
  getTotalSize() {
    return this.total;
  }

  /**
   * 停止进度条显示
   */
  stop() {
    write(ansiEscapes.cursorShow); // 显示光标
    write(EOL); // 添加换行符
  }
}
