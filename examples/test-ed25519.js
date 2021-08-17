import Ed25519 from "../lib/ed25519.js";

const keys = Ed25519.generateKeyPair();
console.log(keys);

const message = new TextEncoder().encode("Hello!");
const sig = Ed25519.sign({ privateKey: keys.privateKey, message, encoding: 'binary' });
console.log(sig);

const chk = Ed25519.verify({ signature: sig, publicKey: keys.publicKey, message, encoding: "binary" });
console.log(chk);

const message2 = new TextEncoder().encode("Hello!2");
const chk2 = Ed25519.verify({ signature: sig, publicKey: keys.publicKey, message: message2, encoding: "binary" });
console.log(chk2);
