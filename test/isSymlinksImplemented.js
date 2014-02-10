var fs = require('fs');

/**
 * If OS has the symlinks support, returns true
 */
module.exports = function() {
	var notImplementedCode = 35;

	//random names for tmp files
	var orig = 'tmp_test_orig_' + (new Date()).getTime();
	var link = 'tmp_test_link_' + (new Date()).getTime();

	//delete tmp files
	var cleaner = function() {
		console.log(orig, link, fs.existsSync(orig));
		if (fs.existsSync(orig)) {
			fs.unlinkSync(orig);
		}
		if (fs.existsSync(link)) {
			fs.unlinkSync(link);
		}
	}

	//trying to create symlink to tmp file
	try {
		fs.writeFileSync(orig, 'text');
		fs.symlinkSync(orig, link);
	} catch(e) {
		cleaner();
		if (e.errno === notImplementedCode) {
			return false;
		}

		//some unkown error
		throw e;
	}

	cleaner();
	return true;
}