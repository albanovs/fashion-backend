import mongoose from 'mongoose';

const numSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    click: { type: Number, default: 0 },
    otdel: { type: String, required: true },
    link: { type: String, default: '' }
});

const otdelLinkSchema = new mongoose.Schema({
    clicked: { type: Number, default: 0 },
    num1: numSchema,
    num2: numSchema,
    num3: numSchema,
    num4: numSchema,
    num5: numSchema,
    num6: numSchema
});

const OtdelLink = mongoose.model('OtdelLink', otdelLinkSchema);

export default OtdelLink;
