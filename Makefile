TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =
NPM_REGISTRY = --registry=http://registry.npm.alibaba-inc.com
NPM_INSTALL_TEST = PYTHON=`which python2.6` NODE_ENV=test npm install $(NPM_REGISTRY) --disturl=http://web.npm.alibaba-inc.com/dist

build: clean
	@mkdir -p es5
	@node_modules/.bin/regenerator --include-runtime lib/index.js > es5/index.js

install:
	@$(NPM_INSTALL_TEST)

test: install
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--harmony \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require co-mocha \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov cov: install
	@NODE_ENV=test node --harmony \
		node_modules/.bin/istanbul cover --preserve-comments \
		./node_modules/.bin/_mocha \
		-- -u exports \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require co-mocha \
		$(MOCHA_OPTS) \
		$(TESTS)
	@./node_modules/.bin/alicov coverage

test-all: install test cov

totoro: install
	@./node_modules/.bin/totoro --runner=test/api.test.js \
		--browsers='linux/node/0.11,windowsXP/node/0.11,windows7/node/0.11'

autod: install
	@./node_modules/.bin/autod -w $(NPM_REGISTRY) -e ej5 --prefix='~'
	@$(MAKE) install

contributors: install
	@./node_modules/.bin/ali-contributors

clean:
	@rm -rf es5

.PHONY: test
