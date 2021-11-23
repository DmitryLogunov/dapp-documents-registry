import { PropertyInfo, getPropertiesInfo } from "./property-info.decorator";
require('./mocks/metadata.mock');

class TestClass {
  @PropertyInfo({
    info1: 'value1',
    info2: 'value2',
    dbPropertyName: 'dbProperty1'
  })
  property1: string;

  @PropertyInfo({
    info3: 'value3',
    info4: 'value4'
  })
  property2: number;
}

describe('PropertyInfoDecorator', () => {
  it('should return all properties info as default behavior', () => {
    const propertiesInfo = getPropertiesInfo<TestClass>(TestClass);

    expect(Object.keys(propertiesInfo).includes('property1')).toBeFalsy();
    expect(Object.keys(propertiesInfo).includes('dbProperty1')).toBeTruthy();
    expect(Object.keys(propertiesInfo).includes('property2')).toBeTruthy();
    expect(propertiesInfo['dbProperty1'].info1).toBe('value1');
    expect(propertiesInfo['dbProperty1'].info2).toBe('value2');
    expect(propertiesInfo['dbProperty1'].dbPropertyName).toBe('dbProperty1');
    expect(propertiesInfo['property2'].info3).toBe('value3');
    expect(propertiesInfo['property2'].info4).toBe('value4');
  });

  it('should return only DB properties info if \'onlyDBFields\' is true', () => {
    const propertiesInfo = getPropertiesInfo<TestClass>(TestClass, true);

    expect(propertiesInfo['dbProperty1'].info1).toBe('value1');
    expect(propertiesInfo['dbProperty1'].info2).toBe('value2');
    expect(propertiesInfo['dbProperty1'].dbPropertyName).toBe('dbProperty1');
    expect(propertiesInfo['property2']?.info3).toBeUndefined();
    expect(propertiesInfo['property2']?.info4).toBeUndefined();
  });
});