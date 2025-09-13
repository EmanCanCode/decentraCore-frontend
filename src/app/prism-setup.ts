// Make ONE Prism instance, put it on window, and pre-load the languages you use.
import * as Prism from 'prismjs';

// expose globally so component loaders can attach to the same instance
// (some Prism loaders look for window.Prism)
(window as any).Prism = Prism;

// core + base grammars
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-solidity';
// extras you need
import 'prismjs/components/prism-solidity';

// (optional) plugins you might want, e.g. line-numbers, toolbar, copy-to-clipboard
// import 'prismjs/plugins/line-numbers/prism-line-numbers';
// import 'prismjs/plugins/toolbar/prism-toolbar';
// import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import loadLanguages from 'prismjs/components/index.js';

export default Prism;
