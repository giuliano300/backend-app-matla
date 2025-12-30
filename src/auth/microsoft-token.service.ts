import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://login.microsoftonline.com/common/discovery/v2.0/keys',
});

export async function verifyMicrosoftToken(token: string): Promise<any> {
  const decoded: any = jwt.decode(token, { complete: true });
  if (!decoded) throw new Error('Token non valido');

  const key = await client.getSigningKey(decoded.header?.kid);
  const signingKey = key.getPublicKey();

  return jwt.verify(token, signingKey, {
    audience: process.env.MS_CLIENT_ID,
    issuer: `https://login.microsoftonline.com/${decoded.payload.tid}/v2.0`,
  });
}
