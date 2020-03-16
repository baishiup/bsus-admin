import React from 'react';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
// language
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/vue/vue';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/css/css';
// theme
import 'codemirror/theme/monokai.css';
// addon
import 'codemirror/addon/selection/active-line.js';
// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js';
import 'codemirror/addon/search/searchcursor.js';
// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/match-highlighter.js';
// keyMap
import 'codemirror/mode/clike/clike.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/keymap/sublime.js';
// foldGutter
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/xml-fold.js';

import './index.less';

const options = {
  tabSize: 4,
  styleActiveLine: true,
  lineNumbers: true,
  lineWrapping: true,
  line: true,
  mode: 'text/x-markdown',
  theme: 'monokai',
  extraKeys: {}
};

interface editorProps {
  value: string;
  onChange: (newCode: string) => void;
}

const Editor = (props: editorProps) => {
  function handleChange(editor: any, data: any, value: string) {
    props.onChange(value);
  }
  return (
    <CodeMirror onBeforeChange={handleChange} className="Editor" value={props.value} options={options}></CodeMirror>
  );
};

export default Editor;
