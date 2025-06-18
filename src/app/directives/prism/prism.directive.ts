import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import * as Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';
// statically import the languages you’ll highlight:
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';      // HTML/XML
import 'prismjs/components/prism-javascript'; // JS base for TS
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-solidity';

@Directive({
  selector: '[appPrism]',
})
export class PrismDirective implements OnChanges {
  @Input('prism') code = '';
  @Input() language = 'typescript';

  private loaded = new Set<string>();

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['code'] || changes['language']) {
      this.highlight();
    }
  }

  private async highlight() {
    const lang = this.language.trim().toLowerCase();

    // if we haven’t loaded this language yet, do so:
    if (!this.loaded.has(lang)) {
      try {
        loadLanguages([lang]);
        this.loaded.add(lang);
      } catch (err) {
        console.error(err);
        console.warn(`Prism: no syntax for "${lang}", falling back to plain text`);
      }
    }

    // set up the element
    const pre = this.el.nativeElement;
    pre.textContent = this.code.trim();
    pre.className = `language-${lang}`;

    // actually highlight
    Prism.highlightElement(pre);
  }
}
