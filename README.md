# EMT Server for Google Assistant.

* GCP Console: https://console.cloud.google.com
* Actions Console: https://console.actions.google.com
* Dialogflow Console: https://console.dialogflow.com
* ngrok Console: https://dashboard.ngrok.com/status

## Develope

1. Launch server

```
npm run dev
```

2. Setup ngrok proxy

```
ngrok http 3000
```

3. Create Google Actions project (https://console.actions.google.com)
6. Create intent and enable fulfillment
7. Configure fulfillment with ngrok's https url