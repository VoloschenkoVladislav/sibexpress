import { FC, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./conf/EditorTools";
import { ru } from "./conf/EditorInternationalization";
import SimpleImage from './plugins/SimpleImage';
import './styles/Editor.css';


export interface EditorData extends OutputData {};

interface EditorProps {
	readOnly?: boolean,
	initialData?: string,
	editorRenderNum: number,
  onChange?: (data: string) => void,
	onImageAdded?: () => Promise<string>,
	onButtonPressed?: (editor: SimpleImage) => void,
}

export const BlockEditor: FC<EditorProps> = ({ editorRenderNum, initialData, onChange, onImageAdded, onButtonPressed, readOnly }) => {
	const editorInstance = useRef<EditorJS | null>(null);

	useEffect(() => {
		if (!editorInstance.current) {
			const data = initialData ? JSON.parse(initialData) : undefined;
			editorInstance.current = new EditorJS({
				readOnly,
				holder: "editorjs",
				data: data,
        onChange: async () => {
          if (editorInstance.current && onChange) {
						const outputData = await editorInstance.current.save();
						onChange(JSON.stringify(outputData));
          }
        },
				tools: {
					...EDITOR_JS_TOOLS,
					simpleImage: {
						class: SimpleImage,
						config: {
							onImageAdded,
							onButtonPressed
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
	// eslint-disable-next-line
	}, [editorRenderNum]);

	return (
		<div id="editorjs"></div>
	);
};
