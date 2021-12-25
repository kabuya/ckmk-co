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