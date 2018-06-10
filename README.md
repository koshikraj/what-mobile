# What Q&A Mobile

An open source decentralised STEEM Blockchain ask and answer platform app for iOS and Android devices.

https://what-app.io 

## Interface

![Interface](https://steemitimages.com/DQmSUiBYaMvhZDx8BRGfMrggkvGd44joUxmJDaz3euofEwW/image.png)

## Installation

```bash
git clone https://github.com/shango44/what.git
cd what

npm install
react-native link
```

## Run on iOS (Mac only)

Devices: iPhone 6 - iPhone X

```bash
react-native run-ios --simulator "[DEVICE]"
```

Alternatively, you can open the XCode project and use the XCode interface to run the project on a simulator or device.

## Run on Android

* Download Android Studio and SDK Tools - https://developer.android.com/studio/
* Open AVD Manager
* Click play icon to open a virtual device
* If you have no devices, click "Create Virtual Device..." and go through the process

When you have a device launched, proceed with the following code:

```bash
react-native run-android
```

Alternatively, you can use Android Studio to run the project.

## Credit

Thanks to the Busy.org team for open sourcing their app and from this, we were able to see the structure of a high quality Steem app.