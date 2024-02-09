
export const calculateMatchesLogist = (filtereditog, logistItem) => {
    return filtereditog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            return acc2 + (cur2.buyer === logistItem.buyer ? 1 : 0);
        }, 0);
    }, 0);
};

export const calculateSumComPersent100 = (filtereditog, logistItem) => {
    return filtereditog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            return acc2 + (cur2.buyer === logistItem.buyer ? cur2.itog : 0);
        }, 0);
    }, 0);
};