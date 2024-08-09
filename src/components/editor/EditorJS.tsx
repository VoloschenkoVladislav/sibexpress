import { FC, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./conf/EditorTools";
import { ru } from "./conf/EditorInternationalization";
import SimpleImage from './plugins/SimpleImage';
import './styles/Editor.css';


interface EditorProps {
  data?: OutputData,
  onChange?: (data: OutputData) => void,
	onImageAdded?: () => Promise<string>,
}

export const BlockEditor: FC<EditorProps> = ({ data, onChange, onImageAdded }) => {
	const editorInstance = useRef<EditorJS | null>(null);

	useEffect(() => {
		if (!editorInstance.current) {
			editorInstance.current = new EditorJS({
				holder: "editorjs",
				data: data,
        onChange: async () => {
          if (editorInstance.current && onChange) {
						const outputData = await editorInstance.current.save();
						onChange(outputData);
          }
        },
				tools: {
					...EDITOR_JS_TOOLS,
					simpleImage: {
						class: SimpleImage,
						config: {
							onImageAdded,
						},
					},
				},
				inlineToolbar: ['link', 'bold', 'italic'],
				i18n: ru,
			});
		}
		return () => {
			if (editorInstance.current && editorInstance.current.destroy) {
				editorInstance.current.destroy();
				editorInstance.current = null;
			}
		};
	}, []);

	return (
		<div id="editorjs"></div>
	);
};
