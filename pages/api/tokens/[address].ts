// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import AWS, { S3 } from 'aws-sdk';


type Data = {
    data: any
} 

const config = {
    bucket: 'canalytics',
    queueKey: 'dev0/queue'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    if (process.env.AWS_ACCESS_KEY_ID_CRYPTOSOURCE) {
        AWS.config.update({
            "accessKeyId": process.env.AWS_ACCESS_KEY_ID_CRYPTOSOURCE,
        });
    }

    if (process.env.AWS_ACCESS_SECRET_CRYPTOSOURCE) {
        AWS.config.update({
            "secretAccessKey":process.env.AWS_ACCESS_SECRET_CRYPTOSOURCE
        });
    }

    try {
        const s3 = new S3({apiVersion: '2006-03-01'});
        const { address } = req.query
    
        // Create the parameters for calling listObjects
        const objectParams: S3.GetObjectRequest = {
            Key : `dev0/tokens/${address}/uniq`,
            Bucket: 'canalytics'
        };
    
        const response = await s3.getObject(objectParams).promise()
        
        if (response && response?.Body) {
            try {
                const data = JSON.parse(response.Body.toString("utf-8"))
                res.status(200).json({ data })
            } catch {
                res.status(200).json({ data: response.Body.toString("utf-8") })
            }
            
        }
    } catch (e) {
        console.log(e)
        res.status(200).json({ data: null })
    }
    

    // if (response && response?.Body) {
    //     try {
    //         const data = JSON.parse(response.Body.toString("utf-8"))
    //         res.status(200).json({ data })
    //     } catch {
    //         res.status(200).json({ data: response.Body.toString("utf-8") })
    //     }
        
    // } else {
    //     res.status(400);
    // }
}

export type TokenData = {
    uniqueSenders: {
        to: string;
        from: number;
        ContractName: string;
    }[]

    repeatSenders: {
        to: string;
        from: number;
        ContractName: string;
    }[]
}

export const getTokenData = async (address: any): Promise<TokenData> => {
    const tokenData: TokenData = {
        uniqueSenders: [],
        repeatSenders: []
    }

    if (typeof address != 'string') {
        return tokenData
    }

    const s3 = new S3({apiVersion: '2006-03-01'});
    const slice = 100


    try {
        const uniqObjectParams: S3.GetObjectRequest = {
            Key : `dev0/tokens/${address}/uniq`,
            Bucket: 'canalytics'
        };
    
        const uniqResp = await s3.getObject(uniqObjectParams).promise()
        
        if (uniqResp && uniqResp?.Body) {
            try {
                const data = JSON.parse(uniqResp.Body.toString("utf-8"))
                if (data.length > slice) {
                    tokenData.uniqueSenders = data.slice(0, slice)
                } else {
                    tokenData.uniqueSenders = data
                }
            } catch(e) {
                console.log(e)
            }
        }
    } catch (e) {
        console.log(e)
    }

    try {
        const uniqObjectParams: S3.GetObjectRequest = {
            Key : `dev0/tokens/${address}/all`,
            Bucket: 'canalytics'
        };
    
        const uniqResp = await s3.getObject(uniqObjectParams).promise()
        
        if (uniqResp && uniqResp?.Body) {
            try {
                const data = JSON.parse(uniqResp.Body.toString("utf-8"))
                if (data.length > slice) {
                    tokenData.repeatSenders = data.slice(0, slice)
                } else {
                    tokenData.repeatSenders = data
                }            
            } catch(e) {
                console.log(e)
            }
        }
    } catch (e) {
        console.log(e)
    }

    return tokenData
}