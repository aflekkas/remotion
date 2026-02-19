import React from 'react';
import {interpolate} from 'remotion';

const getTypedText = ({
	frame,
	fullText,
	charFrames,
}: {
	frame: number;
	fullText: string;
	charFrames: number;
}): string => {
	const typedChars = Math.min(fullText.length, Math.floor(frame / charFrames));
	return fullText.slice(0, Math.max(0, typedChars));
};

const Cursor: React.FC<{
	frame: number;
	blinkFrames: number;
	color?: string;
}> = ({frame, blinkFrames, color = 'rgba(255,255,255,0.7)'}) => {
	const opacity = interpolate(
		frame % blinkFrames,
		[0, blinkFrames / 2, blinkFrames],
		[1, 0, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<span style={{opacity, color, fontWeight: 300}}>{'|'}</span>
	);
};

export const TypewriterText: React.FC<{
	frame: number;
	text: string;
	charFrames?: number;
	showCursor?: boolean;
	cursorBlinkFrames?: number;
	style?: React.CSSProperties;
}> = ({
	frame,
	text,
	charFrames = 2,
	showCursor = true,
	cursorBlinkFrames = 16,
	style,
}) => {
	const typedText = getTypedText({frame, fullText: text, charFrames});
	const isDone = typedText.length >= text.length;

	return (
		<span style={style}>
			{typedText}
			{showCursor && !isDone ? (
				<Cursor frame={frame} blinkFrames={cursorBlinkFrames} />
			) : null}
		</span>
	);
};
