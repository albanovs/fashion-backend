import pdf from 'html-pdf'

export function generateHTML(data) {
    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        width: 1000px;
        height: 100%;
        padding: 20px 20px;
        margin: 0 auto;
      }
      .container > h1 {
        color: #11bac9;
        margin-bottom: 10px;
      }

      .section-1 > div {
        display: inline-block;
      }

      .section-1 > div:nth-child(2) {
        float: right;
      }

      a {
        text-decoration: none;
        color: #11bac9;
      }
      .section-1 h2 {
        color: #157889;
        margin-top: 10px;
        font-size: 16px;
      }
      .section-1 > div:nth-child(2) > h1 {
        width: 200px;
        text-align: center;
        font-size: 18px;
        padding: 8px;
        background-color: #11bac9;
        color: white;
      }
      .section-1 > div:nth-child(2) > p {
        width: 200px;
        text-align: center;
        font-size: 18px;
        border: 1px solid #11bac9;
        padding: 5px;
      }
      table {
        width: 100%;
        margin-top: 30px;
        border-collapse: collapse;
      }

      td {
        padding: 8px;
        border: 1px solid #ccc;
      }
      thead {
        background-color: #11bac9;
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Счет фактура</h1>
      <div class="section-1">
        <div>
          <a href="">Instagram: dordoi.fashion & dordoi_online_shopping</a>
          <h2>Р-к Дордой, Мир Трико,Кербен,43-44</h2>
        </div>
        <div>
          <h1>дата заказа</h1>
          <p>${data.datas}</p>
        </div>
      </div>
      <table class="table_one">
        <thead>
          <tr>
            <td colspan="2">информация</td>
            <td colspan="2">получатель</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>менеджер:</td>
            <td>${data.manager}</td>
            <td>$фио:</td>
            <td>${data.FIO}</td>
          </tr>
          <tr>
            <td>админ:</td>
            <td>${data.admin}</td>
            <td>город:</td>
            <td>${data.city}</td>
          </tr>
          <tr>
            <td>статус:</td>
            <td>${data.status}</td>
            <td>банк:</td>
            <td>${data.bank}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <td>перевод</td>
            <td>валюта</td>
            <td>курс</td>
            <td>сом</td>
          </tr>
        </thead>
        <tbody>
          ${data.transfer.map((item, index) => {
        return `
              <tr key="${index}">
                <td>${item.perevod}</td>
                <td>${item.valuta}</td>
                <td>${item.curs}</td>
                <td>${item.summa}</td>
              </tr>
            `;
    }).join('')}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <td>остаток</td>
            <td>бюджет</td>
            <td>баланс (сом)</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${data.ostatok}</td>
            <td>${data.budjet}</td>
            <td>${data.balans}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <td>наименование позиции</td>
            <td>кол-во</td>
            <td>цена (сом)</td>
            <td>сумма (сом)</td>
          </tr>
        </thead>
        <tbody>
          ${data.position.map(item => {
        return `
              <tr>
                <td>${item.name}</td>
                <td>${item.count}</td>
                <td>${item.price}</td>
                <td>${item.summa}</td>
              </tr>
            `;
    }).join('')}
        </tbody>
      </table>
      <table style="background-color: #e9fdff">
        <tr>
          <td>Общая сумма товара</td>
          <td>${data.all_sum}</td>
        </tr>
        <tr>
          <td>Упаковка / тачка / отправка</td>
          <td>${data.upakovka}</td>
        </tr>
        <tr>
          <td>Доставка / погрузка / пресс</td>
          <td>${data.dostavka}</td>
        </tr>
        <tr>
          <td>Комиссия 6%</td>
          <td>${data.comission}</td>
        </tr>
        <tr>
          <td>итого</td>
          <td>${data.itogs}</td>
        </tr>
      </table>
      <div style="width: 100%; text-align: center; margin-top: 40px">
        Жалобы и предложения по номеру: <br />
        996 500 996 500 Кайрат (Руководитель) <br />
        Заказ должен производится в инд.группах
        <h1>Благодарим за заказ🫶🏻</h1>
      </div>
    </div>
    <div style="width: 100%; text-align: center; margin-top: 50px; margin-bottom: 100px;">
      Настоятельно рекомендуем периодически созваниваться с перевозчиком <br />
      Просьба сообщить при получении груза <br />
      dordoi.fashion <br />
    </div>
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