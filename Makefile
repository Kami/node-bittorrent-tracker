CWD=`pwd`
FILES=`find tests/ -name test-*.js | tr "\n" " "`

test:
	NODE_PATH=${CWD}/lib whiskey --tests "${CWD}/${FILES}"

coverage:
	NODE_PATH=${CWD}/lib whiskey --tests "${CWD}/${FILES}" --coverage --coverage-reporter html --coverage-dir coverage_html

.PHONY: test coverage
