import {Bar} from 'cli-progress'
import pColor from 'picocolors'


// create new progress bar
const b1 = new Bar({
  format: 'CLI Progress |' + pColor.redBright('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});


const total = 200;

// initialize the bar - defining payload token "speed" with the default value "N/A"
b1.start(total, 0, {
  speed: "N/A"
});

// update values
b1.increment();

let curNum = 0
const timer = setInterval(() => {
  curNum += 2

  if (curNum >200) {
    clearInterval(timer)
    b1.stop();
  }

  b1.update(curNum, {speed: curNum});

}, 100)

