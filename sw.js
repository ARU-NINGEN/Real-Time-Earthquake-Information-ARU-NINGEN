// プッシュ通知をサーバー（Cloudflare）から受信したときの処理
self.addEventListener('push', event => {
    console.log('[Service Worker] プッシュ通知を受信しました', event);

    let data = {
        title: '🚨 地震・緊急地震速報',
        body: '新しい地震情報を受信しました。',
        url: './'
    };

    // サーバーからJSONデータが送られてきた場合、中身を読み取る
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: './icon-192.png', // 後で用意するアプリアイコン
        badge: './icon-192.png',
        vibrate: [300, 100, 300, 100, 300], // 緊迫感のあるバイブレーションパターン
        data: {
            url: data.url || './'
        },
        requireInteraction: true // ユーザーが操作するまで通知を消さずに残す
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// ユーザーが通知をクリックしたときの処理
self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // すでに開いているタブがあればそこにフォーカスし、なければ新しく開く
            for (let client of windowClients) {
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
