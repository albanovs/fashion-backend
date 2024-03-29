import pdf from 'html-pdf'

export function generateHTML(data) {
    return `
    <html>
    <head>
        <title>Данные пользователя</title>
    </head>
    <body>
        <h1>Информация о пользователе</h1>
        <p>привет мир, ${data} изи сработал</p>
    </body>
    </html>
    `;
}

export async function convertHTMLToPDF(html) {
    return new Promise((resolve, reject) => {
        pdf.create(html).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
}