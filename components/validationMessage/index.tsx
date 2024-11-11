interface IMessage {
    message?: string;
    textColor?: string;
    fontSize?: string;
    isItalic?: boolean;
}

export default function ValidationMessage({
    message,
    textColor = "red-600",
    fontSize = "xs",
    isItalic = true
}: IMessage
) {
    return (
        <p
            className={`text-${textColor} text-${fontSize} dark:text-${textColor} font-medium ${isItalic ? 'italic' : 'not-italic'}`}
        >
            {message}
        </p>
    );
};
