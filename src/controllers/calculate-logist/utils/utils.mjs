export const calculateTotalCommission = (adminDataItog, elem, nonEmptyLogist) => {
    return adminDataItog.reduce((acc, cur) => {
        const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
            if (cur2.admin.replace(/\s/g, '').toLowerCase() === elem.curator.replace(/\s/g, '').toLowerCase() || nonEmptyLogist.some(logist => logist.logist.replace(/\s/g, '').toLowerCase() === cur2.admin.replace(/\s/g, '').toLowerCase())) {
                return acc2 + cur2.comPersent100;
            }
            return acc2;
        }, 0);
        return acc + curatorCommission;
    }, 0);
};

export const calculateTotalOrders = (adminDataItog, elem, nonEmptyLogist) => {
    return adminDataItog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            const matchesCurator = cur2.admin.replace(/\s/g, '').toLowerCase() === elem.curator.replace(/\s/g, '').toLowerCase();
            const matchesNonEmptyLogist = nonEmptyLogist.some((logistItem) => cur2.admin.replace(/\s/g, '').toLowerCase() === logistItem.logist.replace(/\s/g, '').toLowerCase());
            return acc2 + (matchesCurator || matchesNonEmptyLogist ? 1 : 0);
        }, 0);
    }, 0);
};

export const isCurrentMonthAndYear = (dateString) => {
    const currentDate = new Date();
    const [day, month, year] = dateString.split('.').map(Number);
    return currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;
    // return 2023 === year && 8 === month;
}