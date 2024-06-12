import crypto from 'crypto';
import randomatic from 'randomatic';

type CryptoReturnType = {
  card: string;

  cvv: string;
};

type DecryptAttrs = { encryptedData: string; iv: string };

// Function to generate a 16-digit card number
function generateCardNumber(): string {
  let cardNumber = randomatic('0', 15); // Generate first 15 digits
  let checksum = luhnChecksum(cardNumber);
  return cardNumber + checksum;
}

// Function to generate a 3-digit CVV
function generateCVV(): string {
  return randomatic('0', 3);
}

// Luhn Algorithm to calculate the checksum digit
function luhnChecksum(number: string): string {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    let digit = parseInt(number[i]);
    if (i % 2 === number.length % 2) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return ((10 - (sum % 10)) % 10) + '';
}

// Function to hash data with a salt
function hashData(data: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHash('sha256')
    .update(data + salt)
    .digest('hex');
  return { hash, salt };
}

// Function to encrypt data
function encryptData(
  data: string,
  key: string
): { iv: string; encryptedData: string } {
  const bufferedKey = Buffer.from(key);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', bufferedKey, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Function to decrypt data
function decryptData(encryptedData: string, key: string, iv: string): string {
  const bufferedKey = Buffer.from(key);

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    bufferedKey,
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Example usage

export const hashingWork = (): CryptoReturnType => {
  const cardNumber = generateCardNumber();
  const cvv = generateCVV();
  const encryptionKey = crypto.randomBytes(32).toString('hex'); // Key should be securely stored

  const encryptedCard = encryptData(cardNumber, encryptionKey);
  const encryptedCVV = encryptData(cvv, encryptionKey);

  console.log('Card Number:', cardNumber);
  console.log('CVV:', cvv);
  console.log('Encrypted Card:', encryptedCard.encryptedData);
  console.log('Encrypted CVV:', encryptedCVV.encryptedData);

  return {
    card: `${encryptedCard.encryptedData}.${encryptionKey}`,

    cvv: `${encryptedCVV.encryptedData}.${encryptionKey}`
  };
};

// To decrypt

export const decrypt = (
  encryptedCard: DecryptAttrs,
  encryptedCVV: DecryptAttrs
): CryptoReturnType => {
  const [encryptedCardData, cardkey] = encryptedCard.encryptedData.split('.');

  const [encryptedCvvData, cvvKey] = encryptedCVV.encryptedData.split('.');

  const decryptedCard = decryptData(
    encryptedCardData,
    cardkey,
    encryptedCard.iv
  );
  const decryptedCVV = decryptData(encryptedCvvData, cvvKey, encryptedCVV.iv);

  console.log('Decrypted Card:', decryptedCard);
  console.log('Decrypted CVV:', decryptedCVV);

  return {
    card: decryptedCard,
    cvv: decryptedCVV
  };
};
