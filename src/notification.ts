import { getDevicesToken } from '@/db/repositories/device.repository'

const NOTIFICATION_TOPIC = {
    title: 'Loteria',
    body: 'Resultado de loteria disponible',
}

export async function sendNotification() {
    const deviceTokens = await getDevicesToken()
    const toList = deviceTokens.map((device) => ({
        title: NOTIFICATION_TOPIC.title,
        body: NOTIFICATION_TOPIC.body,
        to: device.token,
    }));

    return fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(toList),
    }).then((response) => response.json())
        .then((response) => console.log(response))
        .catch((error) => console.error(error));
}