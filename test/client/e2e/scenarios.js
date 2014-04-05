'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('KOAN app', function() {

  browser.get('index.html');

  it('should automatically redirect to /login.html when user is not authenticated', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/login.html");
  });

});