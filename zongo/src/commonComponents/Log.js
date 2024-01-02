export const Log = (key, value) => {
    try {
    console.log( key!== undefined?  "  ===> " +key+ " <===  "  : "", value !== undefined? value : "");
    } catch (e) {
    console.log(" === Log error...");
    }
    }