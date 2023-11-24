
function setReminder(interval) {
  chrome.storage.sync.set({ 'interval': parseInt(interval) }, function () {
    console.log(`set reminder interval to ${interval}`);

    const now = new Date();
    const nextReminder = new Date(now.getTime() + interval * 60000);
    setNextReminder(nextReminder.getTime())

    chrome.notifications.create('setReminder', {
      type: 'basic',
      iconUrl: 'icon.png',
      title: chrome.i18n.getMessage('messageTitle') + chrome.i18n.getMessage('setting'),
      message: chrome.i18n.getMessage('successApplyMessage') + ` ${interval} ` + chrome.i18n.getMessage('minute') + `\n${chrome.i18n.getMessage('nextReminder')}: ${nextReminder.toLocaleTimeString()}`
    });
  });
}

document.querySelectorAll('[data-locale]').forEach(elem => {
  elem.innerText = chrome.i18n.getMessage(elem.dataset.locale)
})

chrome.storage.sync.get(['interval', 'restInterval'], (data) => {
  document.getElementById('interval').value = data.interval || 60;
  document.getElementById('restInterval').value = data.restInterval || 5;
})

document.getElementById('reminderButton').addEventListener('click', function () {
  const intervalInput = document.getElementById('interval');
  const intervalValue = parseInt(intervalInput.value);

  if (isNaN(intervalValue) || intervalValue < parseInt(intervalInput.min) || intervalValue % parseInt(intervalInput.step) !== 0) {
    alert(`input must great than ${intervalInput.min}, step must be ${intervalInput.step}`);
    return;
  }

  setReminder(intervalValue);
});

document.getElementById('restButton').addEventListener('click', function () {
  console.log("xxxx")

  const restInput = document.getElementById('restInterval');
  const restValue = parseInt(restInput.value);

  if (isNaN(restValue) || restValue < parseInt(restInput.min) || restValue > parseInt(restInput.max)) {
    alert(`input must great than ${restInput.min}, less than ${restInput.max}`);
    return;
  }

  chrome.storage.sync.set({ 'restInterval': restValue }, function () {
    console.log(`set rest interval to ${restValue}`);
    chrome.notifications.create('setRest', {
      type: 'basic',
      iconUrl: 'icon.png',
      title: chrome.i18n.getMessage('messageTitle') + chrome.i18n.getMessage('setting'),
      message: chrome.i18n.getMessage('setRestIntervalContent') + ` ${restValue} ` + chrome.i18n.getMessage('minute')
    });
  })
});

document.getElementById('testReminder').addEventListener('click', function () {
  chrome.notifications.create('testNotification', {
    type: 'basic',
    iconUrl: 'icon.png',
    title: chrome.i18n.getMessage('messageTitle'),
    message: chrome.i18n.getMessage('testMessage')
  });
});

function setNextReminder(next) {
  const now = new Date();
  const minutesRemaining = Math.round((next - now.getTime()) / 60000);
  let text = `${minutesRemaining} ${chrome.i18n.getMessage('minutesLater')}`
  if (minutesRemaining < 1) {
    text = chrome.i18n.getMessage('remindSoon')
  }
  document.getElementById('nextReminderTime').textContent = text;
}

function setLastReminder(val) {
  document.getElementById('lastReminderTime').textContent = val;
}

function setSkipTimes(val) {
  document.getElementById('skipTimes').textContent = val;
}

chrome.storage.sync.get(['lastReminder', 'nextReminder', 'skipTimes'], function (data) {
  const lastReminderTime = data.lastReminder || 'NaN';
  const nextReminder = data.nextReminder;
  const skipTimes = data.skipTimes || 0;

  setLastReminder(lastReminderTime);
  setNextReminder(nextReminder);
  setSkipTimes(skipTimes);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'sync') {
    if (changes.lastReminderTime) {
      const newVal = changes.lastReminderTime.newValue;
      setLastReminder(newVal);
    }
    if (changes.nextReminder) {
      const newVal = changes.nextReminder.newValue;
      setNextReminder(newVal);
    }
    if (changes.skipTimes) {
      const newVal = changes.skipTimes.newValue;
      setSkipTimes(newVal);
    }
  }
});

setInterval(function () {
  chrome.storage.sync.get('nextReminder', function (data) {
    const nextReminder = data.nextReminder;
    setNextReminder(nextReminder);
  });
}, 30000)
