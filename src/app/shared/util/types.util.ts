import { IOptionItem } from "src/app/models/generic.model";

export function GetTypes(type: any, skip = 2): IOptionItem[] {
  const keys = Object.keys(type);
  const types: IOptionItem[] = [];
  const values = skip > 0 ? keys.slice(keys.length / skip) : keys;
  values.forEach(key => {
    let result: string;
    if (type[type[key]])
      result = type[type[key]]?.replace(/([A-Z])/g, ' $1');
    else
      result = key.replace(/([A-Z])/g, ' $1');
    if (result) {
      types.push({
        label: (result.charAt(0).toUpperCase() + result.slice(1)).trim(),
        value: type[key]
      });
    }
  });
  return types;
}