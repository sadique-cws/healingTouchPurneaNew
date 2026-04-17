export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/healingTouchLogo.jpeg"
            alt="Healing Touch Hospital"
            loading="lazy"
            decoding="async"
        />
    );
}
