import './Label.styles.scss';

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label className="label" {...props}>
            text
        </label>
    );
}
