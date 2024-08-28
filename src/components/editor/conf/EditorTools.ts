import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import Header from '@editorjs/header';
import InlineCode from '@editorjs/inline-code';
import Table from '@editorjs/table';
import Code from '@editorjs/code';

export const EDITOR_JS_TOOLS: any = {
  embed: { 
    class: Embed,
    config: {
      services: {
        youtube: true,
      }
    }
  },
  code: Code,
  table: Table,
  list: List,
  header: Header,
  inlineCode: InlineCode,
}
