const metadata = {};
const ReflectMock = Reflect;
ReflectMock.getMetadataKeys = (target: unknown) => {
  return (metadata[target.constructor.name] && Object.keys(metadata[target.constructor.name])) || []
};
ReflectMock.defineMetadata = (key: string, value: unknown, target: unknown) => {
  if (!metadata[target.constructor.name]) {
    metadata[target.constructor.name] = {};
  }
  metadata[target.constructor.name][key]= value;
};
ReflectMock.getMetadata = (key: string, target: unknown) => {
  return metadata[target.constructor.name] && metadata[target.constructor.name][key];
};

exports.default = ReflectMock;