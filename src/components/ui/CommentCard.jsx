export default function CommentCard({ comment }) {
    const { userId: userData, comment: userComment, createdAt } = comment;

    return (
        <div className="flex py-4">
            <div className="flex justify-center items-start min-w-14 max-w-20">
                <img
                    src={userData?.profileImage || "/images/user.png"}
                    alt={userData?.fullName || "comment author avatar"}
                    className="w-16 rounded-full"
                />
            </div>
            <div className="flex flex-col justify-start items-start px-5">
                <p className="font-semibold mb-1">{userData?.fullName}</p>
                <p>{userComment}</p>
            </div>
        </div>
    );
}
