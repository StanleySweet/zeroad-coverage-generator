# Coverage generator for 0 A.D.: Empires Ascendant JavaScript code.

## Dependencies

- Node JS (Tested with v18.14.2)
- LCOV (Tested with lcov/focal,now 1.14-2 all) There might be a way to run it on windows, I have not tested.
- Yarn (Tested with v18.14.2)

## Usage:

Open the `create-workspace.js` file and change the `zeroadSourceLocation` path to match your 0 A.D. installation. It should point to the folder containing the mods.

Install dependencies:

```sh
$ yarn
```

Then run

```sh
$ yarn run html
```

## Theme

By default, the lcov output generated by genhtml doesn't have a proper dark mode. You can download the css from: https://docs.wildfiregames.com/js-coverage/gcov.css
