import { BaseUi } from './base-ui.js';
import pColor from 'picocolors';

// ScrollList 类继承自 BaseUi,用于实现可滚动的列表界面
export class ScrollList extends BaseUi {
  curSeletecIndex = 0; // 当前选中项的索引
  scrollTop = 0; // 滚动条顶部位置

  constructor(private list: Array<string> = []) {
    super();
    this.render(); // 构造函数中调用 render 方法初始化渲染
  }

  // 处理键盘输入
  onKeyInput(name: string) {
    if (name !== 'up' && name !== 'down') {
      return;
    }

    const action: Function = this.KEYS[name];
    action();
    this.render(); // 每次操作后重新渲染
  }

  // 定义键盘操作映射
  private readonly KEYS = {
    up: () => this.cursorUp(),
    down: () => this.cursorDown()
  };

  // 光标向上移动
  cursorUp() {
    this.moveCursor(-1);
  }

  // 光标向下移动
  cursorDown() {
    this.moveCursor(1);
  }

  // 移动光标的核心方法
  private moveCursor(index: number): void {
    this.curSeletecIndex += index;

    // 确保光标不会超出列表范围
    if (this.curSeletecIndex < 0) {
      this.curSeletecIndex = 0;
    }

    if (this.curSeletecIndex >= this.list.length) {
      this.curSeletecIndex = this.list.length - 1;
    }

    this.fitScroll(); // 调整滚动位置
  }

  // 调整滚动位置,确保选中项在可视区域内
  fitScroll() {
    const shouldScrollUp = this.curSeletecIndex < this.scrollTop;

    const shouldScrollDown =
      this.curSeletecIndex > this.scrollTop + this.terminalSize.rows - 2;

    if (shouldScrollUp) {
      this.scrollTop -= 1;
    }

    if (shouldScrollDown) {
      this.scrollTop += 1;
    }

    this.clear(); // 清空屏幕,准备重新渲染
  }

  // 清空整个屏幕
  clear() {
    for (let row = 0; row < this.terminalSize.rows; row++) {
      this.clearLine(row);
    }
  }

  // 为选中行添加背景色
  bgRow(text: string) {
    return pColor.bgBlue(
      pColor.red(text) + ' '.repeat(this.terminalSize.columns - text.length)
    );
  }

  // 渲染列表
  render() {
    // 获取当前可见的列表项
    const visibleList = this.list.slice(
      this.scrollTop,
      this.scrollTop + this.terminalSize.rows
    );

    visibleList.forEach((item: string, index: number) => {
      const row = index;

      this.clearLine(row);

      let content = item;

      // 如果是当前选中项,添加背景色
      if (this.curSeletecIndex === this.scrollTop + index) {
        content = this.bgRow(content);
      }

      // 在指定位置打印内容
      this.printAt(content, {
        x: 0,
        y: row
      });
    });
  }
}
