import React, { useRef, useMemo, FC } from 'react';
import JoditEditor from 'jodit-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux/redux';
import { setContent } from '../../store/reducers/PostSlice';
import { useDebouncedFunction } from '../../hooks/debounce';

interface Props {
  placeholder: string
}

export const JEditor: FC<Props> = ({ placeholder }) => {
  const editor = useRef(null);
  const content = useAppSelector(state => state.postsReducer.content);
  const dispatch = useAppDispatch();
  const updateValue = (newContent: string) => dispatch(setContent(newContent));
  const debouncedUpdateValue = useDebouncedFunction(updateValue, 1000);

	const config = useMemo(() => ({
			readonly: false,
			placeholder: placeholder || 'Start typings...',
      language: 'ru',
		}),
		[placeholder]
	);

	return (
		<JoditEditor
			ref={editor}
			value={content}
			config={config}
			onBlur={newContent => debouncedUpdateValue(newContent)}
		/>
	);
};

