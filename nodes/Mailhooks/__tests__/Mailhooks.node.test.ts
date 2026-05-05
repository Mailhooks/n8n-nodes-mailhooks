import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Mailhooks } from '../Mailhooks.node';

describe('Mailhooks action node', () => {
	it('should have the correct node name', () => {
		const node = new Mailhooks();
		expect(node.description.name).toBe('mailhooks');
	});

	it('should have the correct display name', () => {
		const node = new Mailhooks();
		expect(node.description.displayName).toBe('Mailhooks');
	});

	it('should have main input and output', () => {
		const node = new Mailhooks();
		expect(node.description.inputs).toBeDefined();
		expect(node.description.outputs).toBeDefined();
	});

	it('should be usable as a tool', () => {
		const node = new Mailhooks();
		expect(node.description.usableAsTool).toBe(true);
	});

	it('should require mailhooksApi credentials', () => {
		const node = new Mailhooks();
		const creds = node.description.credentials as Array<{ name: string; required: boolean }>;
		expect(creds[0].name).toBe('mailhooksApi');
		expect(creds[0].required).toBe(true);
	});

	describe('Resources', () => {
		it('should have Domain, Email, Inbox, Utility, and Webhook resources', () => {
			const node = new Mailhooks();
			const resourceProp = node.description.properties.find((p) => p.name === 'resource');
			const optionValues = (resourceProp?.options as Array<{ name: string; value: string }>).map(
				(o) => o.value,
			);
			expect(optionValues).toContain('domain');
			expect(optionValues).toContain('email');
			expect(optionValues).toContain('inbox');
			expect(optionValues).toContain('utility');
			expect(optionValues).toContain('webhook');
		});

		it('should default to email resource', () => {
			const node = new Mailhooks();
			const resourceProp = node.description.properties.find((p) => p.name === 'resource');
			expect(resourceProp?.default).toBe('email');
		});
	});

	describe('Email operations', () => {
		it('should have all 7 email operations', () => {
			const node = new Mailhooks();
			const emailOpProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions as { show?: { resource?: string[] } })?.show?.resource?.includes(
						'email',
					),
			);
			const opValues = (emailOpProp?.options as Array<{ value: string }>).map((o) => o.value);
			expect(opValues).toContain('delete');
			expect(opValues).toContain('downloadAttachment');
			expect(opValues).toContain('downloadEml');
			expect(opValues).toContain('get');
			expect(opValues).toContain('getContent');
			expect(opValues).toContain('list');
			expect(opValues).toContain('markAsRead');
			expect(opValues).toContain('markAsUnread');
		});
	});

	describe('Domain operations', () => {
		it('should have List and Verify operations', () => {
			const node = new Mailhooks();
			const domainOpProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions as { show?: { resource?: string[] } })?.show?.resource?.includes(
						'domain',
					),
			);
			const opValues = (domainOpProp?.options as Array<{ value: string }>).map((o) => o.value);
			expect(opValues).toContain('list');
			expect(opValues).toContain('verify');
		});
	});

	describe('Inbox operations', () => {
		it('should have List, Get, and Create operations', () => {
			const node = new Mailhooks();
			const inboxOpProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions as { show?: { resource?: string[] } })?.show?.resource?.includes(
						'inbox',
					),
			);
			const opValues = (inboxOpProp?.options as Array<{ value: string }>).map((o) => o.value);
			expect(opValues).toContain('list');
			expect(opValues).toContain('get');
			expect(opValues).toContain('create');
		});
	});

	describe('Webhook operations', () => {
		it('should have List, Get, Create, Update, and Delete operations', () => {
			const node = new Mailhooks();
			const webhookOpProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions as { show?: { resource?: string[] } })?.show?.resource?.includes(
						'webhook',
					),
			);
			const opValues = (webhookOpProp?.options as Array<{ value: string }>).map((o) => o.value);
			expect(opValues).toContain('list');
			expect(opValues).toContain('get');
			expect(opValues).toContain('create');
			expect(opValues).toContain('update');
			expect(opValues).toContain('delete');
		});
	});

	describe('Utility operations', () => {
		it('should have Verify Webhook operation', () => {
			const node = new Mailhooks();
			const utilOpProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions as { show?: { resource?: string[] } })?.show?.resource?.includes(
						'utility',
					),
			);
			const opValues = (utilOpProp?.options as Array<{ value: string }>).map((o) => o.value);
			expect(opValues).toContain('verifyWebhook');
		});
	});

	describe('Dynamic loading', () => {
		it('should have inboxId parameter with dynamic inbox loading', () => {
			const node = new Mailhooks();
			const inboxIdProp = node.description.properties.find((p) => p.name === 'inboxId');
			expect(inboxIdProp).toBeDefined();
			expect(inboxIdProp?.type).toBe('options');
			expect((inboxIdProp?.typeOptions as { loadOptionsMethod?: string })?.loadOptionsMethod).toBe('getInboxes');
		});

		it('should have webhookInboxId parameter with dynamic inbox loading', () => {
			const node = new Mailhooks();
			const webhookInboxIdProp = node.description.properties.find((p) => p.name === 'webhookInboxId');
			expect(webhookInboxIdProp).toBeDefined();
			expect(webhookInboxIdProp?.type).toBe('options');
			expect((webhookInboxIdProp?.typeOptions as { loadOptionsMethod?: string })?.loadOptionsMethod).toBe('getInboxes');
		});
	});

	describe('Field visibility', () => {
		it('should show emailId for relevant email operations', () => {
			const node = new Mailhooks();
			const emailIdProp = node.description.properties.find((p) => p.name === 'emailId');
			expect(emailIdProp).toBeDefined();
			const showOps = (emailIdProp?.displayOptions as { show?: { operation?: string[] } })?.show
				?.operation;
			expect(showOps).toContain('delete');
			expect(showOps).toContain('get');
			expect(showOps).toContain('getContent');
			expect(showOps).toContain('markAsRead');
			expect(showOps).toContain('markAsUnread');
			expect(showOps).toContain('downloadEml');
			expect(showOps).toContain('downloadAttachment');
		});

		it('should show webhookId for webhook get, update, delete', () => {
			const node = new Mailhooks();
			const webhookIdProp = node.description.properties.find((p) => p.name === 'webhookId');
			expect(webhookIdProp).toBeDefined();
			const showOps = (webhookIdProp?.displayOptions as { show?: { operation?: string[] } })?.show
				?.operation;
			expect(showOps).toContain('get');
			expect(showOps).toContain('update');
			expect(showOps).toContain('delete');
		});

		it('should have an execute method', () => {
			const node = new Mailhooks();
			expect(typeof node.execute).toBe('function');
		});
	});

	describe('Error handling', () => {
		it('should throw NodeApiError when API call fails and continueOnFail is false', async () => {
			const node = new Mailhooks();
			const apiError = new Error('Network error');
			(apiError as any).statusCode = 500;
			(apiError as any).response = { body: { message: 'Internal server error' } };

			// Mock `this` context with minimal n8n IExecuteFunctions surface
			const mockThis = {
				getInputData: () => [{ json: {} }],
				getNodeParameter: (name: string) => {
					if (name === 'resource') return 'email';
					if (name === 'operation') return 'list';
					if (name === 'filters') return {};
					if (name === 'options') return {};
					return '';
				},
				getCredentials: async () => ({ baseUrl: 'https://test.example/api' }),
				continueOnFail: () => false,
				getNode: () => ({ name: 'mailhooks' }),
				helpers: {
					httpRequestWithAuthentication: {
						call: async () => { throw apiError; },
					},
				},
			};

			// NodeApiError wraps the original error — the mock exports a NodeApiError class
			await expect(node.execute.call(mockThis as any)).rejects.toThrow();
			try {
				await node.execute.call(mockThis as any);
			} catch (err: any) {
				expect(err.name).toBe('NodeApiError');
			}
		});

		it('should push error to returnData when continueOnFail is true', async () => {
			const node = new Mailhooks();
			const apiError = new Error('Transient failure');

			const mockThis = {
				getInputData: () => [{ json: {} }],
				getNodeParameter: (name: string) => {
					if (name === 'resource') return 'email';
					if (name === 'operation') return 'list';
					if (name === 'filters') return {};
					if (name === 'options') return {};
					return '';
				},
				getCredentials: async () => ({ baseUrl: 'https://test.example/api' }),
				continueOnFail: () => true,
				getNode: () => ({ name: 'mailhooks' }),
				helpers: {
					httpRequestWithAuthentication: {
						call: async () => { throw apiError; },
					},
				},
			};

			const result = await node.execute.call(mockThis as any);
			expect(result).toBeDefined();
			expect(result[0]).toBeDefined();
			expect(result[0].length).toBe(1);
			expect(result[0][0].json).toEqual({ error: 'Transient failure' });
		});
	});

	describe('Codex definition', () => {
		const codexPath = resolve(__dirname, '..', 'Mailhooks.node.json');

		it('should not contain unsupported subcategories field', () => {
			const raw = readFileSync(codexPath, 'utf8');
			const codex = JSON.parse(raw);
			expect(codex).not.toHaveProperty('subcategories');
		});

		it('should only contain supported fields', () => {
			const raw = readFileSync(codexPath, 'utf8');
			const codex = JSON.parse(raw);
			const supported = ['node', 'nodeVersion', 'codexVersion', 'categories', 'resources', 'alias'];
			for (const key of Object.keys(codex)) {
				expect(supported).toContain(key);
			}
		});

		it('should have required fields', () => {
			const raw = readFileSync(codexPath, 'utf8');
			const codex = JSON.parse(raw);
			expect(codex.node).toBeDefined();
			expect(codex.nodeVersion).toBeDefined();
			expect(codex.codexVersion).toBeDefined();
			expect(codex.categories).toBeDefined();
			expect(codex.resources).toBeDefined();
			expect(codex.alias).toBeDefined();
		});
	});
});