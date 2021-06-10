import { expect } from 'chai';
import * as sinon from 'sinon';
import LoginCommand from '../../src/commands/auth/login';
import { authHandler, cliux, interactive } from '../../src/utils';
import * as Configstore from 'configstore';

const user = { email: 'test@contentstack.com', authtoken: 'testtoken' };
const credentials = { email: 'test@contentstack.com', password: 'testpassword' };
const invalidCredentials = { email: 'test@contentstack.com', password: 'invalidpassword' };
const TFATestToken = '24563992';

describe('Login Command', () => {
  let inquireStub;
  let loginStub;
  let managementClientStub;
  const config = new Map();

  before(function () {
    managementClientStub = sinon.stub(LoginCommand.prototype, 'managementAPIClient').get(() => {});
    loginStub = sinon.stub(authHandler, 'login').callsFake(function (email, password, tfaToken): Promise<any> {
      if (password === credentials.password) {
        return Promise.resolve({ user });
      }
      return Promise.reject({ message: 'invalid credentials' });
    });

    // const stub = sinon.stub().callsFake((configName) => {
    //   return config;
    // });
    // Object.setPrototypeOf(Configstore, stub);
    // Configstore.prototype.constructor = function Configstore() {
    //   console.log('HELOOOOOOOO THERE');
    //   this.get = function (key) {
    //     return config.get(key);
    //   };
    //   this.set = function (key, value) {
    //     return config.set(key, value);
    //   };
    // };
    // sinon.stub(Configstore.prototype, 'constructor').callsFake((configName) => {
    //   console.log('called', configName);
    //   return config;
    // });
  });

  after(() => {
    loginStub.restore();
    managementClientStub.restore();
  });

  it('Login with valid credentials, should be successful', async function () {
    const cliuxStub1 = sinon.stub(cliux, 'success').returns();
    await LoginCommand.run(['-u', credentials.email, '-p', credentials.password]);
    expect(cliuxStub1.calledOnce).to.be.true;
    expect(config.get('email')).to.be.equal(credentials.email);
    cliuxStub1.restore();
  });

  it('Login with invalid credentials, should print error message', async function () {
    const cliuxStub2 = sinon.stub(cliux, 'error').returns();
    await LoginCommand.run(['-u', invalidCredentials.email, '-p', invalidCredentials.password]);
    expect(cliuxStub2.calledOnce).to.be.true;
    cliuxStub2.restore();
  });

  it('Login with with only email, should prompt for password', async function () {
    const askPasswordStub = sinon.stub(interactive, 'askPassword').resolves(credentials.password);
    await LoginCommand.run(['-u', credentials.email]);
    expect(askPasswordStub.calledOnce).to.be.true;
    askPasswordStub.restore();
  });

  it('Login with no flags, should prompt for credentials', async function () {
    const askPasswordStub = sinon.stub(interactive, 'askPassword').resolves(credentials.password);
    const askEmailStub = sinon.stub(cliux, 'inquire').resolves(credentials.email);
    await LoginCommand.run([]);
    expect(askPasswordStub.calledOnce).to.be.true;
    expect(askEmailStub.calledOnce).to.be.true;
    askPasswordStub.restore();
    askEmailStub.restore();
  });
});
