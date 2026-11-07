// SPDX-FileCopyrightText: 2021 aas-core3.0rc02-react-editor AUTHORS
//
// SPDX-License-Identifier: MIT

let lastId = 0;

export function next(prefix = "id") {
  lastId++;
  return `${prefix}${lastId}`;
}
