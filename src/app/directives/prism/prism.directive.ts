// src/app/shared/prism.directive.ts
import {
  Directive, ElementRef, Input, OnChanges, SimpleChanges, AfterViewInit, NgZone
} from '@angular/core';
import Prism from 'src/app/prism-setup';

@Directive({ selector: '[appPrism]' })
export class PrismDirective implements OnChanges, AfterViewInit {
  @Input('prism') code = '';
  @Input() language = 'typescript';

  private viewReady = false;

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) { }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.zone.runOutsideAngular(() => queueMicrotask(() => this.highlight()));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewReady && (changes['code'] || changes['language'])) {
      this.zone.runOutsideAngular(() => this.highlight());
    }
  }

  private highlight(): void {
    const lang = (this.language || '').trim().toLowerCase();
    const codeEl = this.el.nativeElement;

    // If already tokenized (Prism added spans), don’t wipe it
    const alreadyTokenized = codeEl.querySelector('.token') !== null;

    if (!alreadyTokenized) {
      // Only set text if we have an input string; avoids clobbering inner HTML
      if (this.code != null) codeEl.textContent = (this.code ?? '').trim();
    }

    // ensure language-* on both <code> and <pre>
    Array.from(codeEl.classList).forEach(c => c.startsWith('language-') && codeEl.classList.remove(c));
    codeEl.classList.add(`language-${lang}`);
    const pre = codeEl.closest('pre');
    if (pre) {
      Array.from(pre.classList).forEach(c => c.startsWith('language-') && pre.classList.remove(c));
      pre.classList.add(`language-${lang}`);
    }

    (Prism as any)?.highlightElement?.(codeEl);
  }
}
