"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const WYSIWYGEditor = ({ content, set_content }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={content}
      onReady={(editor) => {
        editor.ui.view.element.classList.add("w-full");
        editor.ui.view.element.classList.add("prose");
        editor.ui.view.element.classList.add("max-w-none");
        editor.ui.view.element.classList.add("h-full");
        editor.ui.view.element.classList.add("overflow-hidden");
        editor.ui.view.element.classList.add("flex");
        editor.ui.view.element.classList.add("flex-col");
        editor.ui.poweredBy.destroy();
      }}
      onChange={(event, editor) => {
        set_content(editor.getData());
      }}
    />
  );
};

export default WYSIWYGEditor;
