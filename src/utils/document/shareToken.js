// utils/shareToken.ts

import CryptoJS from "crypto-js";
import { randomUUID } from "crypto";

export const generateShareToken = () => {
    const random = randomUUID();

    return CryptoJS.SHA256(random + Date.now()).toString();
};