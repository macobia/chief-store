// import Flutterwave from "flutterwave-node-v3";
import Flutterwave from 'flutterwave-node-v3';
import dotenv from "dotenv";

dotenv.config();


export const flw = new Flutterwave(
	process.env.FLW_PUBLIC_KEY,
	process.env.FLW_SECRET_KEY
);




// // Dummy data for the process
// const dummyData = {
// 	country: 'NG',
// 	account_number: '0690000031',
// 	bank_name: 'Access Bank', // Bank code, e.g., GTBank for Nigeria
// 	amount: 10000,
// 	narration: 'Payment for services rendered',
// 	currency: 'NGN',
// 	reference: 'unique-transfer-ref-9p8',
// 	transfer_id: null, // This will store the transfer ID from the created transfer
// 	transaction_id: null, // This will store the transaction ID
// 	account_name: 'Forrest Green',
// };

// const runFullTransferFlow = async () => {
// 	try {
// 	} catch (error) {
// 		console.error(
// 			'Error during transfer flow:',
// 			error.response ? error.response.data : error
// 		);
// 	}
// };

// runFullTransferFlow();



// const runFullTransferFlow = async () => {
// 	try {
//     // Step 5 - Get bank code
// 		console.log('Fetching Bank List...');
// 		const bankCodeResponse = await flw.Bank.country({
// 			country: dummyData.country,
// 			account_bank: dummyData.bank_name,
// 		});
// 		console.log(bankCodeResponse);

// 		// Filter the bank list for the bank with the name "Access Bank"
// 		const selectedBank = bankCodeResponse.data.find(
// 			(bank) => bank.name === dummyData.bank_name
// 		);

// 		if (!selectedBank) {
// 			throw new Error(
// 				`Bank code with name ${dummyData.bank_name} not found`
// 			);
// 		}

// 		console.log(
// 			`Bank Found: ${selectedBank.name} with code ${selectedBank.code}`
// 		);
    
//     // Step 6 - Get account details and validate
//     console.log('Verifying Account Details...');
// 		const resolveAccountResponse = await flw.Misc.verify_Account({
// 			account_number: dummyData.account_number,
// 			account_bank: selectedBank.code,
// 		});
// 		console.log('Account Verified:', resolveAccountResponse);
    
//     //Step 7 - Initiate the transfer
//     console.log('Initiating Transfer...');
// 		const transferResponse = await flw.Transfer.initiate({
// 			account_bank: selectedBank.code,
// 			account_number: dummyData.account_number,
// 			amount: dummyData.amount,
// 			narration: dummyData.narration,
// 			currency: dummyData.currency,
// 			reference: dummyData.reference,
// 			callback_url: 'https://example.com/callback',
// 			debit_currency: 'NGN',
// 		});
// 		console.log('Transfer Initiated:', transferResponse);

// 		// Save the transfer ID for future steps
// 		dummyData.transfer_id = transferResponse.data.id;
    
// 		// Step 8 - Fetch the transfer data
//     console.log("Fetching Transfer Details...");
//     const fetchTransferResponse = await flw.Transfer.get_a_transfer({ id: dummyData.transfer_id });
//     console.log("Transfer Details:", fetchTransferResponse);
    
//     // Step 9 - Verify the transaction
//     console.log('Verifying Transaction Details...');

// 		// Compare important fields from the response to your dummy data
// 		const matches =
// 			fetchTransferResponse.data.account_number ===
// 				dummyData.account_number &&
// 			fetchTransferResponse.data.amount === dummyData.amount &&
// 			fetchTransferResponse.data.narration === dummyData.narration &&
// 			fetchTransferResponse.data.reference === dummyData.reference &&
// 			fetchTransferResponse.data.currency === dummyData.currency &&
// 			fetchTransferResponse.data.full_name === dummyData.account_name; // Add any other necessary fields

// 		// Output the result of the comparison
// 		console.log(matches);

// 		// Conditional logic to determine if the transaction details match
// 		if (matches) {
// 			console.log(
// 				'Transaction details match with dummy data. Verification successful.'
// 			);
// 		} else {
// 			console.log(
// 				'Transaction details do not match with dummy data. Verification failed.'
// 			);
// 		}
    
// 	} catch (error) {
// 		console.error(
// 			'Error during transfer flow:',
// 			error.response ? error.response.data : error
// 		);
// 	}
// };



