const assert = require('assert');
const hoodiecrow = require('hoodiecrow-imap');
const notifier = require('../../index')

describe('mail notifier', function() {
	const getMockMailboxConfig = function(emailMessages) {
		return {
			plugins : ['ID', 'STARTTLS', 'AUTH-PLAIN', 'NAMESPACE', 'IDLE', 'ENABLE'],
			id : {
				name : 'hoodiecrow',
				version : '0.1',
			},
			storage : {
				INBOX : {
					messages : emailMessages
				},
			},
		};
	}

	it('should work', function(done) {
		const imap = {
			user : 'testuser',
			password : 'testpass',
			host : 'localhost',
			port : 1143,
		};

		this.server = hoodiecrow(getMockMailboxConfig([{
			raw : 'Subject: hello world!'
		}]));
		this.server.listen(1143);

		notifier(imap)
			.on('mail', function(mail) {
				assert.strictEqual(mail.subject, 'hello world!')
				this.stop();
			})
			.once('end', () => {
				this.server.close(done);
			})
			.start();
	});
});
