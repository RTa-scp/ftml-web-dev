# FTML/Wikidot Web Previewer
![](https://img.shields.io/github/workflow/status/RTa-scp/ftml-web/deploy?style=flat-square)  
A WebApp to preview FTML, the SCP Foundation's markup language, on the Web.

## Development

This repository uses pnpm for package management.

Install development dependencies and use
```bash
pnpm install
pnpm run dev
```

## References

* [FTML Blocks documentation](https://github.com/scpwiki/wikijump/blob/develop/ftml/docs/Blocks.md)
* [@vscode-ftml](https://www.npmjs.com/package/@vscode-ftml/ftml-wasm)

## License
Copyright (C) 2022- Zokhoi & other vscode-ftml contributors ([vscode-ftml](https://github.com/Zokhoi/vscode-ftml))

Copyright (C) 2022- RTa-technology & other ftml-web contributors (see AUTHORS.md)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/.

## Translate

If you want to help translating Locale Emulator, you can find all strings in

 -  [`index.yaml`](/src/public/locales/index.yaml) in [`src/public/locales/`](/src/public/locales/) folder.
 -  `message.yaml`, `side.ftml`, `top.ftml` in [`src/public/locales/lang`](/src/public/locales/) folder.

After you translated the above files into your language, please inform me by creating a pull request.

## Acknowledgments 
* [Zokhoi/vscode-ftml](https://github.com/Zokhoi/vscode-ftml)
