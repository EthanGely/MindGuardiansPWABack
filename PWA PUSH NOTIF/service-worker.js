// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
    console.log('received info from back');
    // Retrieve the textual payload from event.data (a PushMessageData object).
    // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
    // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.

    if (event.data) {
        const data = event.data.json();

        if (data) {
            const title = data.title;
            const payload = data.payload;
            const image = data.image;

            if (title && payload && image) {
                // Keep the service worker alive until the notification is created.
                event.waitUntil(
                    // Show a notification with title 'ServiceWorker Cookbook' and use the payload
                    // as the body.
                    self.registration.showNotification(title, {
                        body: payload,
                        icon: image,
                    })
                );
            }
        }
    }
});
