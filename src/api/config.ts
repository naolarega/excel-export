import "dotenv/config";

export default class Conifg {
    
    static get HOST(): string {
        return (
            "HOST" in process.env &&
            process.env.HOST !== undefined
        ) ? process.env.HOST : "0.0.0.0";
    }
    
    static get PORT(): number {
        return (
            "PORT" in process.env &&
            process.env.PORT !== undefined
        ) ? Number(process.env.PORT) : 8000;
    }
    
    static get DATABASE_HOST(): string {
        return (
            "DATABASE_HOST" in process.env &&
            process.env.DATABASE_HOST !== undefined
        ) ? process.env.DATABASE_HOST : "127.0.0.1";
    } 
    
    static get DATABASE_PORT(): number {
        return (
            "DATABASE_PORT" in process.env &&
            process.env.DATABASE_PORT !== undefined
        ) ? Number(process.env.DATABASE_PORT) : 3306;
    } 
    
    static get DATABASE_USERNAME(): string {
        return (
            "DATABASE_USERNAME" in process.env &&
            process.env.DATABASE_USERNAME !== undefined
        ) ? process.env.DATABASE_USERNAME : "root";
    } 
    
    static get DATABASE_PASSWORD(): string {
        return (
            "DATABASE_PASSWORD" in process.env &&
            process.env.DATABASE_PASSWORD !== undefined
        ) ? process.env.DATABASE_PASSWORD : "";
    } 
}