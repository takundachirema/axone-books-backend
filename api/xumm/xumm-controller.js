const {XummSdk} = require('xumm-sdk')
const hex = require('string-hex')

export async function mintNFT(req, res) {

    const Sdk = new XummSdk(process.env.XUMM_API_KEY , process.env.XUMM_SECRET_KEY)
    
    // Transaction ID is already hex
    var nftID = req.body["id"]

    const mintTxn = {
        "TransactionType": "NFTokenMint",
        "TransferFee": 10,
        "NFTokenTaxon": 0,
        "Flags": 8,
        "Fee": "10",
        "URI": nftID,
        "Memos": [
            {
                "Memo": {
                    "MemoType": "687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E65726963",
                    "MemoData": "72656E74"
                }
            }
        ]
    }
    
    const subscription = await Sdk.payload.createAndSubscribe(mintTxn)

    res.status(200).send(subscription.created);

    console.log("after sent data")
    /**
     * Now let's wait until the subscription resolved (by returning something)
     * in the callback function.
     */
    const resolveData = await subscription.resolved

    if (resolveData.signed === false) {
        console.log('The sign request was rejected :(')
        // return res.status(200).send(subscription.created);
    }

    if (resolveData.signed === true) {
        console.log('Woohoo! The sign request was signed :)')

        /**
         * Let's fetch the full payload end result, and get the issued
         * user token, we can use to send our next payload per Push notification
         */
        const result = await Sdk.payload.get(resolveData.payload_uuidv4)
        console.log('User token:', result.application.issued_user_token)
        // return res.status(200).send(result);
    }
}