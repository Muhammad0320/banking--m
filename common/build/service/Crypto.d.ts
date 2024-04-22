export declare class CryptoManager {
    static hash(password: string): Promise<string>;
    static compare(storedPassword: string, suppliedPassword: string): Promise<boolean>;
}
