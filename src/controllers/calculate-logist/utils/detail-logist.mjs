export const calculateMatchesCurator = (adminDataItog, elem) => {
    return adminDataItog.some((itog) => {
        return itog.otchet.some((otchetItem) => {
            return otchetItem.admin.toLowerCase() === elem.curator.toLowerCase();
        });
    });
};

export const calculateMatchesLogist = (adminDataItog, logistItem) => {
    return adminDataItog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            return acc2 + (cur2.admin.replace(/\s/g, '').toLowerCase() === logistItem.logist.replace(/\s/g, '').toLowerCase() ? 1 : 0);
        }, 0);
    }, 0);
};

export const calculateSumComPersent100 = (adminDataItog, logistItem) => {
    return adminDataItog.reduce((acc, cur) => {
        return acc + cur.otchet.reduce((acc2, cur2) => {
            return acc2 + (cur2.admin.replace(/\s/g, '').toLowerCase() === logistItem.logist.replace(/\s/g, '').toLowerCase() ? cur2.comPersent100 : 0);
        }, 0);
    }, 0);
};