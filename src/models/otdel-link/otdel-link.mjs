import mongoose from 'mongoose';

const otdelLinkSchema = new mongoose.Schema({
    clicked: Number,
    link: String,
    lastClickedIndex: Number,
    num1: {
        click: Number,
        otdel: String,
        link: String
    },
    num2: {
        click: Number,
        otdel: String,
        link: String
    },
    num3: {
        click: Number,
        otdel: String,
        link: String
    },
    num4: {
        click: Number,
        otdel: String,
        link: String
    },
    num5: {
        click: Number,
        otdel: String,
        link: String
    },
    num6: {
        click: Number,
        otdel: String,
        link: String
    }
})

const OtdelLink = mongoose.model('otdel-link', otdelLinkSchema);

export default OtdelLink;