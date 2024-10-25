import ansiEscapes from 'ansi-escapes';

// 定义表示二维坐标的接口
export interface Position {
  x: number; // x坐标
  y: number; // y坐标
}

// 定义抽象基础UI类
export abstract class BaseUi {
  // 定义标准输出流
  private readonly stdout: NodeJS.WriteStream = process.stdout;

  // 在控制台打印文本
  protected print(text: string) {
    process.stdout.write.bind(process.stdout)(text);
  }

  // 将光标移动到指定位置
  protected setCursorAt({ x, y }: Position) {
    this.print(ansiEscapes.cursorTo(x, y));
  }

  // 在指定位置打印消息
  protected printAt(message: string, position: Position) {
    this.setCursorAt(position);
    this.print(message);
  }

  // 清除指定行的内容
  protected clearLine(row: number) {
    this.printAt(ansiEscapes.eraseLine, { x: 0, y: row });
  }

  // 获取终端大小
  get terminalSize(): { columns: number; rows: number } {
    return {
      columns: this.stdout.columns, // 终端列数
      rows: this.stdout.rows // 终端行数
    };
  }

  // 抽象方法：渲染UI
  abstract render(): void;
}
