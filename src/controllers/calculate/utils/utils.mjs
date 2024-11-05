export const calculateTotalCommission = (adminDataItog, elem, nonEmptyBuyers) => {
    return adminDataItog.reduce((acc, cur) => {
        const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
            if (cur2.buyer.replace(/\s/g, '').toLowerCase() === elem.curator.replace(/\s/g, '').toLowerCase() || nonEmptyBuyers.some(logist => logist.buyer.replace(/\s/g, '').toLowerCase() === cur2.buyer.replace(/\s/g, '').toLowerCase())) {
                return acc2 + cur2.itog;
            }
            return acc2;
        }, 0);
        return acc + curatorCommission;
    }, 0);
};

export const calculateTotalCommissionBeta = (data, elem, buyers) => {
    return data.otchet.reduce((acc, cur) => {
        const curatorCommission = buyers.reduce((acc2, buyer) => {
            if (cur.buyer.replace(/\s/g, '').toLowerCase() === elem.curator.replace(/\s/g, '').toLowerCase() ||
                buyer.name.replace(/\s/g, '').toLowerCase() === cur.buyer.replace(/\s/g, '').toLowerCase()) {
                return acc2 + cur.itog;
            }
            return acc2;
        }, 0);
        return acc + curatorCommission;
    }, 0);
};



export const calculateTotalCommissionPercent = (adminDataItog, elem, nonEmptyBuyers) => {
    return adminDataItog.reduce((acc, cur) => {
        const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
            if (nonEmptyBuyers.some(logist => logist.buyer.replace(/\s/g, '').toLowerCase() === cur2.buyer.replace(/\s/g, '').toLowerCase()) && cur2.sm === 1) {
                return acc2 + cur2.comPersent100;
            }
            return acc2;
        }, 0);
        return acc + curatorCommission;
    }, 0);
};

export const calculateTotalOrders = (adminDataItog, elem, nonEmptyBuyers) => {
    return adminDataItog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            const matchesCurator = cur2.buyer.replace(/\s/g, '').toLowerCase() === elem.curator.replace(/\s/g, '').toLowerCase();
            const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer.replace(/\s/g, '').toLowerCase() === buyerItem.buyer.replace(/\s/g, '').toLowerCase());
            return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
        }, 0);
    }, 0);
};

export const isCurrentMonthAndYear = (dateString) => {
    const currentDate = new Date();
    const [day, month, year] = dateString.split('.').map(Number);
    // return currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;
    return 2024 === year && 10 === month;
}

export const percentVM = (curator, totalItog) => {
    let summa = 0
    if (curator.includes("ВМ")) {
        summa = ((totalItog) * 0.03).toFixed(0)
    } else if (curator.includes("СМ")) {
        summa = ((totalItog) * 0.07).toFixed(0)
    }
    return summa
}