import { transform } from 'babel-core';
import { expect } from 'chai';
import { minify } from 'uglify-js';

const uglify = code => minify(code, {
  fromString: true,
  mangle: false
}).code;

const config = {
  plugins: [
    './src',
    ['transform-react-jsx', { pragma: 'j' }],
    ['transform-es2015-arrow-functions', {}]
  ]
};

const configWithoutPlugin = {
  plugins: [
    ['transform-react-jsx', { pragma: 'j' }],
    ['transform-es2015-arrow-functions', {}]
  ]
};

describe('jsx-remove-data-test-id', () => {
  it('does not replace data-something-else', () => {
    const code = '<p data-something-else="cake-day">hi, finally it is cake time</p>';
    const actual = transform(code, config).code;
    const expected = transform(code, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  it('does not remove attributes that contain "data-test-id" in part only', () => {
    const code = '<p data-test-id-not="not-test-id">hi, finally it is cake time</p>';
    const actual = transform(code, config).code;
    const expected = transform(code, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  it('removes data-test-id', () => {
    const code = '<p data-test-id="test-id"></p>';
    const expectedCode = '<p></p>';
    const actual = transform(code, config).code;
    const expected = transform(expectedCode, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  it('removes data-test-id funcs', () => {
    const code = '<p data-test-id={() => {}}></p>';
    const expectedCode = '<p></p>';
    const actual = transform(code, config).code;
    const expected = transform(expectedCode, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  it('removes data-test-id bools', () => {
    const code = '<p data-test-id={false}></p>';
    const expectedCode = '<p></p>';
    const actual = transform(code, config).code;
    const expected = transform(expectedCode, configWithoutPlugin).code;
    expect(uglify(actual)).to.equal(uglify(expected));
  });

  describe('with invalid options.attributes', () => {
    it('throws error when attributes is empty string', () => {
      const configWithErroneousAttributesOption = {
        plugins: [
          ['./src', {attributes: ''}],
          ['transform-react-jsx', { pragma: 'j' }],
          ['transform-es2015-arrow-functions', {}]
        ]
      };
      const code = '<p selenium-id={false}></p>';
      const expectedCode = '<p></p>';
      const action = () => transform(code, configWithErroneousAttributesOption);
      expect(action).to.throw();
    });

    it('throws error when attributes is empty array', () => {
      const configWithErroneousAttributesOption = {
        plugins: [
          ['./src', {attributes: []}],
          ['transform-react-jsx', { pragma: 'j' }],
          ['transform-es2015-arrow-functions', {}]
        ]
      };
      const code = '<p selenium-id={false}></p>';
      const expectedCode = '<p></p>';
      const action = () => transform(code, configWithErroneousAttributesOption);
      expect(action).to.throw();
    });
  })

  describe('with valid options.attributes', () => {
    const configWithValidAttributesOption = {
      plugins: [
        ['./src', { attributes: [ 'selenium-id', 'useless-attr' ] }],
        ['transform-react-jsx', { pragma: 'j' }],
        ['transform-es2015-arrow-functions', {}]
      ]
    };

    it('does not remove attributes that match options.attributes in part only', () => {
      const code = '<p selenium-id-not="not-test-id" no-useless-attr="useless">hi, finally it is cake time</p>';
      const actual = transform(code, configWithValidAttributesOption).code;
      const expected = transform(code, configWithoutPlugin).code;
      expect(uglify(actual)).to.equal(uglify(expected));
    });

    it('removes options.attributes', () => {
      const code = '<p selenium-id="test-id" useless-attr="useless"></p>';
      const expectedCode = '<p></p>';
      const actual = transform(code, configWithValidAttributesOption).code;
      const expected = transform(expectedCode, configWithoutPlugin).code;
      expect(uglify(actual)).to.equal(uglify(expected));
    });

    it('removes options.attributes funcs', () => {
      const code = '<p selenium-id={() => {}} useless-attr={() => {}}></p>';
      const expectedCode = '<p></p>';
      const actual = transform(code, configWithValidAttributesOption).code;
      const expected = transform(expectedCode, configWithoutPlugin).code;
      expect(uglify(actual)).to.equal(uglify(expected));
    });

    it('removes options.attributes bools', () => {
      const code = '<p selenium-id={false} useless-attr={true}></p>';
      const expectedCode = '<p></p>';
      const actual = transform(code, configWithValidAttributesOption).code;
      const expected = transform(expectedCode, configWithoutPlugin).code;
      expect(uglify(actual)).to.equal(uglify(expected));
    });
  })
});
