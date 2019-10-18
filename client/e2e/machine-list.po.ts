import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class MachinePage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/machines');
  }

  // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
  highlightElement(byObject) {
    function setStyle(element, style) {
      const previous = element.getAttribute('style');
      element.setAttribute('style', style);
      setTimeout(() => {
        element.setAttribute('style', previous);
      }, 200);
      return 'highlighted';
    }

    return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
  }

  getMachineTitle() {
    const title = element(by.id('machine-list-title')).getText();
    this.highlightElement(by.id('machine-list-title'));

    return title;
  }

  typeAName(name: string) {
    const input = element(by.id('machineName'));
    input.click();
    input.sendKeys(name);
  }

  selectUpKey() {
    browser.actions().sendKeys(Key.ARROW_UP).perform();
  }

  backspace() {
    browser.actions().sendKeys(Key.BACK_SPACE).perform();
  }

  getCompany(company: string) {
    const input = element(by.id('machineCompany'));
    input.click();
    input.sendKeys(company);
    this.click('submit');
  }

  getMachineByAge() {
    const input = element(by.id('machineName'));
    input.click();
    input.sendKeys(Key.TAB);
  }

  getUniqueMachine(email: string) {
    const machine = element(by.id(email)).getText();
    this.highlightElement(by.id(email));

    return machine;
  }

  getMachines() {
    return element.all(by.className('machines'));
  }

  elementExistsWithId(idOfElement: string): promise.Promise<boolean> {
    if (element(by.id(idOfElement)).isPresent()) {
      this.highlightElement(by.id(idOfElement));
    }
    return element(by.id(idOfElement)).isPresent();
  }

  elementExistsWithCss(cssOfElement: string): promise.Promise<boolean> {
    return element(by.css(cssOfElement)).isPresent();
  }

  click(idOfButton: string): promise.Promise<void> {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton)).click();
  }

  field(idOfField: string) {
    return element(by.id(idOfField));
  }

  button(idOfButton: string) {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton));
  }

  getTextFromField(idOfField: string) {
    this.highlightElement(by.id(idOfField));
    return element(by.id(idOfField)).getText();
  }

}
