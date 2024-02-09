export const calculateMatchesCurator = (adminDataItog, elem) => {
    return adminDataItog.some((itog) => {
        return itog.otchet.some((otchetItem) => {
            return otchetItem.admin === elem.curator;
        });
    });
};

export const calculateMatchesLogist = (adminDataItog, logistItem) => {
    return adminDataItog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            return acc2 + (cur2.admin === logistItem.logist ? 1 : 0);
        }, 0);
    }, 0);
};

export const calculateSumComPersent100 = (adminDataItog, logistItem) => {
    return adminDataItog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            return acc2 + (cur2.admin === logistItem.logist ? cur2.comPersent100 : 0);
        }, 0);
    }, 0);
};