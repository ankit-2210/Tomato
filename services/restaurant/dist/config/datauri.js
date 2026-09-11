import DataURIParser from "datauri/parser.js";
const parser = new DataURIParser();
const getBuffer = (file) => {
    const base64 = file.buffer.toString("base64");
    return {
        content: `data:${file.mimetype};base64,${base64}`,
    };
};
export default getBuffer;
