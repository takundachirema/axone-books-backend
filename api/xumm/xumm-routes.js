import express from 'express';
const router = express.Router();
import * as controller from './xumm-controller';

router.post('/xumm/mint_nft', controller.mintNFT);

export default router;