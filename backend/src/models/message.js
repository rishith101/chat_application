import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },

}, { timestamps: true }
);
messageSchema.pre("validate", function (next) {

    if (!this.text && !this.image && !this.video) {

        next(new Error("Message must have text, image, or video"));

    } else {

        next();

    }

});

const Message = mongoose.model("Message", messageSchema);

export default Message;