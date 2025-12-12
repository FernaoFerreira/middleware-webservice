const xml2js = require('xml2js');

/**
 * Converte objeto JSON para string XML
 * @param {Object} obj - Objeto JavaScript
 * @returns {string} - String XML
 */
function jsonToXml(obj) {
  const builder = new xml2js.Builder({
    xmldec: { version: '1.0', encoding: 'UTF-8' },
    renderOpts: { pretty: true, indent: '  ' }
  });
  
  return builder.buildObject(obj);
}

/**
 * Converte string XML para objeto JSON
 * @param {string} xml - String XML
 * @returns {Promise<Object>} - Objeto JavaScript
 */
async function xmlToJson(xml) {
  const parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true
  });
  
  return await parser.parseStringPromise(xml);
}

module.exports = {
  jsonToXml,
  xmlToJson
};