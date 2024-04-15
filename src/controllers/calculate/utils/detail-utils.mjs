export const calculateMatchesLogist = (filtereditog, logistItem) => {
    return filtereditog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            return acc2 + (cur2.buyer.replace(/\s/g, '').toLowerCase() === logistItem.buyer.replace(/\s/g, '').toLowerCase() ? 1 : 0);
        }, 0);
    }, 0);
};

export const calculateSumComPersent100 = (filtereditog, logistItem) => {
    return filtereditog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            return acc2 + (cur2.buyer.replace(/\s/g, '').toLowerCase() === logistItem.buyer.replace(/\s/g, '').toLowerCase() ? cur2.itog : 0);
        }, 0);
    }, 0);
};