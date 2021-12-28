// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    tokens: {
        [address: string]: {
                symbol: string;
                name: string;
                address: string;
                website: string;
        }
    }
}

const tokens: {
    [address: string]: {
            symbol: string;
            name: string;
            address: string;
            website: string;
    }
} = {
    "0xCCac1187F4439E6ff02De97B16fF40BD2E7c8080": {
            symbol: "$ZERO",
            name: "Mad Realities: Season Zero",
            address: "0xCCac1187F4439E6ff02De97B16fF40BD2E7c8080",
            website: "https://www.madrealities.xyz/"
    },
    "0x5d1E816D60E42E5f8849eC802d5a4C9c48e662aA": {
            symbol: "SASSY",
            name: "SassyBlack",
            address: "0x5d1E816D60E42E5f8849eC802d5a4C9c48e662aA",
            website: "https://www.sound.xyz/sassyblack"
    },
    "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03": {
            symbol: "NOUN",
            name: "Nouns",
            address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
            website: "https://nouns.wtf/"
    },
    "0xeaCa6dc08AFf2694366c4405724973e2Ac7E49E9": {
            symbol: "Giraffage",
            name: "Giraffage",
            address: "0xeaCa6dc08AFf2694366c4405724973e2Ac7E49E9",
            website: "https://www.sound.xyz/giraffage"
    },
    "0xBF0631a1d679D36f51D0edCaBc06842679053ae5": {
            symbol: "BESTIES",
            name: "Crypto Besties",
            address: "0xBF0631a1d679D36f51D0edCaBc06842679053ae5",
            website: "https://linktr.ee/Cryptobesties"
    },
    "0x622236bb180256b6ae1a935dae08dc0356141632": {
            symbol: "WRITE",
            name: "Mirror Write Token",
            address: "0x622236bb180256b6ae1a935dae08dc0356141632",
            website: "https://mirror.xyz/"
    },
    "0x9e04f519b094f5f8210441e285f603f4d2b50084": {
            symbol: "$1EARTH",
            name: "Earth Fund",
            address: "0x9e04f519b094f5f8210441e285f603f4d2b50084",
            website: "https://www.earthfund.io/"
    }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    res.status(200).json({ tokens })
}

