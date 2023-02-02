/**
 * Parse MIME type.
 *
 * @remarks
 * The code is based on:
 * https://github.com/jsdom/whatwg-mimetype.
 */

function removeLeadingAndTrailingHTTPWhitespace(text: string) {
  return text.replace(/^[ \t\n\r]+/u, "").replace(/[ \t\n\r]+$/u, "");
}

function removeTrailingHTTPWhitespace(text: string) {
  return text.replace(/[ \t\n\r]+$/u, "");
}

function isHTTPWhitespaceChar(char: string) {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
}

function solelyContainsHTTPTokenCodePoints(string: string) {
  return /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/u.test(string);
}

function solelyContainsHTTPQuotedStringTokenCodePoints(text: string) {
  return /^[\t\u0020-\u007E\u0080-\u00FF]*$/u.test(text);
}

function asciiLowercase(text: string) {
  return text.replace(/[A-Z]/gu, (l) => l.toLowerCase());
}

// This variant only implements it with the extract-value flag set.
function collectAnHTTPQuotedString(
  input: string,
  position: number
): [string, number] {
  let value = "";

  position++;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    while (
      position < input.length &&
      input[position] !== '"' &&
      input[position] !== "\\"
    ) {
      value += input[position];
      ++position;
    }

    if (position >= input.length) {
      break;
    }

    const quoteOrBackslash = input[position];
    ++position;

    if (quoteOrBackslash === "\\") {
      if (position >= input.length) {
        value += "\\";
        break;
      }

      value += input[position];
      ++position;
    } else {
      break;
    }
  }

  return [value, position];
}

export class MIMETypeParameters {
  private readonly _map: Map<string, string>;

  constructor(map: Map<string, string>) {
    this._map = map;
  }

  get size() {
    return this._map.size;
  }

  get(name: string) {
    name = asciiLowercase(String(name));
    return this._map.get(name);
  }

  has(name: string) {
    name = asciiLowercase(String(name));
    return this._map.has(name);
  }

  set(name: string, value: string) {
    name = asciiLowercase(String(name));
    value = String(value);

    // TODO: fix this down the line
    if (!solelyContainsHTTPTokenCodePoints(name)) {
      throw new Error(
        `Invalid MIME type parameter name "${name}": ` +
          `only HTTP token code points are valid.`
      );
    }
    if (!solelyContainsHTTPQuotedStringTokenCodePoints(value)) {
      throw new Error(
        `Invalid MIME type parameter value "${value}": ` +
          `only HTTP quoted-string token code points are valid.`
      );
    }

    return this._map.set(name, value);
  }

  clear() {
    this._map.clear();
  }

  delete(name: string) {
    name = asciiLowercase(String(name));
    return this._map.delete(name);
  }

  forEach<ThisArgT>(
    callbackFn: (value: string, key: string) => void,
    thisArg?: ThisArgT
  ) {
    this._map.forEach(callbackFn, thisArg);
  }

  keys(): IterableIterator<string> {
    return this._map.keys();
  }

  values(): IterableIterator<string> {
    return this._map.values();
  }

  entries(): IterableIterator<[string, string]> {
    return this._map.entries();
  }

  [Symbol.iterator]() {
    return this._map[Symbol.iterator]();
  }
}

export class MIMEType {
  readonly text: string;
  readonly type: string;
  readonly subtype: string;
  readonly parameters: MIMETypeParameters;

  constructor(
    text: string,
    type: string,
    subtype: string,
    parameters: MIMETypeParameters
  ) {
    this.text = text;
    this.type = type;
    this.subtype = subtype;
    this.parameters = parameters;
  }

  get essence(): string {
    return `${this.type}/${this.subtype}`;
  }

  toString() {
    return this.text;
  }
}

export function parse(input: string): MIMEType | null {
  input = removeLeadingAndTrailingHTTPWhitespace(input);

  let position = 0;
  let type = "";
  while (position < input.length && input[position] !== "/") {
    type += input[position];
    ++position;
  }

  if (type.length === 0 || !solelyContainsHTTPTokenCodePoints(type)) {
    return null;
  }

  if (position >= input.length) {
    return null;
  }

  // Skips past "/"
  ++position;

  let subtype = "";
  while (position < input.length && input[position] !== ";") {
    subtype += input[position];
    ++position;
  }

  subtype = removeTrailingHTTPWhitespace(subtype);

  if (subtype.length === 0 || !solelyContainsHTTPTokenCodePoints(subtype)) {
    return null;
  }

  const parameters = new Map<string, string>();

  while (position < input.length) {
    // Skip past ";"
    ++position;

    while (isHTTPWhitespaceChar(input[position])) {
      ++position;
    }

    let parameterName = "";
    while (
      position < input.length &&
      input[position] !== ";" &&
      input[position] !== "="
    ) {
      parameterName += input[position];
      ++position;
    }
    parameterName = asciiLowercase(parameterName);

    if (position < input.length) {
      if (input[position] === ";") {
        continue;
      }

      // Skip past "="
      ++position;
    }

    let parameterValue = null;
    if (input[position] === '"') {
      [parameterValue, position] = collectAnHTTPQuotedString(input, position);

      while (position < input.length && input[position] !== ";") {
        ++position;
      }
    } else {
      parameterValue = "";
      while (position < input.length && input[position] !== ";") {
        parameterValue += input[position];
        ++position;
      }

      parameterValue = removeTrailingHTTPWhitespace(parameterValue);

      if (parameterValue === "") {
        continue;
      }
    }

    if (
      parameterName.length > 0 &&
      solelyContainsHTTPTokenCodePoints(parameterName) &&
      solelyContainsHTTPQuotedStringTokenCodePoints(parameterValue) &&
      !parameters.has(parameterName)
    ) {
      parameters.set(parameterName, parameterValue);
    }
  }

  return new MIMEType(
    input,
    asciiLowercase(type),
    asciiLowercase(subtype),
    new MIMETypeParameters(parameters)
  );
}
