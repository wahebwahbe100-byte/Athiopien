/* Abyssinia Journeys - Microsoft Azure Translator configuration (client-side)
 *
 * Works on a normal static website, including GitHub Pages.
 * IMPORTANT: The Translator key is visible to anyone who can inspect the page source.
 * This is intentionally a client-side setup, as requested.
 *
 * Azure portal values:
 *   apiKey  = Translator resource Key 1 or Key 2
 *   region  = Resource location/region (for example: westeurope, germanywestcentral)
 *             If the Translator resource is Global, leave region as an empty string.
 *   endpoint = Use the default global endpoint below unless Azure gives you a custom endpoint.
 */
(function(){
  'use strict';

  window.AJ_AZURE_TRANSLATOR_CONFIG = Object.assign({
    sourceLanguage: 'de',

    // ضع مفتاح Microsoft Azure Translator هنا.
    // Example: apiKey: '0123456789abcdef...'
    apiKey: '3niNFrHmHQgW9vxZ2BP4uP3dpUgMOk5UlnAUHoRaPG750oppu9r9JQQJ99CIACYeBjFXJ3w3AAAbACOGXGD0',

    // ضع Region الخاص بمورد Translator هنا، مثال: westeurope
    // إذا كان المورد Global اتركها فارغة: region: ''
    region: 'eastus',

    endpoint: 'https://api.cognitive.microsofttranslator.com',
    requestTimeoutMs: 14000,
    maxBatchItems: 30,
    maxBatchChars: 6500,
    maxConcurrentRequests: 2,
    maxRetries: 2,
    switchDebounceMs: 160,
    dynamicDebounceMs: 400,
    cacheVersion: 'v6-stable-multi-switch-silent'
  }, window.AJ_AZURE_TRANSLATOR_CONFIG || {});
})();
