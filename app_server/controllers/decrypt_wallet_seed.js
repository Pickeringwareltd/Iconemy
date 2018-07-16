const NodeRSA = require('node-rsa');
const priv_key = '-----BEGIN PRIVATE KEY-----MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCaq04PIq58SXXTuHzD/BmjqsHv6uBnJnPovslm/uLhIVnaBASqSC5FPvJyFh4cR05i81bh+dZgDBY/J3lZmJrEPKUHJL7kJidUPt1qDMC7m4kNnyurNsXiY+DNmPB+uozNfIu15yrP8da0PXwaQozp1uywAJZYdRiuQinrHqJMhDd1MTtIAr95leUt0BuQGx3aPvgWs/JfzLFmM5LeqLbeWzu3kgUdhVB+OD9LnMblv59BX4GPMJzJj4w24J+1WNDHHU105vqWqrH8jJp0DPWmUCIAgNV1upVXdtLNAPhCiAJizuUSCH2dq3VcqE1mdF0V2mxONNPr9v4rGMVx2y21AgMBAAECggEBAJTjGGZLfWmZEXp4mmnS0R+S7dO05sWE54kBt0CVVfNftm2+9nqwtxHjcWFPVzbjkVqBYn5vkOSuXe/3YMJVu43xzu6cecGH1M4tIdjHY/R02a6qLVBIjp7KhImFkuR7UbUxEhBN8hFwfLzOfxuMOreTNA6M0i1esx50BIQX3iYGlSEQjcPzfNePZP4QYZtC9vq2e3weIIEep/x2n3uL0BQdFIzRIzIy7xKP93UlO+FVNhIPR1CoEzNRakvmwesL3H9Y7a0jtpUvJW1s9SeZjSyzik9oZMa433pFTOATM5h42D0L0zVnO2aM0dWnRnR4Botp4EPjKlGvr4B+OarwZsECgYEAz92/56ZDSwGk2MfKsqMkF4xXPuJQy8MCoFelbspQssxTzO4QzbCynMqgI4jPe8jR5nPni8JKn06SM2XjEcZij2eCEEdCyckO5FuggfJxskT9u8Jp3EGoPPe4zfvPM1Lol2BgJ3s+zswT5k9CpokJPtR+LvixmJ/802SJkHCoXNECgYEAvnwMlhPkJKZQblBB1Un4LAo4xmDPgpmHulO+avhX2uhSSCkW7qdTOfJXVRDkp5HXDYnQZnrnMzJ5ASkfnfiUfIhWdz4Jp7tvNnISho/jLIiBiSglWIKz6czNj1gFgMwbNpLr6tNPN3PoGzfOPUikYg+TkO56Hu7IosAbxIDMa6UCgYEAzzm7kj3Pglw+MhtjuRko5wzzAW7vq2NbH+ygsUWik81dkcSYHecU+XiLk0FVz4rRrtRHtq3YZN8Yo4Lkj5jeMya2pHHWZII7hW7PIh1IObfL2L4leP4/saAorblmxDzYQelDkrisUc9j20uTH6EoBWoj7cHik0yT6U6mUcfuILECgYBNSkhRHQEVXeaE3EvaH4lzVTJ0TBPnCiToldJN1TbQvDOm1AVaEMrUWGDXQ2OEGskH1UOaUYQ+Ydx3fBg4IQUfArMS7zk7tfIKRX7+2qNzDnCBFqkQoPgfhdpir3SMLkVcf4D6Z4NdHMqxQJOOikso/ukBhcJHitweLZUWxqwrgQKBgQCFx+RlBemCjj+bHOtftN8w+YVkYdOeCq9tnpCk5ffRmh3FeYSH9RQl+EOB+OBj5ZcPqvyo5kgEqLyxZvOg999bg0dBsF3b5JNyX1fY58CXkOSUGx1x3i1D6Nad0HiC13KrUmKhIckfLu4htUalds1MGkS2Dn8rVp1bpfEDcugMqQ==-----END PRIVATE KEY-----';


/*	This function successfully decrypts wallet seeds such that we can deal with payments
 *	We pass an encrypted seed into the function and it will return the decrypted version of the wallet seed
 *	This should be ran on a PC with no network connection and the keys should be output onto a piece of paper
 *  such that they can not be accessed on-line. ('Cold storing the keys')
*/
module.exports.decryptSeed = function(encrypted_seed){
	var decrypted_seed;
	const key = new NodeRSA();

	// import the private key declared at the top of the file (should be kept secret)
	key.importKey(priv_key, 'pkcs8');

	// Decrypt the encrypted_seed (param) to the utf-8 scheme
	decrypted_seed = key.decrypt(encrypted_seed, 'utf8');

	// Return the decrypted wallet seed
	return decrypted_seed;
};