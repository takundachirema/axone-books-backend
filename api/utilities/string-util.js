module.exports = class StringUtil {
    static isEmpty(value) {
        return !value || !value.trim();
    }

    static capitalise(word) {
        return word.charAt(0).toUpperCase();
    }
}