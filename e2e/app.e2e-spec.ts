import { SuperSystemPage } from './app.po';

describe('super-system App', function() {
  let page: SuperSystemPage;

  beforeEach(() => {
    page = new SuperSystemPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
