import si from 'systeminformation';
import contrib from 'blessed-contrib';
import { clearTimeout } from 'timers';
import { formatBytesToGB } from '../../utils/tool.js';

type ChartType = contrib.Widgets.PictureElement;

type FsSizeData = si.Systeminformation.FsSizeData;

class DiskMonitor {
  donut: ChartType;

  interval: NodeJS.Timeout | null = null;
  netData: number[] = [];

  constructor(donut: ChartType) {
    this.donut = donut;
  }

  init() {
    const updater = () => {
      si.fsSize('', (data) => {
        this.updateData(data);
      });
    };
    updater();

    this.interval = setInterval(updater, 10000);
  }

  updateData(data: FsSizeData[]) {
    const disk = data[0];

    this.donut.setData([
      {
        percent: disk.use / 100,
        label: `${formatBytesToGB(disk.used)} of ${formatBytesToGB(disk.size)}`,
        color: 'green'
      }
    ]);
    this.donut.screen.render();
  }

  clearTimer() {
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}

export default DiskMonitor;
