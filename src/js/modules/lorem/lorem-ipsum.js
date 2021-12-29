const LoremIpsum = require('lorem-ipsum').LoremIpsum;

const DEFAULT_OPTIONS = {
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
};

class CoLoremIpsum extends LoremIpsum {


    constructor(options = undefined, format = undefined, suffix = undefined) {
        super((options || DEFAULT_OPTIONS), format, suffix);
    }

    /**
     * @return {string}
     */
    getLineEnding() {
        return super.getLineEnding();
    }

    /**
     * @param {string} str
     * @return {`<p>${string}</p>`|string}
     */
    formatString(str) {
        return super.formatString(str);
    }

    /**
     * @param {string[]} strings
     * @return {(`<p>${string}</p>`|string)[]}
     */
    formatStrings(strings) {
        return super.formatStrings(strings);
    }

    /**
     * @param {number|undefined} num
     * @return {string}
     */
    generateWords(num = undefined) {
        return super.generateWords(num);
    }

    /**
     * @param {number|undefined} num
     * @return {string}
     */
    generateSentences(num = undefined) {
        return super.generateSentences(num);
    }

    /**
     * @param {number} num
     * @return {string}
     */
    generateParagraphs(num) {
        return super.generateParagraphs(num);
    }

    /**
     * @param {number|string} max
     * @return {CoLoremIpsum}
     */
    setMaxSentencesPerParagraph(max) {
        if(typeof max === "number") {
            this.sentencesPerParagraph.max = Math.round(max);
        }
        return this;
    }

    /**
     * @param {number|string} min
     * @return {CoLoremIpsum}
     */
    setMinSentencesPerParagraph(min) {
        if(typeof min === "number") {
            this.sentencesPerParagraph.min = Math.round(min);
        }
        return this;
    }

    /**
     * @param {number|string} max
     * @return {CoLoremIpsum}
     */
    setMaxWordsPerSentences(max) {
        if(typeof max === "number") {
            this.wordsPerSentence.max = Math.round(max);
        }
        return this;
    }

    /**
     * @param {number|string} min
     * @return {CoLoremIpsum}
     */
    setMinWordsPerSentences(min) {
        if(typeof min === "number") {
            this.wordsPerSentence.min = Math.round(min);
        }
        return this;
    }

}

module.exports = new CoLoremIpsum();