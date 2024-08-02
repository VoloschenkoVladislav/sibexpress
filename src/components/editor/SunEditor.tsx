import React, { FC } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { SunEditorOptions } from "suneditor/src/options";


interface Props {
  editorContent: string,
  onChange: Function,
  setDefaultStyle?: string,
}

export const SEditor: FC<Props> = props => {
  const options: SunEditorOptions = {
    height: "auto",
    imageUploadSizeLimit: 1000000,
    // imageUploadHeader: {
    //   Authorization: `Bearer ${isAuthenticated}`,
    // },
    // imageUploadUrl:
    //   process.env.NODE_ENV === "development"
    //     ? "http://localhost:8080/api/media/images/new"
    //     : "https://vast-jade-duckling-veil.cyclic.app/api/media/images/new",
    showPathLabel: false,
    resizingBar: false,
    imageAccept: ".jpg, .jpeg, .png, .webp",
    fontSize: [12, 14, 16, 18, 20],
    buttonList: [
      ["undo", "redo"],
      ["removeFormat"],
      ["bold", "underline", "italic", "fontSize"],
      ["fontColor", "hiliteColor"],
      ["align", "horizontalRule", "list"],
      ["table", "link", "image", "imageGallery"],
      ["showBlocks", "codeView"],
    ],
    font: [
      "Roboto",
      "Arial",
      "Comic Sans MS",
      "Courier New",
      "Impact",
      "Georgia",
      "tahoma",
      "Trebuchet MS",
      "Verdana",
    ],
    formats: ["p", "h1", "h2", "h3", "h4"],
  };

  const handleChange = (content: string) => {
    props.onChange(content);
  };

  return (
    <div className={"editContainer"}>
      <SunEditor
        // token={props.token}
        // disable={props.disable}
        // hideToolbar={props.disable}
        setDefaultStyle={props.setDefaultStyle}
        setContents={props.editorContent}
        setOptions={options}
        onChange={handleChange}
      />
    </div>
  );
}
