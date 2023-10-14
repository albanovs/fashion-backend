import simModelLider from '../../models/simcard/simlider.mjs';
import LiderDataModel from '../../models/lider/liderData.mjs';
import SimModelLiderLog from '../../models/simcardlogist/liderlogist.mjs';

const calcRaintingManager = async (req, res) => {
    try {
        const managers = await simModelLider.find();
        const dataItog = await LiderDataModel.find();

        const result = calculateTotalItog(managers, dataItog);

        res.json(result);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}

function calculateTotalItog(managers, dataItog) {
    const result = [];
    const currentMonth = new Date().toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });

    // Пройдемся по каждому менеджеру
    for (const manager of managers) {
        // Создаем объект detail для текущего менеджера
        const managerDetail = {
            curator: manager.curator,
            totalComission: 0,
            detailBuyer: {}, // Объект для подсчета совпадений покупателей
            totalOrder: 0, // Инициализируем счетчик для текущего менеджера
            sumBuyer: 0, // Количество в общем buyer
            percent10: 0, // 10% от общей TotalCOmission
        };

        // Извлекаем массив slot из менеджера
        const slots = manager.slot;

        // Создаем объект для отслеживания уже учтенных покупателей
        const alreadyCountedBuyers = {};

        // Проходимся по каждому объекту в массиве slot
        for (const slot of slots) {
            const buyerName = slot.buyer;

            // Пропускаем пустые строки в buyer
            if (!buyerName) {
                continue;
            }

            // Пропускаем покупателей, которых мы уже учли
            if (alreadyCountedBuyers[buyerName]) {
                continue;
            }

            if (slot.status === '2') {
                // Увеличиваем счетчик sumBuyer для текущего менеджера
                managerDetail.sumBuyer++;
            }

            // Создаем запись для buyer в detailBuyer, если ее еще нет
            if (!managerDetail.detailBuyer[buyerName]) {
                managerDetail.detailBuyer[buyerName] = {
                    totalCom: 0,
                    totalOrder: 0,
                    status: slot.status,
                };
            }

            // Найдем все соответствующие записи в dataItog для текущего менеджера и месяца
            const matchingDataItog = dataItog
                .filter(item => {
                    const itemDate = item.date;
                    const itemMonthYear = itemDate.split('.').slice(1).join('/');
                    return itemMonthYear === currentMonth;
                })
                .filter((data) => {
                    return data.otchet.some((otchet) => otchet.buyer !== '' && otchet.buyer === buyerName);
                });

            if (matchingDataItog.length > 0) {
                // Если найдено соответствие, считаем сумму всех comPersent100 из всех записей
                const totalComission = matchingDataItog
                    .reduce((sum, data) => {
                        return sum + data.otchet.reduce((subSum, otchet) => subSum + otchet.comPersent100, 0);
                    }, 0);

                // Обновляем информацию о покупателе в объекте managerDetail
                managerDetail.detailBuyer[buyerName].totalCom += totalComission;

                // Увеличиваем счетчик совпадений для текущего buyer
                managerDetail.detailBuyer[buyerName].totalOrder++;

                // Увеличиваем счетчик совпадений для текущего менеджера
                managerDetail.totalOrder++;

                // Помечаем покупателя как уже учтенного
                alreadyCountedBuyers[buyerName] = true;
            }
        }

        // Вычисляем общую сумму comPersent100 для текущего менеджера
        const totalComission = Object.values(managerDetail.detailBuyer)
            .reduce((sum, buyerDetail) => sum + buyerDetail.totalCom, 0);
        managerDetail.totalComission = totalComission;

        // Вычисляем 10% от общей TotalCOmission
        managerDetail.percent10 = (managerDetail.totalComission * 0.1).toFixed(0);

        // Добавляем объект detail в результат для текущего менеджера
        result.push(managerDetail);
    }

    return result;
}

export default { calcRaintingManager };
