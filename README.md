# Pixel Path

## Building
To build you need to set the `googleMapsApiKey` environment variable so we have it.

In one terminal run:
```sh
export googleMapsApiKey=...
npm start
```

In another terminal run:
```sh
export googleMapsApiKey=...
npm run android
```

## Running on a phone
See https://reactnative.dev/docs/next/running-on-device for more.

1. On the phone enable debugging
2. Find the device name with `adb devices`
3. Run the following: `adb -s <device name> reverse tcp:8081 tcp:8081`

