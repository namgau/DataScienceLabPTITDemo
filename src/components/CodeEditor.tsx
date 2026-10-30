'use client';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { EditorView, keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting, indentUnit } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { useLayoutEffect, useMemo, useRef } from 'react';

// Espresso panel tuned to the lab palette: warm dark ground, ember keywords, gold strings.
const theme = EditorView.theme(
  {
    '&': { backgroundColor: 'var(--code-bg)', color: 'var(--code-fg)', fontSize: '14px', borderRadius: '12px' },
    '.cm-content': { fontFamily: 'var(--font-mono), ui-monospace, monospace', padding: '14px 0', caretColor: '#FFB27A' },
    '.cm-gutters': { backgroundColor: 'var(--code-bg)', color: '#8C6E5E', border: 'none', paddingLeft: '6px' },
    '.cm-activeLine': { backgroundColor: 'rgba(255, 178, 122, 0.06)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#E9C4AA' },
    '&.cm-focused': { outline: 'none' },
    '&.cm-focused .cm-cursor': { borderLeftColor: '#FFB27A', borderLeftWidth: '2px' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': { backgroundColor: 'rgba(240, 100, 58, 0.35) !important' },
    '.cm-matchingBracket': { backgroundColor: 'rgba(232, 169, 63, 0.25)', outline: 'none' },
    '.cm-scroller': { lineHeight: '1.6' },
  },
  { dark: true },
);

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword], color: '#FF8A5C', fontWeight: '600' },
  { tag: [t.string, t.special(t.string)], color: '#F2C46D' },
  { tag: [t.number, t.bool, t.null], color: '#F7A8C4' },
  { tag: t.comment, color: '#9C8070', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#9FD8C9' },
  { tag: t.definition(t.variableName), color: '#FFE3CF' },
  { tag: [t.className, t.typeName], color: '#FFCF8A' },
  { tag: [t.operator, t.punctuation], color: '#D8B9A6' },
  { tag: t.self, color: '#FF8A5C', fontStyle: 'italic' },
]);

export function CodeEditor({
  value, onChange, onRun, readOnly = false, label,
}: {
  value: string;
  onChange?: (v: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  label: string;
}) {
  const runRef = useRef(onRun);
  useLayoutEffect(() => {
    runRef.current = onRun;
  });
  const extensions = useMemo(
    () => [
      python(),
      theme,
      syntaxHighlighting(highlight),
      indentUnit.of('    '),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ 'aria-label': label }),
      // The ref is read on keypress, not during render.
      // eslint-disable-next-line react-hooks/refs
      Prec.highest(keymap.of([{ key: 'Shift-Enter', run: () => (runRef.current?.(), true) }])),
    ],
    [label],
  );
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      editable={!readOnly}
      readOnly={readOnly}
      theme="none"
      basicSetup={{ foldGutter: false, highlightActiveLine: !readOnly, highlightActiveLineGutter: !readOnly, autocompletion: true }}
      className="editor"
    />
  );
}
