import si from 'systeminformation';
import contrib from 'blessed-contrib';
import { clearTimeout } from 'timers';

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

    const label = formatSize(disk.used) + ' of ' + formatSize(disk.size);

    this.donut.setData([
      {
        percent: disk.use / 100,
        label: label,
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

function formatSize(bytes: number) {
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

export default DiskMonitor;
