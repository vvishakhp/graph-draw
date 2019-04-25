export default function UUID() {
    var segment = () => {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (segment() + segment() + "-" + segment() + "-" + segment() + "-" + segment() + "-" + segment() + segment() + segment());
}