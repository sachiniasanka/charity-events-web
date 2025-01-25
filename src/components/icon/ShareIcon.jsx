import CustomIcon from "@/components/ui/CustomIcon";
const ShareIcon = (props) => (
    <CustomIcon {...props}>
        <path
            d="M13 11L21.2 2.80005"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M22 6.8V2H17.2" strokeLinecap="round" strokeLinejoin="round" />
        <path
            d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </CustomIcon>
);

export default ShareIcon;
