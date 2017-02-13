import { Angular2ExpressAppPage } from './app.po';

describe('angular2-express-app App', function() {
  let page: Angular2ExpressAppPage;

  beforeEach(() => {
    page = new Angular2ExpressAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
