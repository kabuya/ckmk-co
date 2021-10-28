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
class FileMultipleField extends FileField {

    static NAME = "files";

}

module.exports = FileMultipleField;