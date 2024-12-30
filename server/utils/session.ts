import {jwtVerify, SignJWT} from 'jose'


export class Session {
    static key = new TextEncoder().encode(process.env.JWT_SECRET)
    static SESSION_DURATION = 60 * 60 * 1000 // 1 hour
    
    static async encrypt(payload: any) {
        return await new SignJWT(payload)
            .setProtectedHeader({alg: "HS256"})
            .setIssuedAt()
            .setExpirationTime(this.SESSION_DURATION)
            .sign(this.key)
    }
    
    static async decrypt(input: string): Promise<any> {
        const {payload} = await jwtVerify(input, this.key, {
            algorithms: ["HS256"],
        })
        return payload
    }
}