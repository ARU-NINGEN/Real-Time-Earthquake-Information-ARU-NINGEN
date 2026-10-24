self.addEventListener('push', function(event) {
    let data = { title: '地震・津波に関する情報', body: '(これは架空の通知内容です。) 緊急地震速報(警報)の第13報発令。九州・四国・近畿・中部では強い揺れに警戒してください。\n\n詳細\n震源:日向灘\nマグニチュード:7.1\n震源の深さ:12km' };
    
    if (event.data) {
        try {
            data = event.data.json();
        } catch(e) {
            data.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: 'https://flaticon.com'
        })
    );
});
