import { MyIdleAppPage } from './app.po';

describe('my-idle-app App', function() {
  let page: MyIdleAppPage;

  beforeEach(() => {
    page = new MyIdleAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
