const FileField = require("./file.field");

/**
 * @property {boolean} multiple
 * @property {string} url
 * @property {string} accept
 * @property {string[]} acceptList
 * @property {number} totalFiles
 * @property {FileItem} item
 * @property {FileItem[]} items
 */
class FileSingleField extends FileField {

    static NAME = "file";

}

module.exports = FileSingleField;