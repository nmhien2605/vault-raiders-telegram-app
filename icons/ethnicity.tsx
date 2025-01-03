const Ethnicity = ({
    fill = "#fafafa",
    ...props
}: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={fill}
            height="80px"
            width="80px"
            {...props}
        >
            <g clip-path="url(#clip0_2949_7673)">
                <path d="m3.64 17.7-3.1.77a.7.7 0 0 0-.2 1.3l.54.3a14.3 14.3 0 0 0 7.35 2.05c1.03 0 2.02-.32 2.83-.9a11.6 11.6 0 0 1-7.42-3.52M23.45 18.47l-3.1-.78a11.6 11.6 0 0 1-7.41 3.54c.81.57 1.8.89 2.82.89 2.6 0 5.14-.7 7.36-2.04l.54-.32a.7.7 0 0 0-.21-1.3M16.03 17.76c.92-1.32 1.14-3 .6-4.5L12.66 2.34a.7.7 0 0 0-1.32 0l-3.97 10.9a4.92 4.92 0 0 0 8.66 4.5M8.84 5.1 6.4 3.28a.7.7 0 0 0-1.12.47L4.83 7.1l2.9 1.06z"></path>
                <path d="M2.79 14a10 10 0 0 0 3.88 4.35 6.3 6.3 0 0 1-.62-5.58l1.2-3.28-6.3-2.3a.7.7 0 0 0-.88.96zM19.17 7.11l-.45-3.36a.7.7 0 0 0-1.11-.47L15.16 5.1l1.11 3.07zM17.95 12.77a6.3 6.3 0 0 1-.62 5.58l.13-.08a10 10 0 0 0 3.75-4.28l2.72-5.83a.7.7 0 0 0-.87-.96l-6.3 2.29z"></path>
            </g>
        </svg>
    );
};
export default Ethnicity;
