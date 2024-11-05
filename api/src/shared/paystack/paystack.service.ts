import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class PaystackService {
	private readonly base_url = 'https://api.paystack.co';
	private readonly secret_key = process.env.PAYSTACK_SECRET_KEY;

	// ########################################
	// ########## INITIALIZE PAYMENT ##########
	// ########################################
	async initialize_transaction(email: string, amount: number) {
		try {
			const response = await fetch(`${this.base_url}/transaction/initialize`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${this.secret_key}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					amount: amount * 100,
					callback_url: `${process.env.FRONTEND_BASE_URL}/checkout/success`,
					metadata: {
						cancel_action: `${process.env.FRONTEND_BASE_URL}/checkout/cancelled`,
					},
				}),
			});

			if (!response.ok) {
				throw new HttpException(
					`Paystack API error: ${response.statusText}`,
					response.status,
				);
			}

			const data = await response.json();

			return data;
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to initialize transaction',
				error.status || 500,
			);
		}
	}

	// ########################################
	// ########## VERIFY TRANSACTION ##########
	// ########################################
	async verify_transaction(transaction_reference: string) {
		try {
			const response = await fetch(
				`${this.base_url}/transaction/verify/${transaction_reference}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${this.secret_key}`,
						'Content-Type': 'application/json',
					},
				},
			);

			if (!response.ok) {
				throw new HttpException(
					`Paystack API error: ${response.statusText}`,
					response.status,
				);
			}

			const data = await response.json();

			return data;
		} catch (error) {
			throw new HttpException(
				error.message || 'Failed to initialize transaction',
				error.status || 500,
			);
		}
	}
}
