self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();

        if (data) {
            const title = data.title;
            const payload = data.payload;
            const image = data.image;

            if (title && payload && image) {
                event.waitUntil(
                    self.registration.showNotification(title, {
                        body: payload,
                        icon: image,
                    })
                );
            }
        }
    }
});
