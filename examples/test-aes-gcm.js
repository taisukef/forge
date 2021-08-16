import forge from "../lib/forge.js";
import {} from "../lib/aes.js";
import {} from "../lib/random.js";

const someBytes = new TextEncoder().encode("hello!!");

// generate a random key and IV
// Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256

const ar = new Uint8Array(32);
for (let i = 0; i < ar.length; i++) {
  ar[i] = i * 2;
}
const ivar = new Uint8Array(16);
for (let i = 0; i < ivar.length; i++) {
  ivar[i] = i;
}
const array2s = (ar) => {
  return ar.map(a => String.fromCharCode(a)).join("");
};
const key = array2s(ar); //forge.random.getBytesSync(32);
const iv = array2s(ivar);
//const iv = forge.random.getBytesSync(16);

// encrypt some bytes using GCM mode
const cipher = forge.cipher.createCipher('AES-GCM', key);
cipher.start({
  iv: iv, // should be a 12-byte binary-encoded string or byte buffer
  additionalData: 'binary-encoded string', // optional
  tagLength: 128 // optional, defaults to 128 bits
});
cipher.update(forge.util.createBuffer(someBytes));
cipher.finish();
const encrypted = cipher.output;
const tag = cipher.mode.tag;
// outputs encrypted hex
console.log(encrypted.toHex());
// outputs authentication tag
console.log(tag.toHex());

// decrypt some bytes using GCM mode
const decipher = forge.cipher.createDecipher('AES-GCM', key);
decipher.start({
  iv: iv,
  additionalData: 'binary-encoded string', // optional
  tagLength: 128, // optional, defaults to 128 bits
  tag: tag // authentication tag from encryption
});
decipher.update(encrypted);
const pass = decipher.finish();
// pass is false if there was a failure (eg: authentication tag didn't match)
if(pass) {
  // outputs decrypted hex
  console.log(decipher.output.toHex());
  console.log(decipher.output.toString());
}
