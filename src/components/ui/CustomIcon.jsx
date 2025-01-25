const CustomIcon = ({
                        children,
                        size = "24",
                        className = "",
                        viewBox = "0 0 24 24",
                        stroke = "currentColor",
                        strokeWidth = "2",
                    }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox={viewBox}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {children}
        </svg>
    );
};

export default CustomIcon;
