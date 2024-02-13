
export const filterAdminDataItog = (filtereditog, nonEmptyBuyers, elem) => {
    return filtereditog.filter((itog) => {
        return itog.otchet.some((otchetItem) => {
            return nonEmptyBuyers.some((buyerItem) => {
                return otchetItem.buyer && (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator);
            });
        });
    });
};

export const calculateTotalCommission = (adminDataItog, elem, nonEmptyBuyers) => {
    return adminDataItog.reduce((acc, cur) => {
        const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
            if (cur2.buyer === elem.curator || nonEmptyBuyers.some(logist => logist.buyer === cur2.buyer)) {
                return acc2 + cur2.itog;
            }
            return acc2;
        }, 0);
        return acc + curatorCommission;
    }, 0);
};

export const calculateTotalCommissionPercent = (adminDataItog, elem, nonEmptyBuyers) => {
    return adminDataItog.reduce((acc, cur) => {
        const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
            if ((cur2.buyer === elem.curator || (nonEmptyBuyers.some(logist => logist.buyer === cur2.buyer) && cur2.sm === 1))) {
                return acc2 + cur2.itog;
            }
            return acc2;
        }, 0);
        return acc + curatorCommission;
    }, 0);
};

export const calculateTotalOrders = (adminDataItog, elem, nonEmptyBuyers) => {
    return adminDataItog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            const matchesCurator = cur2.buyer === elem.curator;
            const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
            return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
        }, 0);
    }, 0);
};

export const isCurrentMonthAndYear = (dateString) => {
    const currentDate = new Date();
    const [day, month, year] = dateString.split('.').map(Number);
    return currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;
    // return 2023 === year && 8 === month;
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