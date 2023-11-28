chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get(['interval', 'restInterval'], function (data) {
    const interval = data.interval || 60;
    const restInterval = data.restInterval || 5;
    chrome.storage.sync.set({
      'interval': interval,
      'restInterval': restInterval,
    });
    createReminder(interval, skipRest = true)

    console.log(`Reminder onIntalled with interval ${interval}`)
  })
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'sync') {
    if (changes.interval) {
      const newInterval = changes.interval.newValue;
      console.log(`Interval changed to ${newInterval}`);

      createReminder(newInterval, skipRest = true)
    }
  }
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === 'reminder') {
chrome.storage.sync.get(['interval', 'skipTimes', 'userSetSkip'], function (data) {
      const interval = data.interval || 60;
      const skipTimes = data.skipTimes || 0;
      const userSetSkip = data.userSetSkip || false;

      console.log('Reminder Trigger');

      createNotification(interval, skipTimes)

      const now = new Date();
      chrome.storage.sync.set({ 'lastReminder': now.toLocaleTimeString() });

      createReminder(interval, userSetSkip)
    });
  }
});

function getRandomImage() {
  const imgSize = 10;
  const randomIndex = Math.floor(Math.random() * imgSize) + 1;
  return chrome.runtime.getURL(`static/img${randomIndex}.svg`);
}

function createNotification(interval, skipTimes) {
  let duration = interval;
  if (skipTimes > 0) {
    duration = interval * (skipTimes + 1);
  }

  chrome.notifications.clear('movemate', function () {
    chrome.notifications.create("movemate", {
      type: 'basic',
      iconUrl: 'icon.png',
      title: chrome.i18n.getMessage('messageTitle'),
      message: `${chrome.i18n.getMessage('reminderContentPrefix')} ${duration} ${chrome.i18n.getMessage('reminderContentSuffix')}`,
      priority: 2,
      requireInteraction: true,
      buttons: [{ title: chrome.i18n.getMessage('skip') }, { title: chrome.i18n.getMessage('goToRest') }],
    });
  });
}

function createReminder(interval, skipRest = false) {
  chrome.storage.sync.get('restInterval', function (data) {
    let duration = interval;
    if (!skipRest) {
      duration += data.restInterval;
    }

    chrome.alarms.clear('reminder', function () {
      chrome.alarms.create('reminder', { delayInMinutes: duration });
    });

    const now = new Date();
    const nextReminder = new Date(now.getTime() + duration * 60000);
    console.log("next trigger", nextReminder, "skipping rest", skipRest)
    chrome.storage.sync.set({ 'nextReminder': nextReminder.getTime() });
  });
}

chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
  console.log('Button clicked! Notification ID:', notificationId, 'Button Index:', buttonIndex);
  if (notificationId === 'movemate' && buttonIndex === 0) {
    console.log("user skip this rest")
    chrome.notifications.clear(notificationId)

    chrome.storage.sync.get('skipTimes', function (data) {
      const skipTimes = data.skipTimes || 0;

      chrome.storage.sync.set({ 'skipTimes': skipTimes + 1, 'userSetSkip': true });
    });
  } else if (notificationId === 'movemate' && buttonIndex === 1) {
    console.log("user go to rest")
    chrome.notifications.clear(notificationId)

    chrome.storage.sync.get('restTimes', function (data) {
      const restTimes = data.restTimes || 0;
      chrome.storage.sync.set({ 'restTimes': restTimes + 1 });
    });
  }
});

chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
  if (notificationId === 'movemate') {
    console.log("movemate notification closed", byUser)
    chrome.storage.sync.get(['interval', 'skipTimes', 'userSetSkip'], function (data) {
      const interval = data.interval;
      const skipTimes = data.skipTimes || 0;
      const userSetSkip = data.userSetSkip || false;

      createReminder(interval, userSetSkip)
      if (!userSetSkip && skipTimes > 0) {
        chrome.storage.sync.set({ 'skipTimes': 0 });
      }

      chrome.storage.sync.remove('userSetSkip');
    });
  }
});
