import '../Button/Button.styles.scss';

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} className="button">
            {props.content}
        </button>
    );
}
