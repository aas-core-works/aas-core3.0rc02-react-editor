// SPDX-FileCopyrightText: 2019-present Yuxi (Evan) You and Vite contributors
// SPDX-FileCopyrightText: 2021 aas-core3.0rc02-react-editor AUTHORS
//
// SPDX-License-Identifier: MIT

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  experimental: {
    renderBuiltUrl(filename) {
      return filename;
    },
  },
});
