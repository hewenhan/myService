const { STS } = require('ali-oss');
const path = require('path');

let policy = `{
	"Statement": [
	{
		"Action": [
		"oss:*"
		],
		"Effect": "Allow",
		"Resource": ["acs:oss:*:*:*"]
	}
	],
	"Version": "1"
}`;

const client = new STS({
	accessKeyId: __config.aliYunOssSts.AccessKeyId,
	accessKeySecret: __config.aliYunOssSts.AccessKeySecret
});

module.exports = (req, res, next) => {
	client.assumeRole(__config.aliYunOssSts.RoleArn, policy, __config.aliYunOssSts.TokenExpireTime).then((result) => {
		res.success({
			AccessKeyId: result.credentials.AccessKeyId,
			AccessKeySecret: result.credentials.AccessKeySecret,
			SecurityToken: result.credentials.SecurityToken,
			Expiration: result.credentials.Expiration
		});
	}).catch((err) => {
		res.error(err.message);
	});
};