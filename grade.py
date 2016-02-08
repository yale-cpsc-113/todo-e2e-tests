import sys
import json
import requests
import subprocess
# https://github.com/xolox/python-capturer
from capturer import CaptureOutput
import logging
logging.basicConfig(format='%(filename)s %(levelname)s ' \
        + 'line %(lineno)d --- %(message)s',)
logging.root.setLevel(logging.INFO)

def count_passes(url):
    logging.info('Testing {0}'.format(url))
    command = 'casperjs test test.js --base_url={url} --no-colors --includes=test-utils.js'
    with CaptureOutput() as capturer:
        subprocess.call([
            'casperjs',
            'test',
            'test.js',
            '--base_url={url}'.format(url=url),
            '--no-colors',
            '--includes=test-utils.js'])
        passes = capturer.get_text().count('PASS')
        return passes

def grade_submission(submission):
    url = submission['submission']['url']
    test_results = [count_passes(url) for i in range(3)]
    return max(test_results)

def main(infile, outfile):
    failed = []
    submissions = json.load(open(infile))
    with open(outfile, 'w') as fh:
        for s in submissions:
            score = grade_submission(s)
            fh.write("{0}, {1}, {2}, {3}\n".format(s['_id'], s['submission']['url'], s['submission']['repo'], score))



if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
